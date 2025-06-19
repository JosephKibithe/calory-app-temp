import { supabase } from "./supabase";
import {
  UserProfile,
  FoodItem,
  DailyNutrition,
  Meal,
  MealItem,
} from "./models";

// User Profile API
export const userProfileApi = {
  // Get the current user's profile
  async getProfile(): Promise<UserProfile | null> {
    const { data: user } = await supabase.auth.getUser();

    if (!user.user) return null;

    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.user.id)
      .single();

    if (error) {
      console.error("Error fetching profile:", error);
      return null;
    }

    return data as UserProfile;
  },

  // Create or update a user profile
  async upsertProfile(
    profile: Partial<UserProfile>
  ): Promise<UserProfile | null> {
    const { data: user } = await supabase.auth.getUser();

    if (!user.user) return null;

    const { data, error } = await supabase
      .from("profiles")
      .upsert({
        id: user.user.id,
        ...profile,
        updated_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) {
      console.error("Error updating profile:", error);
      return null;
    }

    return data as UserProfile;
  },
};

// Food Items API
export const foodItemsApi = {
  // Add a new food item
  async addFoodItem(
    foodItem: Omit<FoodItem, "id" | "created_by" | "created_at">
  ): Promise<FoodItem | null> {
    console.log(
      "[FOOD_ITEM_API] Attempting to add food item:",
      JSON.stringify(foodItem, null, 2)
    );

    // Comprehensive input validation
    const validationErrors: string[] = [];

    if (!foodItem.name || foodItem.name.trim() === "") {
      validationErrors.push("Food item name is required");
    }

    if (foodItem.calories === undefined || foodItem.calories < 0) {
      validationErrors.push("Invalid calories value");
    }

    if (validationErrors.length > 0) {
      console.error("[FOOD_ITEM_API] Validation errors:", validationErrors);
      return null;
    }

    // Get current user with detailed logging
    const { data: userData, error: userError } = await supabase.auth.getUser();

    if (userError) {
      console.error("[FOOD_ITEM_API] Authentication error:", {
        message: userError.message,
        status: userError.status,
        code: userError.code,
      });
      return null;
    }

    if (!userData.user) {
      console.error("[FOOD_ITEM_API] No authenticated user found");
      return null;
    }

    console.log("[FOOD_ITEM_API] Authenticated user:", userData.user.id);

    try {
      // Prepare food item data for insertion
      const foodItemToInsert = {
        name: foodItem.name,
        calories: foodItem.calories,
        protein: foodItem.protein || null,
        carbs: foodItem.carbs || null,
        fat: foodItem.fat || null,
        created_by: userData.user.id,
        // Note: meal_type is stored in the meals table, not food_items
        // Additional properties like quantity and verified aren't in DB schema
      };

      console.log(
        "[FOOD_ITEM_API] Prepared food item for insertion:",
        JSON.stringify(foodItemToInsert, null, 2)
      );

      // Perform database insertion with detailed error handling
      const { data, error } = await supabase
        .from("food_items")
        .insert(foodItemToInsert)
        .select()
        .single();

      if (error) {
        console.error("[FOOD_ITEM_API] Supabase insertion error:", {
          message: error.message,
          details: error.details,
          code: error.code,
          hint: error.hint,
        });
        return null;
      }

      console.log(
        "[FOOD_ITEM_API] Food item added successfully:",
        JSON.stringify(data, null, 2)
      );
      return data as FoodItem;
    } catch (err) {
      console.error("[FOOD_ITEM_API] Unexpected error adding food item:", err);
      return null;
    }
  },

  // Save a complete meal with multiple food items at once
  async saveMealWithFoodItems(
    mealType: "breakfast" | "lunch" | "dinner" | "snack",
    foodItems: Array<Omit<FoodItem, "id" | "created_by" | "created_at">>
  ): Promise<{ success: boolean; message: string }> {
    console.log("[FOOD_ITEM_API] Saving meal with multiple food items:", {
      mealType,
      itemCount: foodItems.length,
    });

    // Validate input
    if (!foodItems || foodItems.length === 0) {
      return { success: false, message: "No food items provided" };
    }

    // Get current user
    const { data: userData, error: userError } = await supabase.auth.getUser();

    if (userError || !userData?.user) {
      console.error("[FOOD_ITEM_API] Authentication error:", userError);
      return { success: false, message: "Authentication error" };
    }

    const userId = userData.user.id;

    try {
      // 1. First create the meal entry
      console.log("[FOOD_ITEM_API] Creating meal entry");
      const { data: mealData, error: mealError } = await supabase
        .from("meals")
        .insert({
          user_id: userId,
          meal_type: mealType,
          consumed_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (mealError) {
        console.error("[FOOD_ITEM_API] Error creating meal:", mealError);
        return {
          success: false,
          message: `Error creating meal: ${mealError.message}`,
        };
      }

      console.log("[FOOD_ITEM_API] Meal created:", mealData);
      const mealId = mealData.id;

      // 2. Insert all food items
      const foodItemInsertions = [];
      const mealItemsToInsert = [];

      for (const item of foodItems) {
        // Skip items with no calories
        if (!item.calories) continue;

        const foodItemToInsert = {
          name: item.name,
          calories: item.calories,
          protein: item.protein || 0,
          carbs: item.carbs || 0,
          fat: item.fat || 0,
          created_by: userId,
        };

        console.log("[FOOD_ITEM_API] Inserting food item:", foodItemToInsert);

        const { data: foodItemData, error: foodItemError } = await supabase
          .from("food_items")
          .insert(foodItemToInsert)
          .select()
          .single();

        if (foodItemError) {
          console.error(
            "[FOOD_ITEM_API] Error inserting food item:",
            foodItemError
          );
          continue; // Skip this item but continue with others
        }

        // Store the food item for meal_items insertion
        foodItemInsertions.push(foodItemData);

        // Prepare meal_items junction entry
        mealItemsToInsert.push({
          meal_id: mealId,
          food_item_id: foodItemData.id,
          servings: 1.0, // Default to 1 serving
        });
      }

      if (foodItemInsertions.length === 0) {
        // No food items were successfully inserted, roll back the meal
        console.error(
          "[FOOD_ITEM_API] No food items were successfully inserted, rolling back meal"
        );
        await supabase.from("meals").delete().eq("id", mealId);
        return { success: false, message: "Failed to insert any food items" };
      }

      // 3. Insert meal_items to connect food items to the meal
      console.log("[FOOD_ITEM_API] Inserting meal items:", mealItemsToInsert);
      const { error: mealItemsError } = await supabase
        .from("meal_items")
        .insert(mealItemsToInsert);

      if (mealItemsError) {
        console.error(
          "[FOOD_ITEM_API] Error inserting meal items:",
          mealItemsError
        );
        // Don't roll back here as we already have valid food items
        return {
          success: true,
          message: `Saved ${foodItemInsertions.length} food items, but failed to link some items to the meal`,
        };
      }

      console.log("[FOOD_ITEM_API] Successfully saved meal with food items:", {
        mealId,
        foodItemCount: foodItemInsertions.length,
      });

      return {
        success: true,
        message: `Successfully saved meal with ${foodItemInsertions.length} food items`,
      };
    } catch (err: any) {
      console.error(
        "[FOOD_ITEM_API] Unexpected error saving meal with food items:",
        err
      );
      return { success: false, message: `Unexpected error: ${err.message}` };
    }
  },

  // Get food items for a specific date
  async getFoodItemsByDate(date: string): Promise<FoodItem[]> {
    const { data: user } = await supabase.auth.getUser();

    if (!user.user) return [];

    const { data, error } = await supabase
      .from("food_items")
      .select("*")
      .eq("user_id", user.user.id)
      .eq("date", date)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching food items:", error);
      return [];
    }

    return data as FoodItem[];
  },

  // Delete a food item
  async deleteFoodItem(id: string): Promise<boolean> {
    const { error } = await supabase.from("food_items").delete().eq("id", id);

    if (error) {
      console.error("Error deleting food item:", error);
      return false;
    }

    return true;
  },
};

// Daily Nutrition API
export const nutritionApi = {
  // Get or create daily nutrition summary
  async getDailyNutrition(date: string): Promise<DailyNutrition | null> {
    const { data: user } = await supabase.auth.getUser();

    if (!user.user) return null;

    // Try to get existing record
    const { data: existingData, error: fetchError } = await supabase
      .from("daily_nutrition")
      .select("*")
      .eq("user_id", user.user.id)
      .eq("date", date)
      .single();

    if (existingData) {
      return existingData as DailyNutrition;
    }

    // Create new record if none exists
    if (fetchError && fetchError.code === "PGRST116") {
      const { data: newData, error: insertError } = await supabase
        .from("daily_nutrition")
        .insert({
          user_id: user.user.id,
          date,
          total_calories: 0,
          total_protein: 0,
          total_carbs: 0,
          total_fat: 0,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (insertError) {
        console.error("Error creating daily nutrition:", insertError);
        return null;
      }

      return newData as DailyNutrition;
    }

    console.error("Error fetching daily nutrition:", fetchError);
    return null;
  },

  // Update daily nutrition
  async updateDailyNutrition(
    id: string,
    data: Partial<DailyNutrition>
  ): Promise<DailyNutrition | null> {
    const { data: updatedData, error } = await supabase
      .from("daily_nutrition")
      .update({
        ...data,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("Error updating daily nutrition:", error);
      return null;
    }

    return updatedData as DailyNutrition;
  },
};

// Meals API
export const mealsApi = {
  // Save a new meal with its items
  async saveMeal(mealData: {
    meal_type: string;
    consumed_at?: Date;
    items: Array<{
      food_item_id: number;
      servings: number;
    }>;
  }): Promise<Meal | null> {
    const { data: userData, error: userError } = await supabase.auth.getUser();
    if (userError || !userData.user) {
      console.error("[MEAL_API] Authentication error:", userError);
      return null;
    }

    try {
      const { data: mealResult, error: mealError } = await supabase
        .from("meals")
        .insert({
          user_id: userData.user.id,
          meal_type: mealData.meal_type,
          consumed_at: (mealData.consumed_at || new Date()).toISOString(),
        })
        .select()
        .single();

      if (mealError) {
        console.error("[MEAL_API] Error saving meal:", mealError);
        return null;
      }

      const mealItemsToInsert = mealData.items.map((item) => ({
        meal_id: mealResult.id,
        food_item_id: item.food_item_id,
        servings: item.servings,
      }));

      const { error: mealItemsError } = await supabase
        .from("meal_items")
        .insert(mealItemsToInsert);

      if (mealItemsError) {
        console.error("[MEAL_API] Error saving meal items:", mealItemsError);
        await supabase.from("meals").delete().eq("id", mealResult.id); // Rollback meal if items fail
        return null;
      }

      console.log("[MEAL_API] Meal and items saved successfully:", mealResult);
      return mealResult;
    } catch (error) {
      console.error("[MEAL_API] Unexpected error saving meal:", error);
      return null;
    }
  },

  // Get meals for a specific date
  async getMealsByDate(date: string): Promise<Meal[]> {
    const { data: user } = await supabase.auth.getUser();

    if (!user.user) return [];

    const { data, error } = await supabase
      .from("meals")
      .select(
        `
        *,
        meal_items (
          *,
          food_items (*)
        )
      `
      )
      .eq("user_id", user.user.id)
      .gte("consumed_at", `${date}T00:00:00`)
      .lte("consumed_at", `${date}T23:59:59`)
      .order("consumed_at", { ascending: true });

    if (error) {
      console.error("Error fetching meals:", error);
      return [];
    }

    return data as Meal[];
  },

  // Delete a meal
  async deleteMeal(mealId: number): Promise<boolean> {
    const { error } = await supabase.from("meals").delete().eq("id", mealId);

    if (error) {
      console.error("Error deleting meal:", error);
      return false;
    }

    return true;
  },
};

export async function saveMeal(
  userId: string,
  mealType: string,
  foodItems: { id: number; servings: number }[]
) {
  try {
    // Insert into the meals table
    const { data: meal, error: mealError } = await supabase
      .from("meals")
      .insert([{ user_id: userId, meal_type: mealType }])
      .select()
      .single();

    if (mealError) {
      console.error("Error inserting meal:", mealError);
      return { success: false, error: mealError.message };
    }

    // Insert into the meal_items table
    const mealItems = foodItems.map((item) => ({
      meal_id: meal.id,
      food_item_id: item.id,
      servings: item.servings,
    }));

    const { error: mealItemsError } = await supabase
      .from("meal_items")
      .insert(mealItems);

    if (mealItemsError) {
      console.error("Error inserting meal items:", mealItemsError);
      return { success: false, error: mealItemsError.message };
    }

    return { success: true, mealId: meal.id };
  } catch (error) {
    console.error("Unexpected error saving meal:", error);
    return { success: false, error: "Unexpected error occurred" };
  }
}
