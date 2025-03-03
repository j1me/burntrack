import { ActivityLevel, BMICategory, BMIResult, UserProfile, WeightGoal } from '../types';

/**
 * Calculate BMI (Body Mass Index)
 * Formula: weight (kg) / (height (m) * height (m))
 */
export const calculateBMI = (weight: number, height: number): BMIResult => {
  // Convert height from cm to meters
  const heightInMeters = height / 100;
  const bmi = weight / (heightInMeters * heightInMeters);
  
  let category: BMICategory;
  if (bmi < 18.5) {
    category = 'underweight';
  } else if (bmi >= 18.5 && bmi < 25) {
    category = 'normal';
  } else if (bmi >= 25 && bmi < 30) {
    category = 'overweight';
  } else {
    category = 'obese';
  }
  
  return {
    bmi: parseFloat(bmi.toFixed(1)),
    category
  };
};

/**
 * Calculate BMR (Basal Metabolic Rate) using the Mifflin-St Jeor Equation
 * Men: BMR = 10W + 6.25H - 5A + 5
 * Women: BMR = 10W + 6.25H - 5A - 161
 * Where:
 * W is weight in kg
 * H is height in cm
 * A is age in years
 */
export const calculateBMR = (weight: number, height: number, age: number, gender: 'male' | 'female' | 'other'): number => {
  const base = 10 * weight + 6.25 * height - 5 * age;
  
  if (gender === 'male') {
    return base + 5;
  } else if (gender === 'female') {
    return base - 161;
  } else {
    // For 'other', use an average of male and female
    return base - 78;
  }
};

/**
 * Get activity multiplier based on activity level
 */
export const getActivityMultiplier = (activityLevel: ActivityLevel): number => {
  switch (activityLevel) {
    case 'sedentary':
      return 1.2; // Little or no exercise
    case 'light':
      return 1.375; // Light exercise 1-3 days/week
    case 'moderate':
      return 1.55; // Moderate exercise 3-5 days/week
    case 'active':
      return 1.725; // Hard exercise 6-7 days/week
    case 'very_active':
      return 1.9; // Very hard exercise & physical job or 2x training
    default:
      return 1.2;
  }
};

/**
 * Get calorie adjustment based on weight goal
 */
export const getWeightGoalAdjustment = (weightGoal: WeightGoal): number => {
  switch (weightGoal) {
    case 'lose':
      return -500; // Deficit of 500 calories to lose weight
    case 'gain':
      return 500; // Surplus of 500 calories to gain weight
    case 'maintain':
    default:
      return 0; // No adjustment to maintain weight
  }
};

/**
 * Calculate daily calorie needs based on BMR, activity level, and weight goal
 */
export const calculateDailyCalorieNeeds = (userProfile: UserProfile): number => {
  const { weight, height, age, gender, activityLevel, weightGoal } = userProfile;
  
  // Calculate BMR
  const bmr = calculateBMR(weight, height, age, gender);
  
  // Apply activity multiplier
  const activityMultiplier = getActivityMultiplier(activityLevel);
  const maintenanceCalories = bmr * activityMultiplier;
  
  // Apply weight goal adjustment
  const goalAdjustment = getWeightGoalAdjustment(weightGoal);
  
  // Calculate final daily calorie needs
  const dailyCalorieNeeds = maintenanceCalories + goalAdjustment;
  
  // Return rounded value
  return Math.round(dailyCalorieNeeds);
};

/**
 * Convert height from feet/inches to centimeters
 */
export const feetToCm = (feet: number, inches: number): number => {
  const totalInches = feet * 12 + inches;
  return Math.round(totalInches * 2.54);
};

/**
 * Convert height from centimeters to feet/inches
 */
export const cmToFeet = (cm: number): { feet: number; inches: number } => {
  const totalInches = cm / 2.54;
  const feet = Math.floor(totalInches / 12);
  const inches = Math.round(totalInches % 12);
  return { feet, inches };
};

/**
 * Convert weight from pounds to kilograms
 */
export const lbsToKg = (lbs: number): number => {
  return parseFloat((lbs / 2.20462).toFixed(1));
};

/**
 * Convert weight from kilograms to pounds
 */
export const kgToLbs = (kg: number): number => {
  return parseFloat((kg * 2.20462).toFixed(1));
}; 