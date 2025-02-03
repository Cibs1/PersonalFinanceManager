import React, { useState, useEffect } from 'react';
import { Routes, Route, NavLink, useNavigate, Navigate } from 'react-router-dom';
import axios from 'axios';
import Signup from './components/Signup';
import Signin from './components/Signin';
import ExpenseChart from './components/ExpenseChart';
import Dashboard from './components/Dashboard';
import { Button, Typography, AppBar, Toolbar, Dialog, DialogActions, DialogContent, DialogTitle, Box } from '@mui/material';

function App() {
  const [open, setOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    setIsLoggedIn(!!token); // Update isLoggedIn state based on token presence
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    setIsLoggedIn(false); // Update login state
    navigate('/'); // Redirect to the blue page (welcome page)
  };

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <>
      <AppBar position="static" style={{ backgroundColor: '#1976d2' }}>
        <Toolbar>
          <Typography variant="h6" style={{ flexGrow: 1 }}>
            Personal Finance Manager
          </Typography>
          {!isLoggedIn && (
            <>
              <NavLink
                to="/signup"
                style={({ isActive }) => ({
                  textDecoration: 'none',
                  color: isActive ? '#ffeb3b' : 'white',
                  marginRight: '10px',
                })}
              >
                <Button color="inherit">Sign Up</Button>
              </NavLink>
              <NavLink
                to="/signin"
                style={({ isActive }) => ({
                  textDecoration: 'none',
                  color: isActive ? '#ffeb3b' : 'white',
                })}
              >
                <Button color="inherit">Sign In</Button>
              </NavLink>
            </>
          )}
          {isLoggedIn && (
            <Button color="inherit" onClick={handleOpen}>
              Logout
            </Button>
          )}
        </Toolbar>
      </AppBar>

      {/* Logout Confirmation Dialog */}
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Logout</DialogTitle>
        <DialogContent>Are you sure you want to log out?</DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="secondary">
            Cancel
          </Button>
          <Button
            onClick={() => {
              handleLogout();
              handleClose();
            }}
            color="primary"
          >
            Logout
          </Button>
        </DialogActions>
      </Dialog>

      <Routes>
        {!isLoggedIn ? (
          <>
            {/* Signup Route */}
            <Route path="/signup" element={<Signup />} />

            {/* Signin Route with setIsLoggedIn Prop */}
            <Route path="/signin" element={<Signin setIsLoggedIn={setIsLoggedIn} />} />

            {/* Welcome Page Route */}
            <Route
              path="*"
              element={
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: 'calc(100vh - 64px)',
                    paddingTop: '64px',
                    background: 'linear-gradient(to right, #1976d2, #42a5f5)',
                    color: 'white',
                  }}
                >
                  <Typography variant="h3" gutterBottom>
                    Welcome to Personal Finance Manager
                  </Typography>
                  <Typography variant="h5" gutterBottom>
                    Take control of your finances today!
                  </Typography>
                  <NavLink to="/signup" style={{ textDecoration: 'none' }}>
                    <Button variant="contained" size="large" color="primary">
                      Get Started
                    </Button>
                  </NavLink>
                </Box>
              }
            />
          </>
        ) : (
          <>
            {/* Dashboard Route */}
            <Route path="/dashboard" element={<Dashboard />} />

            {/* Expense Chart Route */}
            <Route path="/chart" element={<ExpenseChart />} />

            {/* Fallback Redirect to Dashboard */}
            <Route path="*" element={<Navigate to="/dashboard" />} />
          </>
        )}
      </Routes>

    </>
  );
}

export default App;
