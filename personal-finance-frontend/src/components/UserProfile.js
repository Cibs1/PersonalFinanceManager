import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Box, Typography, Paper, CircularProgress, Alert } from '@mui/material';

const UserProfile = () => {
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const backendUrl = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8080';

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem('authToken');
        const response = await axios.get(`${backendUrl}/auth/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(response.data);
      } catch (err) {
        setError(err.response?.data || 'Failed to fetch user info');
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  if (loading) {
    return <CircularProgress />;
  }

  if (error) {
    return <Alert severity="error">{error}</Alert>;
  }

  return (
    <Paper sx={{ p: 3, maxWidth: 400, mx: 'auto', mt: 5, textAlign: 'center' }}>
      <Typography variant="h5" gutterBottom>
        User Profile
      </Typography>
      <Typography variant="body1">
        <strong>Username:</strong> {user?.username}
      </Typography>
      <Typography variant="body1">
        <strong>Email:</strong> {user?.email}
      </Typography>
    </Paper>
  );
};

export default UserProfile;
