import React, { useState } from 'react';
import { TextField, Button, Box, Typography, Container, CircularProgress, Alert, Paper } from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Signin({ setIsLoggedIn }) {
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const navigate = useNavigate(); // Used for navigation after successful login

  const backendUrl = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8080';

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const response = await axios.post(
        `${backendUrl}/auth/login`,
        {
          username: formData.username,
          password: formData.password,
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      // Save token to localStorage
      const { token } = response.data;
      localStorage.setItem('authToken', token);

      console.log('Token stored:', token);

      // Ensure token is fully stored before updating login state
      setTimeout(() => {
        setSuccess(true);
        setIsLoggedIn(true);
        console.log('Redirecting to dashboard...');
        navigate('/dashboard'); // Redirect user after successful login
      }, 300); // Small delay to ensure token persistence
    } catch (error) {
      console.error('Error logging in:', error.response?.data || error.message);
      setError(error.response?.data?.message || 'An error occurred during login.');
      localStorage.removeItem('authToken'); // Remove any corrupted token
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container maxWidth="sm">
      <Box
        component={Paper}
        sx={{
          p: 3,
          borderRadius: 2,
          boxShadow: 3,
          maxWidth: 400,
          mx: 'auto',
          mt: 5,
          textAlign: 'center',
        }}
      >
        <Typography variant="h4" gutterBottom>
          Sign In
        </Typography>

        {error && (
          <Alert severity="error" style={{ marginBottom: '16px' }}>
            {error}
          </Alert>
        )}

        {success && (
          <Alert severity="success" style={{ marginBottom: '16px' }}>
            Login successful! Redirecting...
          </Alert>
        )}

        <form onSubmit={handleSubmit} style={{ marginTop: '16px' }}>
          <TextField
            label="Username"
            variant="outlined"
            fullWidth
            margin="normal"
            name="username"
            value={formData.username}
            onChange={handleChange}
            required
          />
          <TextField
            label="Password"
            variant="outlined"
            fullWidth
            margin="normal"
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            disabled={isLoading}
            sx={{
              marginTop: 2,
              backgroundColor: '#1976d2',
              '&:hover': { backgroundColor: '#115293' },
            }}
          >
            {isLoading ? <CircularProgress size={24} sx={{ color: 'white' }} /> : 'Sign In'}
          </Button>
        </form>
      </Box>
    </Container>
  );
}

export default Signin;
