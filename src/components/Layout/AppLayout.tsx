import React, { useState, ReactNode } from 'react';
import { Box, CssBaseline, ThemeProvider } from '@mui/material';
import theme from '../../theme';
import Header from './Header';
import BottomNav from './BottomNav';
import { useAppContext } from '../../context/AppContext';
import ProfileSetup from '../../pages/ProfileSetup';
import Dashboard from '../../pages/Dashboard';
import FoodTracker from '../../pages/FoodTracker';
import Profile from '../../pages/Profile';
import PWAInstallPrompt from '../PWAInstallPrompt';

interface AppLayoutProps {
  children?: ReactNode;
}

const AppLayout: React.FC<AppLayoutProps> = () => {
  const { isProfileComplete } = useAppContext();
  const [currentTab, setCurrentTab] = useState<number>(0);

  const handleTabChange = (newValue: number) => {
    setCurrentTab(newValue);
  };

  // Render the appropriate page based on the current tab
  const renderPage = () => {
    switch (currentTab) {
      case 0:
        return <Dashboard />;
      case 1:
        return <FoodTracker />;
      case 2:
        return <Profile />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <Header currentTab={currentTab} />
        
        {/* Main content with proper spacing for fixed header and bottom nav */}
        <Box sx={{ 
          flexGrow: 1, 
          pt: '64px', // Height of the AppBar
          pb: '56px', // Height of the BottomNav
          overflow: 'auto'
        }}>
          {isProfileComplete ? renderPage() : <ProfileSetup />}
        </Box>
        
        <BottomNav currentTab={currentTab} onTabChange={handleTabChange} />
        <PWAInstallPrompt />
      </Box>
    </ThemeProvider>
  );
};

export default AppLayout; 