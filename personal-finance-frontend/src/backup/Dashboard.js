import React from 'react';
import { Grid, Card, CardContent, Box, Typography, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

function Dashboard() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    navigate('/signin'); // Redirect to sign-in page
  };

  return (
    <Box sx={{ flexGrow: 1, padding: 3 }}>
      {/* Header Section */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 3,
        }}
      >
        <Typography variant="h4">Personal Finance Manager</Typography>
        <Button variant="contained" color="primary" onClick={handleLogout}>
          Logout
        </Button>
      </Box>

      {/* Dashboard Content */}
      <Box>
        {/* Cards Section */}
        <Grid container spacing={3}>
          {/* Total Balance */}
          <Grid item xs={12} md={4}>
            <Card sx={{ background: '#F5F5F5', borderRadius: 2, boxShadow: '0 5px 15px rgba(0,0,0,0.1)' }}>
              <CardContent>
                <Typography variant="h6" color="textSecondary">
                  Total Balance
                </Typography>
                <Typography variant="h4" color="primary">
                  $12,345.67
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          {/* Monthly Expenses */}
          <Grid item xs={12} md={4}>
            <Card sx={{ background: '#F5F5F5', borderRadius: 2, boxShadow: '0 5px 15px rgba(0,0,0,0.1)' }}>
              <CardContent>
                <Typography variant="h6" color="textSecondary">
                  Monthly Expenses
                </Typography>
                <Typography variant="h4" color="error">
                  $2,345.67
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          {/* Savings */}
          <Grid item xs={12} md={4}>
            <Card sx={{ background: '#F5F5F5', borderRadius: 2, boxShadow: '0 5px 15px rgba(0,0,0,0.1)' }}>
              <CardContent>
                <Typography variant="h6" color="textSecondary">
                  Savings
                </Typography>
                <Typography variant="h4" color="success">
                  $10,000.00
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Charts Section (Placeholder) */}
        <Box sx={{ marginTop: 4 }}>
          <Typography variant="h5" sx={{ marginBottom: 2 }}>
            Financial Insights
          </Typography>
          <Card sx={{ padding: 3, borderRadius: 2, boxShadow: '0 5px 15px rgba(0,0,0,0.1)' }}>
            <Typography color="textSecondary">Chart or Insights go here!</Typography>
          </Card>
        </Box>
      </Box>
    </Box>
  );
}

export default Dashboard;
