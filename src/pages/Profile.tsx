import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  InputAdornment,
  Divider,
  List,
  ListItem,
  ListItemText,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import { useAppContext } from '../context/AppContext';
import { calculateBMI, cmToFeet, kgToLbs } from '../utils/calculations';
import { formatDateForDisplay, getTodayFormatted } from '../utils/helpers';
import { ActivityLevel, WeightGoal } from '../types';

const Profile: React.FC = () => {
  const { userProfile, setUserProfile, weightEntries, addWeightEntry } = useAppContext();
  
  // Weight update state
  const [newWeight, setNewWeight] = useState('');
  const [weightUnit, setWeightUnit] = useState<'kg' | 'lbs'>('kg');
  
  // Profile edit dialog state
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editName, setEditName] = useState('');
  const [editAge, setEditAge] = useState('');
  const [editGender, setEditGender] = useState<'male' | 'female' | 'other'>('male');
  const [editHeightUnit, setEditHeightUnit] = useState<'cm' | 'ft'>('cm');
  const [editHeightCm, setEditHeightCm] = useState('');
  const [editHeightFt, setEditHeightFt] = useState('');
  const [editHeightIn, setEditHeightIn] = useState('');
  const [editWeightUnit, setEditWeightUnit] = useState<'kg' | 'lbs'>('kg');
  const [editWeight, setEditWeight] = useState('');
  const [editActivityLevel, setEditActivityLevel] = useState<ActivityLevel>('moderate');
  const [editWeightGoal, setEditWeightGoal] = useState<WeightGoal>('maintain');
  
  if (!userProfile) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography variant="h5">Loading profile...</Typography>
      </Box>
    );
  }
  
  // Calculate BMI
  const bmiResult = calculateBMI(userProfile.weight, userProfile.height);
  
  // Convert height to feet/inches for display
  const heightInFeet = cmToFeet(userProfile.height);
  
  // Handle weight update
  const handleWeightUpdate = () => {
    if (!newWeight) return;
    
    let weightInKg: number;
    if (weightUnit === 'kg') {
      weightInKg = parseFloat(newWeight);
    } else {
      // Convert from lbs to kg
      weightInKg = parseFloat(newWeight) / 2.20462;
    }
    
    // Add weight entry
    addWeightEntry({
      date: getTodayFormatted(),
      weight: weightInKg,
    });
    
    // Reset form
    setNewWeight('');
  };
  
  // Handle profile edit dialog
  const handleOpenEditDialog = () => {
    setEditName(userProfile.name);
    setEditAge(userProfile.age.toString());
    setEditGender(userProfile.gender);
    setEditHeightCm(userProfile.height.toString());
    
    // Convert height to feet/inches
    const { feet, inches } = cmToFeet(userProfile.height);
    setEditHeightFt(feet.toString());
    setEditHeightIn(inches.toString());
    
    setEditWeight(userProfile.weight.toString());
    setEditActivityLevel(userProfile.activityLevel);
    setEditWeightGoal(userProfile.weightGoal);
    
    setEditDialogOpen(true);
  };
  
  const handleCloseEditDialog = () => {
    setEditDialogOpen(false);
  };
  
  const handleSaveProfile = () => {
    // Calculate height in cm
    let heightInCm: number;
    if (editHeightUnit === 'cm') {
      heightInCm = parseInt(editHeightCm);
    } else {
      // Convert from feet/inches to cm
      heightInCm = (parseInt(editHeightFt) * 30.48) + (parseInt(editHeightIn) * 2.54);
    }
    
    // Calculate weight in kg
    let weightInKg: number;
    if (editWeightUnit === 'kg') {
      weightInKg = parseFloat(editWeight);
    } else {
      // Convert from lbs to kg
      weightInKg = parseFloat(editWeight) / 2.20462;
    }
    
    // Update user profile
    const updatedProfile = {
      ...userProfile,
      name: editName,
      age: parseInt(editAge),
      gender: editGender,
      height: heightInCm,
      weight: weightInKg,
      activityLevel: editActivityLevel,
      weightGoal: editWeightGoal,
      updatedAt: new Date().toISOString(),
    };
    
    setUserProfile(updatedProfile);
    handleCloseEditDialog();
  };
  
  // Sort weight entries by date (newest first)
  const sortedWeightEntries = [...weightEntries].sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );
  
  return (
    <Box sx={{ p: 2 }}>
      <Grid container spacing={2}>
        {/* Profile Summary Card */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h5">{userProfile.name}</Typography>
                <Button 
                  variant="outlined" 
                  color="primary"
                  onClick={handleOpenEditDialog}
                >
                  Edit Profile
                </Button>
              </Box>
              
              <Grid container spacing={2}>
                <Grid item xs={6} sm={3}>
                  <Typography variant="body2" color="text.secondary">Age</Typography>
                  <Typography variant="body1">{userProfile.age} years</Typography>
                </Grid>
                
                <Grid item xs={6} sm={3}>
                  <Typography variant="body2" color="text.secondary">Gender</Typography>
                  <Typography variant="body1" sx={{ textTransform: 'capitalize' }}>
                    {userProfile.gender}
                  </Typography>
                </Grid>
                
                <Grid item xs={6} sm={3}>
                  <Typography variant="body2" color="text.secondary">Height</Typography>
                  <Typography variant="body1">
                    {userProfile.height} cm ({heightInFeet.feet}'{heightInFeet.inches}")
                  </Typography>
                </Grid>
                
                <Grid item xs={6} sm={3}>
                  <Typography variant="body2" color="text.secondary">Weight</Typography>
                  <Typography variant="body1">
                    {userProfile.weight.toFixed(1)} kg ({kgToLbs(userProfile.weight).toFixed(1)} lbs)
                  </Typography>
                </Grid>
              </Grid>
              
              <Divider sx={{ my: 2 }} />
              
              <Grid container spacing={2}>
                <Grid item xs={12} sm={4}>
                  <Typography variant="body2" color="text.secondary">BMI</Typography>
                  <Typography 
                    variant="body1" 
                    sx={{ 
                      fontWeight: 'bold',
                      color: 
                        bmiResult.category === 'normal' 
                          ? 'success.main' 
                          : bmiResult.category === 'underweight' || bmiResult.category === 'overweight'
                            ? 'warning.main'
                            : 'error.main'
                    }}
                  >
                    {bmiResult.bmi} ({bmiResult.category})
                  </Typography>
                </Grid>
                
                <Grid item xs={12} sm={4}>
                  <Typography variant="body2" color="text.secondary">Activity Level</Typography>
                  <Typography variant="body1" sx={{ textTransform: 'capitalize' }}>
                    {userProfile.activityLevel.replace('_', ' ')}
                  </Typography>
                </Grid>
                
                <Grid item xs={12} sm={4}>
                  <Typography variant="body2" color="text.secondary">Weight Goal</Typography>
                  <Typography variant="body1" sx={{ textTransform: 'capitalize' }}>
                    {userProfile.weightGoal} weight
                  </Typography>
                </Grid>
              </Grid>
              
              <Divider sx={{ my: 2 }} />
              
              <Typography variant="body2" color="text.secondary">Daily Calorie Goal</Typography>
              <Typography variant="h4" color="primary">
                {userProfile.goalCalories} kcal
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        {/* Update Weight Card */}
        <Grid item xs={12} md={6}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Update Weight
              </Typography>
              
              <Box sx={{ display: 'flex', alignItems: 'flex-end', mb: 2 }}>
                <TextField
                  label="Current Weight"
                  type="number"
                  value={newWeight}
                  onChange={(e) => setNewWeight(e.target.value)}
                  sx={{ flexGrow: 1, mr: 1 }}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <Select
                          value={weightUnit}
                          onChange={(e) => setWeightUnit(e.target.value as 'kg' | 'lbs')}
                          variant="standard"
                          disableUnderline
                        >
                          <MenuItem value="kg">kg</MenuItem>
                          <MenuItem value="lbs">lbs</MenuItem>
                        </Select>
                      </InputAdornment>
                    ),
                    inputProps: { 
                      min: weightUnit === 'kg' ? 30 : 66, 
                      max: weightUnit === 'kg' ? 300 : 660,
                      step: 0.1
                    }
                  }}
                />
                <Button 
                  variant="contained" 
                  color="primary"
                  onClick={handleWeightUpdate}
                  disabled={!newWeight}
                >
                  Update
                </Button>
              </Box>
              
              <Typography variant="body2" color="text.secondary">
                Last updated: {
                  weightEntries.length > 0 
                    ? formatDateForDisplay(sortedWeightEntries[0].date)
                    : 'Never'
                }
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        {/* Weight History Card */}
        <Grid item xs={12} md={6}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Weight History
              </Typography>
              
              {weightEntries.length > 0 ? (
                <List disablePadding>
                  {sortedWeightEntries.slice(0, 5).map((entry) => (
                    <ListItem key={entry.date} divider>
                      <ListItemText
                        primary={`${entry.weight.toFixed(1)} kg (${kgToLbs(entry.weight).toFixed(1)} lbs)`}
                        secondary={formatDateForDisplay(entry.date)}
                      />
                    </ListItem>
                  ))}
                </List>
              ) : (
                <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 2 }}>
                  No weight entries yet. Update your weight to see history.
                </Typography>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      
      {/* Edit Profile Dialog */}
      <Dialog open={editDialogOpen} onClose={handleCloseEditDialog} maxWidth="sm" fullWidth>
        <DialogTitle>Edit Profile</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            {/* Name */}
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Name"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                required
              />
            </Grid>
            
            {/* Age */}
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Age"
                type="number"
                value={editAge}
                onChange={(e) => setEditAge(e.target.value)}
                required
                InputProps={{
                  inputProps: { min: 18, max: 100 }
                }}
              />
            </Grid>
            
            {/* Gender */}
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Gender</InputLabel>
                <Select
                  value={editGender}
                  label="Gender"
                  onChange={(e) => setEditGender(e.target.value as 'male' | 'female' | 'other')}
                >
                  <MenuItem value="male">Male</MenuItem>
                  <MenuItem value="female">Female</MenuItem>
                  <MenuItem value="other">Other</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            
            {/* Height */}
            <Grid item xs={12}>
              <Typography variant="subtitle2" gutterBottom>
                Height
              </Typography>
              <Grid container spacing={2} alignItems="center">
                <Grid item xs={4}>
                  <FormControl fullWidth>
                    <Select
                      value={editHeightUnit}
                      onChange={(e) => setEditHeightUnit(e.target.value as 'cm' | 'ft')}
                    >
                      <MenuItem value="cm">Centimeters</MenuItem>
                      <MenuItem value="ft">Feet/Inches</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                
                {editHeightUnit === 'cm' ? (
                  <Grid item xs={8}>
                    <TextField
                      fullWidth
                      label="Height"
                      type="number"
                      value={editHeightCm}
                      onChange={(e) => setEditHeightCm(e.target.value)}
                      required
                      InputProps={{
                        endAdornment: <InputAdornment position="end">cm</InputAdornment>,
                        inputProps: { min: 100, max: 250 }
                      }}
                    />
                  </Grid>
                ) : (
                  <>
                    <Grid item xs={4}>
                      <TextField
                        fullWidth
                        label="Feet"
                        type="number"
                        value={editHeightFt}
                        onChange={(e) => setEditHeightFt(e.target.value)}
                        required
                        InputProps={{
                          endAdornment: <InputAdornment position="end">ft</InputAdornment>,
                          inputProps: { min: 3, max: 8 }
                        }}
                      />
                    </Grid>
                    <Grid item xs={4}>
                      <TextField
                        fullWidth
                        label="Inches"
                        type="number"
                        value={editHeightIn}
                        onChange={(e) => setEditHeightIn(e.target.value)}
                        required
                        InputProps={{
                          endAdornment: <InputAdornment position="end">in</InputAdornment>,
                          inputProps: { min: 0, max: 11 }
                        }}
                      />
                    </Grid>
                  </>
                )}
              </Grid>
            </Grid>
            
            {/* Weight */}
            <Grid item xs={12}>
              <Typography variant="subtitle2" gutterBottom>
                Weight
              </Typography>
              <Grid container spacing={2} alignItems="center">
                <Grid item xs={4}>
                  <FormControl fullWidth>
                    <Select
                      value={editWeightUnit}
                      onChange={(e) => setEditWeightUnit(e.target.value as 'kg' | 'lbs')}
                    >
                      <MenuItem value="kg">Kilograms</MenuItem>
                      <MenuItem value="lbs">Pounds</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={8}>
                  <TextField
                    fullWidth
                    label="Weight"
                    type="number"
                    value={editWeight}
                    onChange={(e) => setEditWeight(e.target.value)}
                    required
                    InputProps={{
                      endAdornment: <InputAdornment position="end">{editWeightUnit}</InputAdornment>,
                      inputProps: { 
                        min: editWeightUnit === 'kg' ? 30 : 66, 
                        max: editWeightUnit === 'kg' ? 300 : 660,
                        step: 0.1
                      }
                    }}
                  />
                </Grid>
              </Grid>
            </Grid>
            
            {/* Activity Level */}
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Activity Level</InputLabel>
                <Select
                  value={editActivityLevel}
                  label="Activity Level"
                  onChange={(e) => setEditActivityLevel(e.target.value as ActivityLevel)}
                >
                  <MenuItem value="sedentary">Sedentary (little or no exercise)</MenuItem>
                  <MenuItem value="light">Light (exercise 1-3 days/week)</MenuItem>
                  <MenuItem value="moderate">Moderate (exercise 3-5 days/week)</MenuItem>
                  <MenuItem value="active">Active (exercise 6-7 days/week)</MenuItem>
                  <MenuItem value="very_active">Very Active (hard exercise daily or physical job)</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            
            {/* Weight Goal */}
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Weight Goal</InputLabel>
                <Select
                  value={editWeightGoal}
                  label="Weight Goal"
                  onChange={(e) => setEditWeightGoal(e.target.value as WeightGoal)}
                >
                  <MenuItem value="lose">Lose Weight</MenuItem>
                  <MenuItem value="maintain">Maintain Weight</MenuItem>
                  <MenuItem value="gain">Gain Weight</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseEditDialog}>Cancel</Button>
          <Button 
            onClick={handleSaveProfile} 
            variant="contained" 
            color="primary"
          >
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Profile; 