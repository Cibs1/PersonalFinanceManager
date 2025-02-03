import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Box, Typography, CircularProgress } from '@mui/material';
import { Pie, Line } from 'react-chartjs-2';

import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
} from 'chart.js';

// Register required Chart.js components
ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement
);

function ExpenseChart() {
  const [categoryData, setCategoryData] = useState(null);
  const [monthlyData, setMonthlyData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem('authToken');

      // Check if the token exists
      if (!token) {
        console.error('No auth token found. Redirecting to login.');
        window.location.href = '/signin'; // Redirect to login if token is missing
        return;
      }

      try {
        // Fetch data for category-wise expenses
        const categoryResponse = await axios.get('http://localhost:8080/api/transactions/categories', {
          headers: { Authorization: `Bearer ${token}` },
        });

        // Fetch data for monthly expenses
        const monthlyResponse = await axios.get('http://localhost:8080/api/transactions/monthly', {
          headers: { Authorization: `Bearer ${token}` },
        });

        setCategoryData(categoryResponse.data);
        setMonthlyData(monthlyResponse.data);
        setLoading(false);
      } catch (err) {
        if (err.response && err.response.status === 401) {
          console.error('Unauthorized: Token might be invalid or expired.');
          window.location.href = '/signin'; // Redirect to login if token is invalid/expired
        } else {
          console.error('Error fetching data:', err);
        }
      }
    };

    fetchData();
  }, []);

  if (loading) return <CircularProgress />;

  // Prepare data for the pie chart
  const pieData = {
    labels: Object.keys(categoryData),
    datasets: [
      {
        data: Object.values(categoryData),
        backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF'],
      },
    ],
  };

  // Pie chart options to control size and layout
  const pieOptions = {
    responsive: true,
    maintainAspectRatio: false, // Allows custom height/width
    plugins: {
      legend: {
        position: 'bottom', // Move legend to bottom
      },
    },
  };

  // Prepare data for the line chart
  const lineData = {
    labels: Object.keys(monthlyData),
    datasets: [
      {
        label: 'Expenses Over Time',
        data: Object.values(monthlyData),
        borderColor: '#36A2EB',
        fill: false,
      },
    ],
  };

  // Line chart options
  const lineOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: 'top',
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: 'Months',
        },
      },
      y: {
        title: {
          display: true,
          text: 'Expenses',
        },
      },
    },
  };

  return (
    <Box sx={{ padding: 3 }}>
      <Typography variant="h5" gutterBottom>
        Expense Insights
      </Typography>

      <Box sx={{ marginBottom: 4, height: 300 }}>
        <Typography variant="h6" gutterBottom>
          Expenses by Category
        </Typography>
        {/* Adjust the size of the pie chart */}
        <Box sx={{ height: '100%', maxWidth: 400, margin: '0 auto' }}>
          <Pie data={pieData} options={pieOptions} />
        </Box>
      </Box>

      <Box sx={{ height: 400 }}>
        <Typography variant="h6" gutterBottom>
          Monthly Expenses
        </Typography>
        {/* Adjust the size of the line chart */}
        <Box sx={{ height: '100%', maxWidth: '100%' }}>
          <Line data={lineData} options={lineOptions} />
        </Box>
      </Box>
    </Box>
  );
}

export default ExpenseChart;
