import React, { useState } from 'react';
import axios from 'axios';
import {
  TextField,
  Button,
  Box,
  Typography,
  MenuItem,
  Checkbox,
  FormControlLabel,
  CircularProgress,
} from '@mui/material';

function TransactionForm({ onTransactionAdded }) {
  const [formData, setFormData] = useState({
    description: '',
    amount: '',
    date: '',
    category: '',
    isRecurring: false,
    recurringInterval: '',
    startDate: '',
    endDate: '',
    isOngoing: false,
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const categories = ['Food', 'Rent', 'Shopping', 'Entertainment', 'Savings'];
  const intervals = ['DAILY', 'WEEKLY', 'MONTHLY', 'YEARLY'];

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
  
    // Basic client-side validation
    if (!formData.description || !formData.amount || !formData.date || !formData.category) {
      setError('Please fill in all required fields.');
      setLoading(false);
      return;
    }
  
    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        setError('You must be logged in to add a transaction.');
        window.location.href = '/signin';
        return;
      }
  
      // Determine the correct endpoint based on `isRecurring`
      const endpoint = formData.isRecurring
        ? 'http://localhost:8080/api/transactions/recurring'
        : 'http://localhost:8080/api/transactions';
  
      const payload = {
        ...formData,
        endDate: formData.isOngoing ? null : formData.endDate, // Only for recurring transactions
      };
  
      // Make the API request
      await axios.post(endpoint, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      
      // Reset the form on success
      setFormData({
        description: '',
        amount: '',
        date: '',
        category: '',
        isRecurring: false,
        recurringInterval: '',
        startDate: '',
        endDate: '',
        isOngoing: false,
      });
  
      onTransactionAdded();
    } catch (err) {
      if (err.response) {
        if (err.response.status === 403) {
          setError('You do not have permission to access this resource.');
        } else if (err.response.status === 401) {
          setError('Your session has expired. Please log in again.');
          localStorage.removeItem('authToken');
          window.location.href = '/signin';
        } else {
          setError('An error occurred while adding the transaction. Please try again.');
        }
      } else {
        setError('Failed to connect to the server. Please check your network connection.');
      }
    } finally {
      setLoading(false);
    }
  };  

  return (
    <Box sx={{ padding: 3, marginTop: 3 }}>
      <Typography variant="h5" gutterBottom>
        Add Transaction
      </Typography>

      {error && (
        <Box sx={{ marginBottom: 2, padding: 1, backgroundColor: '#ffebee', color: '#b71c1c', borderRadius: 2 }}>
          <Typography variant="body1">{error}</Typography>
        </Box>
      )}

      <form onSubmit={handleSubmit}>
        <TextField
          label="Description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          fullWidth
          margin="normal"
          required
        />
        <TextField
          label="Amount"
          name="amount"
          type="number"
          value={formData.amount}
          onChange={(e) => {
            const value = e.target.value ? parseFloat(e.target.value) : '';
            setFormData({ ...formData, amount: value });
          }}
          fullWidth
          margin="normal"
          required
          inputProps={{ step: "0.01", min: "0" }}
        />
        <TextField
          label="Date"
          name="date"
          type="date"
          value={formData.date}
          onChange={handleChange}
          fullWidth
          margin="normal"
          InputLabelProps={{
            shrink: true,
          }}
          required
        />
        <TextField
          label="Category"
          name="category"
          value={formData.category}
          onChange={handleChange}
          select
          fullWidth
          margin="normal"
          required
        >
          {categories.map((category) => (
            <MenuItem key={category} value={category}>
              {category}
            </MenuItem>
          ))}
        </TextField>
        <FormControlLabel
          control={
            <Checkbox
              checked={formData.isRecurring}
              onChange={handleChange}
              name="isRecurring"
            />
          }
          label="Recurring Transaction"
        />
        {formData.isRecurring && (
          <>
            <TextField
              label="Recurring Interval"
              name="recurringInterval"
              value={formData.recurringInterval}
              onChange={handleChange}
              select
              fullWidth
              margin="normal"
              required
            >
              {intervals.map((interval) => (
                <MenuItem key={interval} value={interval}>
                  {interval}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              label="Start Date"
              name="startDate"
              type="date"
              value={formData.startDate}
              onChange={handleChange}
              fullWidth
              margin="normal"
              InputLabelProps={{
                shrink: true,
              }}
              required
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={formData.isOngoing}
                  onChange={handleChange}
                  name="isOngoing"
                />
              }
              label="Ongoing Subscription (No End Date)"
            />
            {!formData.isOngoing && (
              <TextField
                label="End Date"
                name="endDate"
                type="date"
                value={formData.endDate}
                onChange={handleChange}
                fullWidth
                margin="normal"
                InputLabelProps={{
                  shrink: true,
                }}
              />
            )}
          </>
        )}
        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          disabled={loading}
          sx={{ marginTop: 2 }}
        >
          {loading ? <CircularProgress size={24} /> : 'Add Transaction'}
        </Button>
      </form>
    </Box>
  );
}

export default TransactionForm;
