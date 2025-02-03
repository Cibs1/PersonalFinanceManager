import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Box, Typography, CircularProgress, Alert, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
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

function ExpenseChart({ refreshTrigger }) {
  const [categoryData, setCategoryData] = useState({});
  const [monthlyData, setMonthlyData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedRange, setSelectedRange] = useState("all"); // Default: Current Year

  const fetchData = async (range) => {
    const token = localStorage.getItem('authToken');

    if (!token) {
      console.error('No auth token found. Redirecting to login.');
      window.location.href = '/signin';
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Fetch category-wise expenses
      const categoryResponse = await axios.get('http://localhost:8080/api/transactions/categories', {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Fetch monthly expenses with selected range
      const rangeParam = range === "all" ? "all" : range;
      const monthlyResponse = await axios.get(`http://localhost:8080/api/transactions/monthly?range=${rangeParam}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // ✅ Ensure the dates are correctly parsed and sorted in chronological order
      const sortedMonthlyData = Object.entries(monthlyResponse.data)
        .map(([dateStr, value]) => ({
          date: new Date(dateStr), // Convert string to actual Date object
          formattedDate: dateStr, // Keep original for labels
          value
        }))
        .sort((a, b) => a.date - b.date) // ✅ Sort by actual Date
        .reduce((acc, { formattedDate, value }) => ({ ...acc, [formattedDate]: value }), {});

      setCategoryData(categoryResponse.data);
      setMonthlyData(sortedMonthlyData);
    } catch (err) {
      console.error(`Error fetching data (Status ${err.response?.status || 'Network Error'}):`, err.response?.data || err);
      setError('Failed to load expense data.');
    } finally {
      setLoading(false);
    }
  };

  const [monthlyExpenses, setMonthlyExpenses] = useState(JSON.parse(localStorage.getItem('monthlyExpenses')) || []);

  useEffect(() => {
    fetchData(selectedRange);
  }, [selectedRange,refreshTrigger,monthlyExpenses]); // ✅ Reload data when range changes

  if (loading) return <CircularProgress />;
  if (error) return <Alert severity="error">{error}</Alert>;

  // ✅ Ensure data is structured properly before using in charts
  const categoryLabels = Object.keys(categoryData);
  const categoryValues = Object.values(categoryData);

  const monthlyLabels = Object.keys(monthlyData);
  const monthlyValues = Object.values(monthlyData);

  // ✅ Pie Chart Data (Category-wise Expenses)
  const pieData = {
    labels: categoryLabels,
    datasets: [
      {
        data: categoryValues,
        backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF'],
      },
    ],
  };

  // ✅ Pie Chart Options
  const pieOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
      },
    },
  };

  // ✅ Line Chart Data (Monthly Expenses)
  const lineData = {
    labels: monthlyLabels,
    datasets: [
      {
        label: 'Expenses Over Time',
        data: monthlyValues,
        borderColor: '#36A2EB',
        fill: false,
      },
    ],
  };

  // ✅ Line Chart Options
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
          text: 'Month',
        },
      },
      y: {
        title: {
          display: true,
          text: 'Amount ($)',
        },
      },
    },
  };

  return (
    <Box sx={{ padding: 3 }}>
      <Typography variant="h5" gutterBottom>
        Expense Insights
      </Typography>

      {/* ✅ Time Range Selection Dropdown */}
      <FormControl fullWidth margin="normal">
        <InputLabel>Time Range</InputLabel>
        <Select value={selectedRange} onChange={(e) => setSelectedRange(e.target.value)}>
          <MenuItem value={1}>Current Year</MenuItem>
          <MenuItem value={2}>Last Year</MenuItem>
          <MenuItem value={10}>Last 10 Years</MenuItem>
          <MenuItem value="all">All Time</MenuItem> {/* ✅ NEW OPTION */}
        </Select>
      </FormControl>

      {/* ✅ Pie Chart: Expenses by Category */}
      <Box sx={{ marginBottom: 4, height: 300 }}>
        <Typography variant="h6" gutterBottom>
          Expenses by Category
        </Typography>
        <Box sx={{ height: '100%', maxWidth: 400, margin: '0 auto' }}>
          <Pie data={pieData} options={pieOptions} />
        </Box>
      </Box>

      {/* ✅ Line Chart: Monthly Expenses */}
      <Box sx={{ height: 400 }}>
        <Typography variant="h6" gutterBottom>
          Monthly Expenses
        </Typography>
        <Box sx={{ height: '100%', maxWidth: '100%' }}>
          <Line data={lineData} options={lineOptions} />
        </Box>
      </Box>
    </Box>
  );
}

export default ExpenseChart;
