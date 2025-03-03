/**
 * Generate a unique ID
 */
export const generateId = (): string => {
  return Math.random().toString(36).substring(2, 15) + 
         Math.random().toString(36).substring(2, 15);
};

/**
 * Format a date as YYYY-MM-DD
 */
export const formatDate = (date: Date): string => {
  return date.toISOString().split('T')[0];
};

/**
 * Get today's date formatted as YYYY-MM-DD
 */
export const getTodayFormatted = (): string => {
  return formatDate(new Date());
};

/**
 * Format a date for display (e.g., "Monday, January 1, 2023")
 */
export const formatDateForDisplay = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

/**
 * Format calories for display (e.g., "1,234 kcal")
 */
export const formatCalories = (calories: number): string => {
  return `${calories.toLocaleString()} kcal`;
};

/**
 * Calculate percentage (e.g., for progress bars)
 */
export const calculatePercentage = (value: number, total: number): number => {
  if (total === 0) return 0;
  const percentage = (value / total) * 100;
  return Math.min(Math.max(percentage, 0), 100); // Clamp between 0 and 100
};

/**
 * Format a number with specified decimal places
 */
export const formatNumber = (value: number, decimalPlaces: number = 1): string => {
  return value.toFixed(decimalPlaces);
}; 