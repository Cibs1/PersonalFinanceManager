import React, { useState } from 'react';
import {
  TextField,
  Button,
  Box,
  Typography,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Alert
} from '@mui/material';
import axios from 'axios';

function TransactionForm({ onTransactionAdded }) {
  const [formData, setFormData] = useState({
    description: '',
    amount: '',
    date: '',
    category: '',
  });
  const [error, setError] = useState(null);

  const categories = ['Food', 'Rent', 'Shopping', 'Entertainment', 'Savings'];

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('authToken');
      await axios.post('http://localhost:8080/api/transactions', formData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setFormData({ description: '', amount: '', date: '', category: '' });

      if (onTransactionAdded) onTransactionAdded(); // ✅ Refresh transactions
    } catch (err) {
      setError('Failed to add transaction. Please try again.');
    }
  };

  return (
    <Box sx={{ padding: 3, marginTop: 3 }}>
      <Typography variant="h5" gutterBottom>
        Add Transaction
      </Typography>

      {error && <Alert severity="error">{error}</Alert>}

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
          onChange={handleChange}
          fullWidth
          margin="normal"
          required
        />
        <TextField
          label="Date"
          name="date"
          type="date"
          value={formData.date}
          onChange={handleChange}
          fullWidth
          margin="normal"
          InputLabelProps={{ shrink: true }}
          required
        />

        <FormControl fullWidth margin="normal" required>
          <InputLabel>Category</InputLabel>
          <Select name="category" value={formData.category} onChange={handleChange}>
            {categories.map((category) => (
              <MenuItem key={category} value={category}>
                {category}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <Button type="submit" variant="contained" color="primary" fullWidth>
          Add Transaction
        </Button>
      </form>
    </Box>
  );
}

export default TransactionForm;
