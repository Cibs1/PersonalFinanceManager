import React, { useState, useEffect } from 'react';
import { TextField, Button, Box, Typography, Container, CircularProgress, Alert, Paper } from '@mui/material';
import { motion } from 'framer-motion';
import axios from 'axios';

function Signup() {
  const [formData, setFormData] = useState({ username: '', password: '', email: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const backendUrl = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8080';

  const validatePassword = (password) => {
    const isLongEnough = password.length >= 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasNumber = /[0-9]/.test(password);

    return {
      isValid: isLongEnough && hasUpperCase && hasNumber,
      errorMessage: !isLongEnough
        ? 'Password must be at least 8 characters long.'
        : !hasUpperCase
        ? 'Password must include an uppercase letter.'
        : !hasNumber
        ? 'Password must include a number.'
        : '',
    };
  };

  const { isValid, errorMessage } = validatePassword(formData.password);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccess(false);

    if (!formData.email) {
      setError('Email is required.');
      setIsLoading(false);
      return;
    }

    try {
      const response = await axios.post(
        `${backendUrl}/auth/register`,
        formData,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      console.log('Response:', response.data);
      setSuccess(true);
    } catch (error) {
      console.error('Error registering user:', error.response?.data || error.message);
      setError(error.response?.data?.message || 'An error occurred while registering.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => setSuccess(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [success]);

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
          Sign Up
        </Typography>

        {error && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Alert severity="error" style={{ marginBottom: '16px' }}>
              {error}
            </Alert>
          </motion.div>
        )}

        {success && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Alert severity="success" style={{ marginBottom: '16px' }}>
              Account created successfully!
            </Alert>
          </motion.div>
        )}

        <form onSubmit={handleSubmit} style={{ marginTop: '16px' }}>
          <TextField
            aria-label="Enter your username"
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
            aria-label="Enter your email"
            label="Email"
            variant="outlined"
            fullWidth
            margin="normal"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <TextField
            aria-label="Enter your password"
            label="Password"
            variant="outlined"
            fullWidth
            margin="normal"
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            helperText={formData.password && !isValid ? errorMessage : 'Password must meet all criteria.'}
            error={formData.password.length > 0 && !isValid}
          />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            disabled={isLoading || !isValid}
            sx={{
              marginTop: 2,
              backgroundColor: '#1976d2',
              '&:hover': { backgroundColor: '#115293' },
            }}
          >
            {isLoading ? <CircularProgress size={24} sx={{ color: 'white' }} /> : 'Register'}
          </Button>
        </form>
      </Box>
    </Container>
  );
}

export default Signup;
