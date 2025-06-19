// User profile model
export interface UserProfile {
  id: string;
  email: string;
  full_name?: string;
  avatar_url?: string;
  gender?: "male" | "female" | "other";
  age?: number;
  height?: number;
  weight?: number;
  activity_level?:
    | "sedentary"
    | "light"
    | "moderate"
    | "active"
    | "very_active";
  goal?: "lose_weight" | "maintain" | "gain_weight";
  calorie_target?: number;
  protein_target?: number;
  carbs_target?: number;
  fat_target?: number;
  created_at: string;
  updated_at: string;
}

// Food item model
export interface FoodItem {
  id: number;
  name: string;
  calories: number;
  protein?: number;
  carbs?: number;
  fat?: number;
  created_by: string;
  created_at: string;
  meal_type?: "breakfast" | "lunch" | "dinner" | "snack";
  quantity?: string;
  verified?: boolean;
}

// Daily nutrition summary
export interface DailyNutrition {
  id: string;
  user_id: string;
  date: string;
  total_calories: number;
  total_protein: number;
  total_carbs: number;
  total_fat: number;
  water_intake?: number;
  created_at: string;
  updated_at: string;
}

// Meal model
export interface Meal {
  id: number;
  user_id: string;
  meal_type: "breakfast" | "lunch" | "dinner" | "snack";
  consumed_at: string;
  created_at: string;
}

// Meal item model
export interface MealItem {
  id: number;
  meal_id: number;
  food_item_id: number;
  servings: number;
  created_at: string;
}
