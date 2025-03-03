import { DailyLog, FoodEntry, FoodItem, UserProfile, WeightEntry } from '../types';

// Local storage keys
export const STORAGE_KEYS = {
  USER_PROFILE: 'burntrack_userProfile',
  FOOD_ITEMS: 'burntrack_foodItems',
  FOOD_ENTRIES: 'burntrack_foodEntries',
  WEIGHT_ENTRIES: 'burntrack_weightEntries',
};

// User Profile
export const saveUserProfile = (userProfile: UserProfile): void => {
  localStorage.setItem(STORAGE_KEYS.USER_PROFILE, JSON.stringify(userProfile));
};

export const getUserProfile = (): UserProfile | null => {
  const data = localStorage.getItem(STORAGE_KEYS.USER_PROFILE);
  return data ? JSON.parse(data) : null;
};

// Food Items
export const saveFoodItems = (foodItems: FoodItem[]): void => {
  localStorage.setItem(STORAGE_KEYS.FOOD_ITEMS, JSON.stringify(foodItems));
};

export const getFoodItems = (): FoodItem[] => {
  const data = localStorage.getItem(STORAGE_KEYS.FOOD_ITEMS);
  return data ? JSON.parse(data) : [];
};

export const addFoodItem = (foodItem: FoodItem): void => {
  const foodItems = getFoodItems();
  foodItems.push(foodItem);
  saveFoodItems(foodItems);
};

export const updateFoodItem = (updatedFoodItem: FoodItem): void => {
  const foodItems = getFoodItems();
  const index = foodItems.findIndex(item => item.id === updatedFoodItem.id);
  
  if (index !== -1) {
    foodItems[index] = updatedFoodItem;
    saveFoodItems(foodItems);
  }
};

export const deleteFoodItem = (foodItemId: string): void => {
  const foodItems = getFoodItems();
  const updatedFoodItems = foodItems.filter(item => item.id !== foodItemId);
  saveFoodItems(updatedFoodItems);
};

// Food Entries
export const saveFoodEntries = (foodEntries: FoodEntry[]): void => {
  localStorage.setItem(STORAGE_KEYS.FOOD_ENTRIES, JSON.stringify(foodEntries));
};

export const getFoodEntries = (): FoodEntry[] => {
  const data = localStorage.getItem(STORAGE_KEYS.FOOD_ENTRIES);
  return data ? JSON.parse(data) : [];
};

export const addFoodEntry = (foodEntry: FoodEntry): void => {
  const foodEntries = getFoodEntries();
  foodEntries.push(foodEntry);
  saveFoodEntries(foodEntries);
};

export const updateFoodEntry = (updatedFoodEntry: FoodEntry): void => {
  const foodEntries = getFoodEntries();
  const index = foodEntries.findIndex(entry => entry.id === updatedFoodEntry.id);
  
  if (index !== -1) {
    foodEntries[index] = updatedFoodEntry;
    saveFoodEntries(foodEntries);
  }
};

export const deleteFoodEntry = (foodEntryId: string): void => {
  const foodEntries = getFoodEntries();
  const updatedFoodEntries = foodEntries.filter(entry => entry.id !== foodEntryId);
  saveFoodEntries(updatedFoodEntries);
};

export const getFoodEntriesByDate = (date: string): FoodEntry[] => {
  const foodEntries = getFoodEntries();
  return foodEntries.filter(entry => entry.date === date);
};

// Daily Log
export const getDailyLog = (date: string): DailyLog => {
  const foodEntries = getFoodEntriesByDate(date);
  const userProfile = getUserProfile();
  
  const totalCalories = foodEntries.reduce((total, entry) => {
    return total + (entry.foodItem.calories * entry.servings);
  }, 0);
  
  return {
    date,
    entries: foodEntries,
    totalCalories,
    goalCalories: userProfile?.goalCalories || 2000,
  };
};

// Weight Entries
export const saveWeightEntries = (weightEntries: WeightEntry[]): void => {
  localStorage.setItem(STORAGE_KEYS.WEIGHT_ENTRIES, JSON.stringify(weightEntries));
};

export const getWeightEntries = (): WeightEntry[] => {
  const data = localStorage.getItem(STORAGE_KEYS.WEIGHT_ENTRIES);
  return data ? JSON.parse(data) : [];
};

export const addWeightEntry = (weightEntry: WeightEntry): void => {
  const weightEntries = getWeightEntries();
  
  // Check if an entry for this date already exists
  const existingIndex = weightEntries.findIndex(entry => entry.date === weightEntry.date);
  
  if (existingIndex !== -1) {
    // Update existing entry
    weightEntries[existingIndex] = weightEntry;
  } else {
    // Add new entry
    weightEntries.push(weightEntry);
  }
  
  saveWeightEntries(weightEntries);
};

// Clear all data
export const clearAllData = (): void => {
  localStorage.removeItem(STORAGE_KEYS.USER_PROFILE);
  localStorage.removeItem(STORAGE_KEYS.FOOD_ITEMS);
  localStorage.removeItem(STORAGE_KEYS.FOOD_ENTRIES);
  localStorage.removeItem(STORAGE_KEYS.WEIGHT_ENTRIES);
}; 