import React, { useState, useEffect } from 'react';
import { Routes, Route, NavLink, useNavigate, Navigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import Signup from './components/Signup';
import Signin from './components/Signin';
import ExpenseChart from './components/ExpenseChart';
import Dashboard from './components/Dashboard';
import { Button, Typography, AppBar, Toolbar, Dialog, DialogActions, DialogContent, DialogTitle, Box } from '@mui/material';

function App() {
  const [open, setOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation(); // Get current route

  useEffect(() => {
    const validateToken = async () => {
      const token = localStorage.getItem('authToken');

      if (!token) {
        console.warn("No token found.");
        setIsLoggedIn(false);
        setLoading(false);
        return; // ✅ Do NOT redirect to `/signin`, just return
      }

      try {
        // Validate token with backend
        await axios.get('http://localhost:8080/auth/me', {
          headers: { Authorization: `Bearer ${token}` },
        });

        setIsLoggedIn(true);
      } catch (error) {
        console.error("Token validation failed:", error.response?.data || error.message);
        localStorage.removeItem('authToken'); // Remove invalid token
        setIsLoggedIn(false);
      } finally {
        setLoading(false);
      }
    };

    validateToken();
  }, []);

  const handleLogout = () => {
    setOpen(false); // ✅ Close the logout dialog
    localStorage.removeItem('authToken');
    setIsLoggedIn(false);
    navigate('/'); // ✅ Redirect to blue welcome page
  };

  if (loading) return <p>Loading...</p>; // Prevents flashing redirects

  return (
    <>
      <AppBar position="static" style={{ backgroundColor: '#1976d2' }}>
        <Toolbar>
          <Typography variant="h6" style={{ flexGrow: 1 }}>
            Personal Finance Manager
          </Typography>
          {!isLoggedIn ? (
            <>
              <NavLink to="/signup" style={{ textDecoration: 'none', color: 'white', marginRight: '10px' }}>
                <Button color="inherit">Sign Up</Button>
              </NavLink>
              <NavLink to="/signin" style={{ textDecoration: 'none', color: 'white' }}>
                <Button color="inherit">Sign In</Button>
              </NavLink>
            </>
          ) : (
            <Button color="inherit" onClick={() => setOpen(true)}>Logout</Button>
          )}
        </Toolbar>
      </AppBar>

      {/* Logout Confirmation Dialog */}
      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>Logout</DialogTitle>
        <DialogContent>Are you sure you want to log out?</DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)} color="secondary">Cancel</Button>
          <Button onClick={handleLogout} color="primary">Logout</Button>
        </DialogActions>
      </Dialog>

      <Routes>
        {/* Public Routes */}
        <Route path="/" element={
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              height: '100vh',
              background: 'linear-gradient(to right, #1976d2, #42a5f5)',
              color: 'white',
              textAlign: 'center',
              padding: 5,
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
        } />

        <Route path="/signup" element={<Signup />} />
        <Route path="/signin" element={<Signin setIsLoggedIn={setIsLoggedIn} />} />

        {/* Protected Routes */}
        {isLoggedIn ? (
          <>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/chart" element={<ExpenseChart />} />
            <Route path="*" element={<Navigate to="/dashboard" />} />
          </>
        ) : (
          <Route path="*" element={<Navigate to="/" />} />
        )}
      </Routes>
    </>
  );
}

export default App;
