import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Divider,
  List,
  ListItem,
  ListItemText,
  IconButton,
  TextField,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  InputAdornment,
  Paper,
  Fab,
  Tabs,
  Tab,
  ListItemSecondaryAction,
} from '@mui/material';
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  Search as SearchIcon,
  Restaurant as RestaurantIcon,
} from '@mui/icons-material';
import { useAppContext } from '../context/AppContext';
import { formatCalories } from '../utils/helpers';
import { FoodItem, MealType } from '../types';
import { searchFoodItems } from '../utils/foodDatabase';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

const TabPanel = (props: TabPanelProps) => {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ pt: 2 }}>{children}</Box>}
    </div>
  );
};

const FoodTracker: React.FC = () => {
  const { 
    foodItems, 
    addFoodItem, 
    dailyLog, 
    addFoodEntry, 
    deleteFoodEntry,
    selectedDate 
  } = useAppContext();
  
  // Tab state
  const [tabValue, setTabValue] = useState(0);
  
  // Search state
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<FoodItem[]>([]);
  
  // Add food entry dialog state
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [selectedFood, setSelectedFood] = useState<FoodItem | null>(null);
  const [servings, setServings] = useState('1');
  const [mealType, setMealType] = useState<MealType>('breakfast');
  
  // Add custom food dialog state
  const [customDialogOpen, setCustomDialogOpen] = useState(false);
  const [customFoodName, setCustomFoodName] = useState('');
  const [customCalories, setCustomCalories] = useState('');
  const [customServingSize, setCustomServingSize] = useState('');
  const [customServingUnit, setCustomServingUnit] = useState('');
  
  // Handle tab change
  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };
  
  // Handle search
  const handleSearch = () => {
    console.log('Searching for:', searchQuery);
    console.log('Available food items:', foodItems.length);
    const results = searchFoodItems(foodItems, searchQuery);
    console.log('Search results:', results.length);
    setSearchResults(results);
  };
  
  // Search automatically when query changes
  React.useEffect(() => {
    const results = searchFoodItems(foodItems, searchQuery);
    console.log('Search results:', results.length);
    setSearchResults(results);
  }, [searchQuery, foodItems]);
  
  // Handle add food entry dialog
  const handleOpenAddDialog = (food: FoodItem) => {
    setSelectedFood(food);
    setServings('1');
    setAddDialogOpen(true);
  };
  
  const handleCloseAddDialog = () => {
    setAddDialogOpen(false);
    setSelectedFood(null);
  };
  
  const handleAddFoodEntry = () => {
    if (selectedFood) {
      addFoodEntry({
        foodItemId: selectedFood.id,
        foodItem: selectedFood,
        servings: parseFloat(servings),
        mealType,
        date: selectedDate,
      });
      handleCloseAddDialog();
    }
  };
  
  // Handle custom food dialog
  const handleOpenCustomDialog = () => {
    setCustomFoodName('');
    setCustomCalories('');
    setCustomServingSize('');
    setCustomServingUnit('');
    setCustomDialogOpen(true);
  };
  
  const handleCloseCustomDialog = () => {
    setCustomDialogOpen(false);
  };
  
  const handleAddCustomFood = () => {
    const newFood: FoodItem = {
      id: '', // Will be generated in the context
      name: customFoodName,
      calories: parseInt(customCalories),
      servingSize: parseFloat(customServingSize),
      servingUnit: customServingUnit,
      isCustom: true,
    };
    
    addFoodItem(newFood);
    handleCloseCustomDialog();
    
    // Update search results if there's a search query
    if (searchQuery) {
      handleSearch();
    }
  };
  
  // Group food entries by meal type
  const mealGroups = dailyLog?.entries.reduce((groups, entry) => {
    if (!groups[entry.mealType]) {
      groups[entry.mealType] = [];
    }
    groups[entry.mealType].push(entry);
    return groups;
  }, {} as Record<MealType, typeof dailyLog.entries>);
  
  return (
    <Box sx={{ p: 2 }}>
      {/* Tabs */}
      <Paper sx={{ mb: 2 }}>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          variant="fullWidth"
          indicatorColor="primary"
          textColor="primary"
        >
          <Tab label="Today's Log" />
          <Tab label="Add Food" />
        </Tabs>
      </Paper>
      
      {/* Today's Log Tab */}
      <TabPanel value={tabValue} index={0}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Today's Food Log
            </Typography>
            
            {dailyLog && dailyLog.entries.length > 0 ? (
              <>
                {(['breakfast', 'lunch', 'dinner', 'snack'] as MealType[]).map((meal) => (
                  <Box key={meal} sx={{ mb: 3 }}>
                    <Typography 
                      variant="subtitle1" 
                      sx={{ 
                        textTransform: 'capitalize', 
                        fontWeight: 'bold',
                        mb: 1
                      }}
                    >
                      {meal}
                    </Typography>
                    
                    {mealGroups && mealGroups[meal] && mealGroups[meal].length > 0 ? (
                      <List disablePadding>
                        {mealGroups[meal].map((entry) => (
                          <ListItem 
                            key={entry.id} 
                            divider 
                            sx={{ 
                              py: 1,
                              borderRadius: 1,
                              mb: 0.5,
                              bgcolor: 'background.paper'
                            }}
                          >
                            <ListItemText
                              primary={entry.foodItem.name}
                              secondary={`${entry.servings} ${entry.foodItem.servingUnit} (${formatCalories(entry.foodItem.calories * entry.servings)})`}
                            />
                            <ListItemSecondaryAction>
                              <IconButton 
                                edge="end" 
                                aria-label="delete"
                                onClick={() => deleteFoodEntry(entry.id)}
                              >
                                <DeleteIcon />
                              </IconButton>
                            </ListItemSecondaryAction>
                          </ListItem>
                        ))}
                      </List>
                    ) : (
                      <Typography variant="body2" color="text.secondary" sx={{ ml: 2 }}>
                        No {meal} entries yet
                      </Typography>
                    )}
                  </Box>
                ))}
                
                <Divider sx={{ my: 2 }} />
                
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="subtitle1">
                    Total Calories:
                  </Typography>
                  <Typography variant="h6" color="primary">
                    {formatCalories(dailyLog.totalCalories)}
                  </Typography>
                </Box>
              </>
            ) : (
              <Typography variant="body1" color="text.secondary" sx={{ textAlign: 'center', py: 4 }}>
                No food entries for today. Add some food to get started!
              </Typography>
            )}
          </CardContent>
        </Card>
      </TabPanel>
      
      {/* Add Food Tab */}
      <TabPanel value={tabValue} index={1}>
        <Card sx={{ mb: 2 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Search Foods
            </Typography>
            
            <Box sx={{ display: 'flex', mb: 2 }}>
              <TextField
                fullWidth
                placeholder="Search for a food..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                  endAdornment: searchQuery ? (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="clear search"
                        onClick={() => setSearchQuery('')}
                        edge="end"
                      >
                        <DeleteIcon />
                      </IconButton>
                    </InputAdornment>
                  ) : null,
                }}
              />
              <Button 
                variant="contained" 
                color="primary" 
                onClick={handleSearch}
                sx={{ ml: 1 }}
              >
                Search
              </Button>
            </Box>
            
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
              <Button
                variant="outlined"
                startIcon={<RestaurantIcon />}
                onClick={handleOpenCustomDialog}
              >
                Add Custom Food
              </Button>
              
              <Typography variant="body2" color="text.secondary">
                {foodItems.length} foods available
              </Typography>
            </Box>
          </CardContent>
        </Card>
        
        {/* Search Results */}
        {searchResults.length > 0 && (
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Search Results
              </Typography>
              
              <List>
                {searchResults.map((food) => (
                  <ListItem 
                    key={food.id} 
                    divider 
                    sx={{ cursor: 'pointer' }}
                    onClick={() => handleOpenAddDialog(food)}
                  >
                    <ListItemText
                      primary={food.name}
                      secondary={`${food.servingSize} ${food.servingUnit} (${formatCalories(food.calories)})`}
                    />
                    <Typography variant="body2" color="text.secondary">
                      {formatCalories(food.calories)}
                    </Typography>
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>
        )}
      </TabPanel>
      
      {/* Floating Action Button */}
      <Fab
        color="primary"
        aria-label="add"
        sx={{ position: 'fixed', bottom: 80, right: 16 }}
        onClick={() => setTabValue(1)}
      >
        <RestaurantIcon />
      </Fab>
      
      {/* Add Food Entry Dialog */}
      <Dialog open={addDialogOpen} onClose={handleCloseAddDialog}>
        <DialogTitle>Add Food Entry</DialogTitle>
        <DialogContent>
          {selectedFood && (
            <>
              <Typography variant="h6">{selectedFood.name}</Typography>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                {formatCalories(selectedFood.calories)} per {selectedFood.servingSize} {selectedFood.servingUnit}
              </Typography>
              
              <Grid container spacing={2} sx={{ mt: 1 }}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Number of Servings"
                    type="number"
                    value={servings}
                    onChange={(e) => setServings(e.target.value)}
                    InputProps={{
                      inputProps: { min: 0.1, step: 0.1 }
                    }}
                  />
                </Grid>
                
                <Grid item xs={12}>
                  <FormControl fullWidth>
                    <InputLabel>Meal Type</InputLabel>
                    <Select
                      value={mealType}
                      label="Meal Type"
                      onChange={(e) => setMealType(e.target.value as MealType)}
                    >
                      <MenuItem value="breakfast">Breakfast</MenuItem>
                      <MenuItem value="lunch">Lunch</MenuItem>
                      <MenuItem value="dinner">Dinner</MenuItem>
                      <MenuItem value="snack">Snack</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                
                <Grid item xs={12}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
                    <Typography variant="subtitle1">Total Calories:</Typography>
                    <Typography variant="h6" color="primary">
                      {formatCalories(selectedFood.calories * parseFloat(servings || '0'))}
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseAddDialog}>Cancel</Button>
          <Button onClick={handleAddFoodEntry} variant="contained" color="primary">
            Add to Log
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Add Custom Food Dialog */}
      <Dialog open={customDialogOpen} onClose={handleCloseCustomDialog}>
        <DialogTitle>Add Custom Food</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Food Name"
                value={customFoodName}
                onChange={(e) => setCustomFoodName(e.target.value)}
                required
              />
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Calories"
                type="number"
                value={customCalories}
                onChange={(e) => setCustomCalories(e.target.value)}
                InputProps={{
                  endAdornment: <InputAdornment position="end">kcal</InputAdornment>,
                  inputProps: { min: 0 }
                }}
                required
              />
            </Grid>
            
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Serving Size"
                type="number"
                value={customServingSize}
                onChange={(e) => setCustomServingSize(e.target.value)}
                InputProps={{
                  inputProps: { min: 0, step: 0.1 }
                }}
                required
              />
            </Grid>
            
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Serving Unit"
                value={customServingUnit}
                onChange={(e) => setCustomServingUnit(e.target.value)}
                placeholder="e.g., cup, piece, gram"
                required
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseCustomDialog}>Cancel</Button>
          <Button 
            onClick={handleAddCustomFood} 
            variant="contained" 
            color="primary"
            disabled={!customFoodName || !customCalories || !customServingSize || !customServingUnit}
          >
            Add Food
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default FoodTracker; 