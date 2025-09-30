import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  IconButton,
  Menu,
  MenuItem,
  Avatar,
  Tooltip,
  Divider
} from '@mui/material';
import {
  Psychology,
  AccountCircle,
  Dashboard,
  Schedule,
  Logout
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [anchorEl, setAnchorEl] = useState(null);

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    logout();
    handleClose();
    navigate('/');
  };

  const handleNavigation = (path) => {
    navigate(path);
    handleClose();
  };

  const isActive = (path) => location.pathname === path;

  return (
    <AppBar position="static" elevation={2}>
      <Toolbar>
        <IconButton
          size="large"
          edge="start"
          color="inherit"
          onClick={() => navigate('/')}
          sx={{ mr: 2 }}
        >
          <Psychology />
        </IconButton>
        
        <Typography 
          variant="h6" 
          component="div" 
          sx={{ 
            flexGrow: 1, 
            cursor: 'pointer',
            fontWeight: 'bold'
          }}
          onClick={() => navigate('/')}
        >
          MindCare
        </Typography>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Button
            color="inherit"
            onClick={() => navigate('/therapists')}
            sx={{
              fontWeight: isActive('/therapists') ? 'bold' : 'normal',
              borderBottom: isActive('/therapists') ? '2px solid white' : 'none'
            }}
          >
            Find Therapists
          </Button>

          {!isAuthenticated ? (
            <>
              <Button
                color="inherit"
                onClick={() => navigate('/login')}
                sx={{ ml: 1 }}
              >
                Sign In
              </Button>
              <Button
                variant="outlined"
                color="inherit"
                onClick={() => navigate('/signup')}
                sx={{ 
                  ml: 1,
                  borderColor: 'white',
                  '&:hover': {
                    borderColor: 'grey.300',
                    backgroundColor: 'rgba(255,255,255,0.1)'
                  }
                }}
              >
                Sign Up
              </Button>
            </>
          ) : (
            <>
              {user.userType === 'therapist' && (
                <Button
                  color="inherit"
                  onClick={() => navigate('/therapist/dashboard')}
                  startIcon={<Dashboard />}
                  sx={{
                    fontWeight: isActive('/therapist/dashboard') ? 'bold' : 'normal',
                    borderBottom: isActive('/therapist/dashboard') ? '2px solid white' : 'none'
                  }}
                >
                  Dashboard
                </Button>
              )}

              <Tooltip title="Account settings">
                <IconButton
                  size="large"
                  aria-label="account of current user"
                  aria-controls="menu-appbar"
                  aria-haspopup="true"
                  onClick={handleMenu}
                  color="inherit"
                  sx={{ ml: 1 }}
                >
                  <Avatar sx={{ width: 32, height: 32, bgcolor: 'secondary.main' }}>
                    {user?.name ? user.name.charAt(0).toUpperCase() : ''}
                  </Avatar>
                </IconButton>
              </Tooltip>

              <Menu
                id="menu-appbar"
                anchorEl={anchorEl}
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'right',
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                open={Boolean(anchorEl)}
                onClose={handleClose}
                PaperProps={{
                  elevation: 3,
                  sx: {
                    mt: 1,
                    minWidth: 200,
                    '& .MuiMenuItem-root': {
                      px: 2,
                      py: 1,
                    },
                  },
                }}
              >
                <Box sx={{ px: 2, py: 1 }}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Signed in as
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                    {user?.name || 'User'}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {user?.userType ? user.userType.charAt(0).toUpperCase() + user.userType.slice(1) : ''}
                  </Typography>
                </Box>
                
                <Divider />
                
                <MenuItem onClick={() => handleNavigation('/profile')}>
                  <AccountCircle sx={{ mr: 2 }} />
                  My Profile
                </MenuItem>
                
                {user?.userType === 'patient' && (
                  <>
                    <MenuItem onClick={() => handleNavigation('/bookings')}>
                      <Schedule sx={{ mr: 2 }} />
                      My Bookings
                    </MenuItem>
                  </>
                )}
                
                {user?.userType === 'therapist' && (
                  <>
                    <MenuItem onClick={() => handleNavigation('/therapist/dashboard')}>
                      <Dashboard sx={{ mr: 2 }} />
                      Dashboard
                    </MenuItem>
                    <MenuItem onClick={() => handleNavigation('/slots')}>
                      <Schedule sx={{ mr: 2 }} />
                      Manage Slots
                    </MenuItem>
                  </>
                )}
                
                <Divider />
                
                <MenuItem onClick={handleLogout} sx={{ color: 'error.main' }}>
                  <Logout sx={{ mr: 2 }} />
                  Sign Out
                </MenuItem>
              </Menu>
            </>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;