import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  LinearProgress,
  Divider,
  Paper,
  IconButton,
  TextField,
  InputAdornment,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { ChevronLeft, ChevronRight } from '@mui/icons-material';
import { useAppContext } from '../context/AppContext';
import { calculateBMI } from '../utils/calculations';
import { formatCalories, formatDateForDisplay, calculatePercentage } from '../utils/helpers';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const Dashboard: React.FC = () => {
  const { userProfile, dailyLog, selectedDate, setSelectedDate, weightEntries } = useAppContext();
  
  // Handle date change
  const handlePrevDay = () => {
    const currentDate = new Date(selectedDate);
    currentDate.setDate(currentDate.getDate() - 1);
    setSelectedDate(currentDate.toISOString().split('T')[0]);
  };
  
  const handleNextDay = () => {
    const currentDate = new Date(selectedDate);
    currentDate.setDate(currentDate.getDate() + 1);
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    // Don't allow selecting future dates
    if (currentDate <= tomorrow) {
      setSelectedDate(currentDate.toISOString().split('T')[0]);
    }
  };
  
  const handleDateChange = (date: Date | null) => {
    if (date) {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      
      // Don't allow selecting future dates
      if (date <= tomorrow) {
        setSelectedDate(date.toISOString().split('T')[0]);
      }
    }
  };
  
  if (!userProfile || !dailyLog) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography variant="h5">Loading dashboard...</Typography>
      </Box>
    );
  }
  
  // Calculate BMI
  const bmiResult = calculateBMI(userProfile.weight, userProfile.height);
  
  // Calculate calorie progress
  const caloriePercentage = calculatePercentage(dailyLog.totalCalories, dailyLog.goalCalories);
  const caloriesRemaining = dailyLog.goalCalories - dailyLog.totalCalories;
  
  // Prepare weight chart data
  const sortedWeightEntries = [...weightEntries].sort((a, b) => 
    new Date(a.date).getTime() - new Date(b.date).getTime()
  );
  
  const last7Entries = sortedWeightEntries.slice(-7);
  
  const weightChartData = {
    labels: last7Entries.map(entry => {
      const date = new Date(entry.date);
      return `${date.getMonth() + 1}/${date.getDate()}`;
    }),
    datasets: [
      {
        label: 'Weight (kg)',
        data: last7Entries.map(entry => entry.weight),
        borderColor: 'rgb(75, 192, 192)',
        backgroundColor: 'rgba(75, 192, 192, 0.5)',
        tension: 0.1,
      },
    ],
  };
  
  const weightChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: false,
      },
    },
    scales: {
      y: {
        beginAtZero: false,
      },
    },
  };
  
  return (
    <Box sx={{ p: 2 }}>
      <Grid container spacing={2}>
        {/* Date Navigation */}
        <Grid item xs={12}>
          <Paper sx={{ p: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <IconButton onClick={handlePrevDay}>
              <ChevronLeft />
            </IconButton>
            
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DatePicker
                label="Date"
                value={new Date(selectedDate)}
                onChange={handleDateChange}
                slotProps={{
                  textField: {
                    variant: 'standard',
                    sx: { width: 150 }
                  }
                }}
              />
            </LocalizationProvider>
            
            <IconButton 
              onClick={handleNextDay}
              disabled={new Date(selectedDate).toDateString() === new Date().toDateString()}
            >
              <ChevronRight />
            </IconButton>
          </Paper>
        </Grid>
        
        {/* Calorie Summary Card */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Calorie Summary
              </Typography>
              <Box sx={{ mb: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2" color="text.secondary">
                    {formatCalories(dailyLog.totalCalories)} consumed
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Goal: {formatCalories(dailyLog.goalCalories)}
                  </Typography>
                </Box>
                <LinearProgress 
                  variant="determinate" 
                  value={caloriePercentage} 
                  sx={{ 
                    height: 10, 
                    borderRadius: 5,
                    backgroundColor: 'rgba(76, 175, 80, 0.2)',
                    '& .MuiLinearProgress-bar': {
                      backgroundColor: caloriePercentage > 100 ? 'error.main' : 'primary.main',
                    }
                  }}
                />
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Box>
                  <Typography variant="h4" color={caloriesRemaining < 0 ? 'error.main' : 'primary.main'}>
                    {caloriesRemaining < 0 ? 0 : formatCalories(caloriesRemaining)}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {caloriesRemaining < 0 ? 'Calories over' : 'Calories remaining'}
                  </Typography>
                </Box>
                <Box sx={{ textAlign: 'right' }}>
                  <Typography variant="h4">
                    {formatCalories(dailyLog.totalCalories)}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Calories consumed
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        {/* BMI Card */}
        <Grid item xs={12} sm={6}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                BMI
              </Typography>
              <Typography variant="h3" color="primary" sx={{ mb: 1 }}>
                {bmiResult.bmi}
              </Typography>
              <Typography 
                variant="body1" 
                sx={{ 
                  textTransform: 'capitalize',
                  color: 
                    bmiResult.category === 'normal' 
                      ? 'success.main' 
                      : bmiResult.category === 'underweight' || bmiResult.category === 'overweight'
                        ? 'warning.main'
                        : 'error.main'
                }}
              >
                {bmiResult.category}
              </Typography>
              <Divider sx={{ my: 1 }} />
              <Typography variant="body2" color="text.secondary">
                Height: {userProfile.height} cm
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Weight: {userProfile.weight} kg
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        {/* Weight Trend Card */}
        <Grid item xs={12} sm={6}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Weight Trend
              </Typography>
              {weightEntries.length > 1 ? (
                <Box sx={{ height: 150 }}>
                  <Line data={weightChartData} options={weightChartOptions} />
                </Box>
              ) : (
                <Typography variant="body2" color="text.secondary" sx={{ mt: 4, textAlign: 'center' }}>
                  Not enough weight entries to show trend.
                </Typography>
              )}
            </CardContent>
          </Card>
        </Grid>
        
        {/* Meal Breakdown */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Meal Breakdown
              </Typography>
              {dailyLog.entries.length > 0 ? (
                <>
                  {['breakfast', 'lunch', 'dinner', 'snack'].map((mealType) => {
                    const mealEntries = dailyLog.entries.filter(entry => entry.mealType === mealType);
                    const mealCalories = mealEntries.reduce((total, entry) => 
                      total + (entry.foodItem.calories * entry.servings), 0
                    );
                    
                    return (
                      <Box key={mealType} sx={{ mb: 2 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                          <Typography variant="subtitle1" sx={{ textTransform: 'capitalize' }}>
                            {mealType}
                          </Typography>
                          <Typography variant="subtitle1">
                            {formatCalories(mealCalories)}
                          </Typography>
                        </Box>
                        <LinearProgress 
                          variant="determinate" 
                          value={calculatePercentage(mealCalories, dailyLog.goalCalories / 3)} 
                          sx={{ 
                            height: 8, 
                            borderRadius: 4,
                            backgroundColor: 'rgba(76, 175, 80, 0.1)',
                          }}
                        />
                      </Box>
                    );
                  })}
                </>
              ) : (
                <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 2 }}>
                  No meals logged for today. Add food entries to see your meal breakdown.
                </Typography>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard; 