import React from 'react';
import { Paper, BottomNavigation, BottomNavigationAction } from '@mui/material';
import { Dashboard as DashboardIcon, Restaurant as FoodIcon, Person as ProfileIcon } from '@mui/icons-material';

interface BottomNavProps {
  currentTab: number;
  onTabChange: (newValue: number) => void;
}

const BottomNav: React.FC<BottomNavProps> = ({ currentTab, onTabChange }) => {
  return (
    <Paper 
      sx={{ 
        position: 'fixed', 
        bottom: 0, 
        left: 0, 
        right: 0,
        zIndex: 1000,
        borderRadius: 0
      }} 
      elevation={3}
    >
      <BottomNavigation
        showLabels
        value={currentTab}
        onChange={(_, newValue) => {
          onTabChange(newValue);
        }}
      >
        <BottomNavigationAction label="Dashboard" icon={<DashboardIcon />} />
        <BottomNavigationAction label="Food" icon={<FoodIcon />} />
        <BottomNavigationAction label="Profile" icon={<ProfileIcon />} />
      </BottomNavigation>
    </Paper>
  );
};

export default BottomNav; 