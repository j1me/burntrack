import React from 'react';
import { AppBar, Toolbar, Typography, IconButton, Menu, MenuItem, Box } from '@mui/material';
import { MoreVert as MoreIcon } from '@mui/icons-material';
import { useAppContext } from '../../context/AppContext';

interface HeaderProps {
  currentTab: number;
}

const Header: React.FC<HeaderProps> = ({ currentTab }) => {
  const { resetApp } = useAppContext();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleReset = () => {
    if (window.confirm('Are you sure you want to reset all app data? This cannot be undone.')) {
      resetApp();
      handleClose();
    }
  };

  // Get title based on current tab
  const getTitle = () => {
    switch (currentTab) {
      case 0:
        return 'Dashboard';
      case 1:
        return 'Food Tracker';
      case 2:
        return 'Profile';
      default:
        return 'BurnTrack';
    }
  };

  return (
    <AppBar position="fixed" color="primary" elevation={1}>
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          {getTitle()}
        </Typography>
        <Box>
          <IconButton
            size="large"
            edge="end"
            color="inherit"
            aria-label="menu"
            onClick={handleMenuClick}
          >
            <MoreIcon />
          </IconButton>
          <Menu
            id="menu-appbar"
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            MenuListProps={{
              'aria-labelledby': 'basic-button',
            }}
          >
            <MenuItem onClick={handleReset}>Reset App Data</MenuItem>
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header; 