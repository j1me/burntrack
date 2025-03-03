import { FoodItem } from '../types';
import { generateId } from './helpers';

// Function to load food items from CSV file
export const loadFoodItemsFromCSV = async (): Promise<FoodItem[]> => {
  try {
    console.log('Attempting to load CSV file from /data/indian_foods.csv');
    const response = await fetch('/data/indian_foods.csv');
    
    if (!response.ok) {
      console.error('Failed to fetch CSV file:', response.status, response.statusText);
      return sampleFoodItems;
    }
    
    const csvText = await response.text();
    console.log('CSV loaded, length:', csvText.length);
    
    // Parse CSV
    const lines = csvText.split('\n');
    console.log('Number of lines in CSV:', lines.length);
    
    const headers = lines[0].split(',');
    console.log('CSV headers:', headers);
    
    const foodItems: FoodItem[] = [];
    
    // Start from index 1 to skip headers
    for (let i = 1; i < lines.length; i++) {
      if (!lines[i].trim()) continue; // Skip empty lines
      
      const values = lines[i].split(',');
      
      if (values.length < 4) {
        console.warn(`Skipping line ${i} due to insufficient values:`, lines[i]);
        continue;
      }
      
      const item: FoodItem = {
        id: generateId(),
        name: values[0],
        calories: parseFloat(values[1]),
        servingSize: parseFloat(values[2]),
        servingUnit: values[3],
        protein: values[4] ? parseFloat(values[4]) : undefined,
        carbs: values[5] ? parseFloat(values[5]) : undefined,
        fat: values[6] ? parseFloat(values[6]) : undefined,
        isCustom: values[7] === 'true'
      };
      
      foodItems.push(item);
    }
    
    console.log('Successfully loaded food items from CSV:', foodItems.length);
    return foodItems;
  } catch (error) {
    console.error('Error loading food items from CSV:', error);
    return sampleFoodItems; // Fallback to sample food items
  }
};

// Sample food database (fallback)
export const sampleFoodItems: FoodItem[] = [
  {
    id: generateId(),
    name: 'Chapati',
    calories: 120,
    servingSize: 1,
    servingUnit: 'piece',
    protein: 3,
    carbs: 20,
    fat: 2.7,
    isCustom: false
  },
  {
    id: generateId(),
    name: 'Dal Makhani',
    calories: 230,
    servingSize: 100,
    servingUnit: 'g',
    protein: 9,
    carbs: 20,
    fat: 12,
    isCustom: false
  },
  {
    id: generateId(),
    name: 'Paneer Butter Masala',
    calories: 350,
    servingSize: 100,
    servingUnit: 'g',
    protein: 15,
    carbs: 10,
    fat: 28,
    isCustom: false
  },
  // Keep a few more sample items as fallback
  {
    id: generateId(),
    name: 'Chicken Biryani',
    calories: 250,
    servingSize: 100,
    servingUnit: 'g',
    protein: 15,
    carbs: 30,
    fat: 8,
    isCustom: false
  },
  {
    id: generateId(),
    name: 'Samosa',
    calories: 260,
    servingSize: 1,
    servingUnit: 'piece',
    protein: 4,
    carbs: 30,
    fat: 14,
    isCustom: false
  }
];

// Function to initialize the food database
export const initializeFoodDatabase = async (existingFoodItems: FoodItem[]): Promise<FoodItem[]> => {
  try {
    console.log('Initializing food database with existing items:', existingFoodItems.length);
    
    // Load foods from CSV
    const csvFoodItems = await loadFoodItemsFromCSV();
    console.log('Loaded CSV food items:', csvFoodItems.length);
    
    if (existingFoodItems.length === 0) {
      // If no existing items, just return the CSV items
      return csvFoodItems;
    }
    
    // If there are existing items, keep only the custom ones and merge with CSV items
    const customFoodItems = existingFoodItems.filter(item => item.isCustom);
    console.log('Keeping custom food items:', customFoodItems.length);
    
    // Combine CSV items with custom items
    return [...csvFoodItems, ...customFoodItems];
  } catch (error) {
    console.error('Error initializing food database:', error);
    
    // If there's an error, return existing items or sample items as fallback
    return existingFoodItems.length > 0 ? existingFoodItems : sampleFoodItems;
  }
};

// Function to search food items
export const searchFoodItems = (foodItems: FoodItem[], query: string): FoodItem[] => {
  if (!query || query.trim() === '') {
    return foodItems;
  }
  
  const normalizedQuery = query.toLowerCase().trim();
  
  return foodItems.filter(item => 
    item.name.toLowerCase().includes(normalizedQuery)
  );
}; 