// User profile types
export interface UserProfile {
  id: string;
  name: string;
  age: number;
  gender: 'male' | 'female' | 'other';
  height: number; // in cm
  weight: number; // in kg
  activityLevel: ActivityLevel;
  weightGoal: WeightGoal;
  goalCalories: number;
  createdAt: string;
  updatedAt: string;
}

export type ActivityLevel = 'sedentary' | 'light' | 'moderate' | 'active' | 'very_active';
export type WeightGoal = 'lose' | 'maintain' | 'gain';

export interface BMIResult {
  bmi: number;
  category: BMICategory;
}

export type BMICategory = 'underweight' | 'normal' | 'overweight' | 'obese';

// Food tracking types
export interface FoodItem {
  id: string;
  name: string;
  calories: number;
  servingSize: number;
  servingUnit: string;
  protein?: number;
  carbs?: number;
  fat?: number;
  isCustom: boolean;
}

export type MealType = 'breakfast' | 'lunch' | 'dinner' | 'snack';

export interface FoodEntry {
  id: string;
  foodItemId: string;
  foodItem: FoodItem;
  servings: number;
  mealType: MealType;
  date: string;
  createdAt: string;
}

export interface DailyLog {
  date: string;
  entries: FoodEntry[];
  totalCalories: number;
  goalCalories: number;
}

// Dashboard types
export interface WeightEntry {
  date: string;
  weight: number;
}

export interface CalorieGoal {
  date: string;
  goal: number;
  actual: number;
} 