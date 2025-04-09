import { supabase } from './supabase';
import { UserProfile, FoodItem, DailyNutrition } from './models';

// User Profile API
export const userProfileApi = {
  // Get the current user's profile
  async getProfile(): Promise<UserProfile | null> {
    const { data: user } = await supabase.auth.getUser();
    
    if (!user.user) return null;
    
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.user.id)
      .single();
    
    if (error) {
      console.error('Error fetching profile:', error);
      return null;
    }
    
    return data as UserProfile;
  },
  
  // Create or update a user profile
  async upsertProfile(profile: Partial<UserProfile>): Promise<UserProfile | null> {
    const { data: user } = await supabase.auth.getUser();
    
    if (!user.user) return null;
    
    const { data, error } = await supabase
      .from('profiles')
      .upsert({
        id: user.user.id,
        ...profile,
        updated_at: new Date().toISOString(),
      })
      .select()
      .single();
    
    if (error) {
      console.error('Error updating profile:', error);
      return null;
    }
    
    return data as UserProfile;
  },
};

// Food Items API
export const foodItemsApi = {
  // Add a new food item
  async addFoodItem(foodItem: Omit<FoodItem, 'id' | 'user_id' | 'created_at'>): Promise<FoodItem | null> {
    const { data: user } = await supabase.auth.getUser();
    
    if (!user.user) return null;
    
    const { data, error } = await supabase
      .from('food_items')
      .insert({
        user_id: user.user.id,
        ...foodItem,
        created_at: new Date().toISOString(),
      })
      .select()
      .single();
    
    if (error) {
      console.error('Error adding food item:', error);
      return null;
    }
    
    return data as FoodItem;
  },
  
  // Get food items for a specific date
  async getFoodItemsByDate(date: string): Promise<FoodItem[]> {
    const { data: user } = await supabase.auth.getUser();
    
    if (!user.user) return [];
    
    const { data, error } = await supabase
      .from('food_items')
      .select('*')
      .eq('user_id', user.user.id)
      .eq('date', date)
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching food items:', error);
      return [];
    }
    
    return data as FoodItem[];
  },
  
  // Delete a food item
  async deleteFoodItem(id: string): Promise<boolean> {
    const { error } = await supabase
      .from('food_items')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error('Error deleting food item:', error);
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
      .from('daily_nutrition')
      .select('*')
      .eq('user_id', user.user.id)
      .eq('date', date)
      .single();
    
    if (existingData) {
      return existingData as DailyNutrition;
    }
    
    // Create new record if none exists
    if (fetchError && fetchError.code === 'PGRST116') {
      const { data: newData, error: insertError } = await supabase
        .from('daily_nutrition')
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
        console.error('Error creating daily nutrition:', insertError);
        return null;
      }
      
      return newData as DailyNutrition;
    }
    
    console.error('Error fetching daily nutrition:', fetchError);
    return null;
  },
  
  // Update daily nutrition
  async updateDailyNutrition(id: string, data: Partial<DailyNutrition>): Promise<DailyNutrition | null> {
    const { data: updatedData, error } = await supabase
      .from('daily_nutrition')
      .update({
        ...data,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      console.error('Error updating daily nutrition:', error);
      return null;
    }
    
    return updatedData as DailyNutrition;
  },
};
