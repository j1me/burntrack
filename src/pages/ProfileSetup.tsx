import React, { useState } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  FormControl,
  FormControlLabel,
  FormLabel,
  Grid,
  InputAdornment,
  Radio,
  RadioGroup,
  TextField,
  Typography,
  MenuItem,
  Select,
  SelectChangeEvent,
} from '@mui/material';
import { useAppContext } from '../context/AppContext';
import { generateId, getTodayFormatted } from '../utils/helpers';
import { ActivityLevel, WeightGoal } from '../types';

const activityLevels = [
  { value: 'sedentary', label: 'Sedentary (little or no exercise)' },
  { value: 'light', label: 'Lightly active (light exercise 1-3 days/week)' },
  { value: 'moderate', label: 'Moderately active (moderate exercise 3-5 days/week)' },
  { value: 'active', label: 'Very active (hard exercise 6-7 days/week)' },
  { value: 'very_active', label: 'Extra active (very hard exercise & physical job)' },
];

const ProfileSetup: React.FC = () => {
  const { setUserProfile } = useAppContext();
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState<'male' | 'female' | 'other'>('male');
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [activityLevel, setActivityLevel] = useState<ActivityLevel>('sedentary');
  const [weightGoal, setWeightGoal] = useState<WeightGoal>('maintain');
  const [unit, setUnit] = useState('metric');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Convert to metric if using imperial
    const heightInCm = unit === 'imperial' ? parseFloat(height) * 2.54 : parseFloat(height);
    const weightInKg = unit === 'imperial' ? parseFloat(weight) * 0.453592 : parseFloat(weight);
    
    // Calculate BMR using Mifflin-St Jeor Equation
    let bmr;
    if (gender === 'male') {
      bmr = 10 * weightInKg + 6.25 * heightInCm - 5 * parseInt(age) + 5;
    } else {
      bmr = 10 * weightInKg + 6.25 * heightInCm - 5 * parseInt(age) - 161;
    }
    
    // Calculate daily calorie needs
    let goalCalories;
    
    // Apply activity multiplier
    switch(activityLevel) {
      case 'sedentary':
        goalCalories = bmr * 1.2;
        break;
      case 'light':
        goalCalories = bmr * 1.375;
        break;
      case 'moderate':
        goalCalories = bmr * 1.55;
        break;
      case 'active':
        goalCalories = bmr * 1.725;
        break;
      case 'very_active':
        goalCalories = bmr * 1.9;
        break;
      default:
        goalCalories = bmr * 1.2;
    }
    
    // Adjust based on goal
    if (weightGoal === 'lose') {
      goalCalories -= 500; // 500 calorie deficit for weight loss
    } else if (weightGoal === 'gain') {
      goalCalories += 500; // 500 calorie surplus for weight gain
    }
    
    // Round to nearest whole number
    goalCalories = Math.round(goalCalories);
    
    const newProfile = {
      id: generateId(),
      name,
      age: parseInt(age),
      gender,
      height: heightInCm,
      weight: weightInKg,
      activityLevel,
      weightGoal,
      goalCalories,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    setUserProfile(newProfile);
  };

  return (
    <Box sx={{ p: 2, maxWidth: 600, mx: 'auto', mt: 8 }}>
      <Typography variant="h4" component="h1" gutterBottom align="center">
        Welcome to BurnTrack
      </Typography>
      <Typography variant="body1" paragraph align="center">
        Let's set up your profile to get started
      </Typography>
      
      <Card elevation={3}>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <TextField
                  label="Name"
                  fullWidth
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Age"
                  type="number"
                  fullWidth
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  error={!!errors.age}
                  helperText={errors.age}
                  required
                  inputProps={{ min: 18, max: 100 }}
                />
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <FormControl component="fieldset">
                  <FormLabel component="legend">Gender</FormLabel>
                  <RadioGroup
                    row
                    value={gender}
                    onChange={(e) => setGender(e.target.value as 'male' | 'female' | 'other')}
                  >
                    <FormControlLabel value="male" control={<Radio />} label="Male" />
                    <FormControlLabel value="female" control={<Radio />} label="Female" />
                  </RadioGroup>
                </FormControl>
              </Grid>
              
              <Grid item xs={12}>
                <FormControl component="fieldset" fullWidth>
                  <FormLabel component="legend">Unit System</FormLabel>
                  <RadioGroup
                    row
                    value={unit}
                    onChange={(e) => setUnit(e.target.value)}
                  >
                    <FormControlLabel value="metric" control={<Radio />} label="Metric (cm/kg)" />
                    <FormControlLabel value="imperial" control={<Radio />} label="Imperial (in/lbs)" />
                  </RadioGroup>
                </FormControl>
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <TextField
                  label={unit === 'metric' ? 'Height (cm)' : 'Height (in)'}
                  type="number"
                  fullWidth
                  value={height}
                  onChange={(e) => setHeight(e.target.value)}
                  required
                  InputProps={{
                    endAdornment: <InputAdornment position="end">{unit === 'metric' ? 'cm' : 'in'}</InputAdornment>,
                  }}
                />
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <TextField
                  label={unit === 'metric' ? 'Weight (kg)' : 'Weight (lbs)'}
                  type="number"
                  fullWidth
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                  required
                  InputProps={{
                    endAdornment: <InputAdornment position="end">{unit === 'metric' ? 'kg' : 'lbs'}</InputAdornment>,
                  }}
                />
              </Grid>
              
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <FormLabel>Activity Level</FormLabel>
                  <Select
                    value={activityLevel}
                    onChange={(e: SelectChangeEvent<string>) => setActivityLevel(e.target.value as ActivityLevel)}
                  >
                    {activityLevels.map((level) => (
                      <MenuItem key={level.value} value={level.value}>
                        {level.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              
              <Grid item xs={12}>
                <FormControl component="fieldset">
                  <FormLabel component="legend">Goal</FormLabel>
                  <RadioGroup
                    row
                    value={weightGoal}
                    onChange={(e) => setWeightGoal(e.target.value as WeightGoal)}
                  >
                    <FormControlLabel value="lose" control={<Radio />} label="Lose Weight" />
                    <FormControlLabel value="maintain" control={<Radio />} label="Maintain" />
                    <FormControlLabel value="gain" control={<Radio />} label="Gain Weight" />
                  </RadioGroup>
                </FormControl>
              </Grid>
              
              <Grid item xs={12}>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  fullWidth
                  size="large"
                >
                  Save Profile
                </Button>
              </Grid>
            </Grid>
          </form>
        </CardContent>
      </Card>
    </Box>
  );
};

export default ProfileSetup; 