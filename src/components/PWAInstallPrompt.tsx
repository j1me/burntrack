import React, { useState, useEffect } from 'react';
import { Box, Button, Typography, Snackbar, Alert } from '@mui/material';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
}

const PWAInstallPrompt: React.FC = () => {
  const [installPrompt, setInstallPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showPrompt, setShowPrompt] = useState<boolean>(false);
  const [showSuccess, setShowSuccess] = useState<boolean>(false);

  useEffect(() => {
    // Check if the app is already installed
    const isAppInstalled = window.matchMedia('(display-mode: standalone)').matches;
    
    if (isAppInstalled) {
      return; // Don't show install prompt if already installed
    }

    // Listen for the beforeinstallprompt event
    const handleBeforeInstallPrompt = (e: Event) => {
      // Prevent Chrome 67 and earlier from automatically showing the prompt
      e.preventDefault();
      
      // Store the event for later use
      setInstallPrompt(e as BeforeInstallPromptEvent);
      
      // Show the install prompt after a delay
      setTimeout(() => {
        setShowPrompt(true);
      }, 3000);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // Listen for the appinstalled event
    const handleAppInstalled = () => {
      setShowPrompt(false);
      setShowSuccess(true);
    };

    window.addEventListener('appinstalled', handleAppInstalled);

    // Cleanup
    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const handleInstallClick = () => {
    if (!installPrompt) return;

    // Show the install prompt
    installPrompt.prompt();

    // Wait for the user to respond to the prompt
    installPrompt.userChoice.then((choiceResult) => {
      if (choiceResult.outcome === 'accepted') {
        console.log('User accepted the install prompt');
        setShowSuccess(true);
      } else {
        console.log('User dismissed the install prompt');
      }
      
      // Clear the saved prompt as it can't be used again
      setInstallPrompt(null);
      setShowPrompt(false);
    });
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    
    // Store in localStorage that the user dismissed the prompt
    // to avoid showing it again for some time
    localStorage.setItem('pwaPromptDismissed', Date.now().toString());
  };

  if (!showPrompt) {
    return null;
  }

  return (
    <>
      <Box className="pwa-install-prompt">
        <Box>
          <Typography variant="body1" fontWeight="bold">
            Install BurnTrack
          </Typography>
          <Typography variant="body2">
            Add to your home screen for a better experience
          </Typography>
        </Box>
        <Box>
          <Button 
            className="dismiss" 
            onClick={handleDismiss}
            sx={{ mr: 1 }}
          >
            Not now
          </Button>
          <Button 
            variant="contained" 
            color="primary" 
            onClick={handleInstallClick}
            sx={{ mr: 1 }}
          >
            Install BurnTrack
          </Button>
        </Box>
      </Box>

      <Snackbar 
        open={showSuccess} 
        autoHideDuration={6000} 
        onClose={() => setShowSuccess(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={() => setShowSuccess(false)} 
          severity="success" 
          sx={{ width: '100%' }}
        >
          App installed successfully!
        </Alert>
      </Snackbar>
    </>
  );
};

export default PWAInstallPrompt; 