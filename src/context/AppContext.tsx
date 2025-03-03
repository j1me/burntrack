import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { DailyLog, FoodEntry, FoodItem, UserProfile, WeightEntry } from '../types';
import * as localStorage from '../utils/localStorage';
import { generateId, getTodayFormatted } from '../utils/helpers';
import { calculateDailyCalorieNeeds } from '../utils/calculations';
import { initializeFoodDatabase, sampleFoodItems } from '../utils/foodDatabase';

interface AppContextType {
  // User Profile
  userProfile: UserProfile | null;
  setUserProfile: (profile: UserProfile) => void;
  isProfileComplete: boolean;
  
  // Food Items
  foodItems: FoodItem[];
  addFoodItem: (item: FoodItem) => void;
  updateFoodItem: (item: FoodItem) => void;
  deleteFoodItem: (id: string) => void;
  
  // Food Entries
  selectedDate: string;
  setSelectedDate: (date: string) => void;
  dailyLog: DailyLog | null;
  addFoodEntry: (entry: Omit<FoodEntry, 'id' | 'createdAt'>) => void;
  updateFoodEntry: (entry: FoodEntry) => void;
  deleteFoodEntry: (id: string) => void;
  
  // Weight Entries
  weightEntries: WeightEntry[];
  addWeightEntry: (entry: Omit<WeightEntry, 'id'>) => void;
  
  // Misc
  resetApp: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

interface AppProviderProps {
  children: ReactNode;
}

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  // User Profile State
  const [userProfile, setUserProfileState] = useState<UserProfile | null>(null);
  const [isProfileComplete, setIsProfileComplete] = useState<boolean>(false);
  
  // Food Items State
  const [foodItems, setFoodItems] = useState<FoodItem[]>([]);
  
  // Food Entries State
  const [selectedDate, setSelectedDate] = useState<string>(getTodayFormatted());
  const [dailyLog, setDailyLog] = useState<DailyLog | null>(null);
  
  // Weight Entries State
  const [weightEntries, setWeightEntries] = useState<WeightEntry[]>([]);
  
  // Initialize data from localStorage
  useEffect(() => {
    // Load user profile
    const storedProfile = localStorage.getUserProfile();
    if (storedProfile) {
      setUserProfileState(storedProfile);
      setIsProfileComplete(true);
    }
    
    // Load food items and initialize with sample data if empty
    const storedFoodItems = localStorage.getFoodItems();
    
    // Initialize food database asynchronously
    const initializeFoods = async () => {
      try {
        const initializedFoodItems = await initializeFoodDatabase(storedFoodItems);
        setFoodItems(initializedFoodItems);
        localStorage.saveFoodItems(initializedFoodItems);
      } catch (error) {
        console.error('Error initializing food database:', error);
        // Fallback to sample food items if there's an error
        setFoodItems(sampleFoodItems);
        localStorage.saveFoodItems(sampleFoodItems);
      }
    };
    
    initializeFoods();
    
    // Load weight entries
    const storedWeightEntries = localStorage.getWeightEntries();
    setWeightEntries(storedWeightEntries);
  }, []);
  
  // Update daily log when selected date or food entries change
  useEffect(() => {
    const log = localStorage.getDailyLog(selectedDate);
    setDailyLog(log);
  }, [selectedDate]);
  
  // User Profile Functions
  const setUserProfile = (profile: UserProfile) => {
    // Calculate daily calorie needs
    const goalCalories = calculateDailyCalorieNeeds(profile);
    const updatedProfile = { ...profile, goalCalories };
    
    localStorage.saveUserProfile(updatedProfile);
    setUserProfileState(updatedProfile);
    setIsProfileComplete(true);
    
    // Add initial weight entry if it's a new profile
    if (!userProfile) {
      const weightEntry: WeightEntry = {
        date: getTodayFormatted(),
        weight: profile.weight
      };
      localStorage.addWeightEntry(weightEntry);
      setWeightEntries([...weightEntries, weightEntry]);
    }
  };
  
  // Food Item Functions
  const addFoodItem = (item: FoodItem) => {
    const newItem = { ...item, id: generateId() };
    localStorage.addFoodItem(newItem);
    setFoodItems([...foodItems, newItem]);
  };
  
  const updateFoodItem = (item: FoodItem) => {
    localStorage.updateFoodItem(item);
    setFoodItems(foodItems.map(i => i.id === item.id ? item : i));
  };
  
  const deleteFoodItem = (id: string) => {
    localStorage.deleteFoodItem(id);
    setFoodItems(foodItems.filter(item => item.id !== id));
  };
  
  // Food Entry Functions
  const addFoodEntry = (entry: Omit<FoodEntry, 'id' | 'createdAt'>) => {
    const newEntry: FoodEntry = {
      ...entry,
      id: generateId(),
      createdAt: new Date().toISOString()
    };
    
    localStorage.addFoodEntry(newEntry);
    
    // Update daily log
    const updatedLog = localStorage.getDailyLog(selectedDate);
    setDailyLog(updatedLog);
  };
  
  const updateFoodEntry = (entry: FoodEntry) => {
    localStorage.updateFoodEntry(entry);
    
    // Update daily log
    const updatedLog = localStorage.getDailyLog(selectedDate);
    setDailyLog(updatedLog);
  };
  
  const deleteFoodEntry = (id: string) => {
    localStorage.deleteFoodEntry(id);
    
    // Update daily log
    const updatedLog = localStorage.getDailyLog(selectedDate);
    setDailyLog(updatedLog);
  };
  
  // Weight Entry Functions
  const addWeightEntry = (entry: Omit<WeightEntry, 'id'>) => {
    localStorage.addWeightEntry(entry);
    
    // Update weight entries
    const updatedEntries = localStorage.getWeightEntries();
    setWeightEntries(updatedEntries);
    
    // Update user profile with new weight
    if (userProfile) {
      const updatedProfile = {
        ...userProfile,
        weight: entry.weight,
        updatedAt: new Date().toISOString()
      };
      localStorage.saveUserProfile(updatedProfile);
      setUserProfileState(updatedProfile);
    }
  };
  
  // Reset App
  const resetApp = () => {
    localStorage.clearAllData();
    setUserProfileState(null);
    setIsProfileComplete(false);
    
    // Reinitialize food items with sample data
    // Use sampleFoodItems immediately for UI responsiveness
    setFoodItems(sampleFoodItems);
    localStorage.saveFoodItems(sampleFoodItems);
    
    // Then asynchronously load the full database
    initializeFoodDatabase([])
      .then(foodItems => {
        setFoodItems(foodItems);
        localStorage.saveFoodItems(foodItems);
      })
      .catch(error => {
        console.error('Error reinitializing food database:', error);
      });
    
    setWeightEntries([]);
    setDailyLog(null);
  };
  
  const value = {
    userProfile,
    setUserProfile,
    isProfileComplete,
    foodItems,
    addFoodItem,
    updateFoodItem,
    deleteFoodItem,
    selectedDate,
    setSelectedDate,
    dailyLog,
    addFoodEntry,
    updateFoodEntry,
    deleteFoodEntry,
    weightEntries,
    addWeightEntry,
    resetApp
  };
  
  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = (): AppContextType => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
}; 