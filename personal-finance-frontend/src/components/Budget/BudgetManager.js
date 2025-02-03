import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Box,
  Typography,
  TextField,
  Button,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Alert
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

function BudgetManager() {
  const [budgets, setBudgets] = useState([]);
  const [newBudget, setNewBudget] = useState({ category: '', limitAmount: '' });
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchBudgets();
  }, []);

  const fetchBudgets = async () => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await axios.get('http://localhost:8080/api/budget', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setBudgets(response.data);
    } catch (err) {
      setError('Failed to load budgets.');
    }
  };

  const handleAddBudget = async () => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await axios.post('http://localhost:8080/api/budget', newBudget, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setBudgets([...budgets, response.data]);
      setNewBudget({ category: '', limitAmount: '' });
    } catch (err) {
      setError('Failed to add budget.');
    }
  };

  const handleDeleteBudget = async (category) => {
    try {
      const token = localStorage.getItem('authToken');
      await axios.delete(`http://localhost:8080/api/budget/${category}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setBudgets(budgets.filter(budget => budget.category !== category));
    } catch (err) {
      setError('Failed to delete budget.');
    }
  };

  return (
    <Box sx={{ padding: 3 }}>
      <Typography variant="h5">Manage Budgets</Typography>
      {error && <Alert severity="error">{error}</Alert>}
      
      <Box sx={{ display: 'flex', gap: 2, marginTop: 2 }}>
        <TextField
          label="Category"
          name="category"
          value={newBudget.category}
          onChange={(e) => setNewBudget({ ...newBudget, category: e.target.value })}
          required
        />
        <TextField
          label="Limit ($)"
          type="number"
          name="limitAmount"
          value={newBudget.limitAmount}
          onChange={(e) => setNewBudget({ ...newBudget, limitAmount: e.target.value })}
          required
        />
        <Button variant="contained" color="primary" onClick={handleAddBudget}>
          Add Budget
        </Button>
      </Box>

      <List>
        {budgets.map((budget) => (
          <ListItem key={budget.id}>
            <ListItemText primary={`${budget.category}: $${budget.limitAmount}`} />
            <IconButton edge="end" color="error" onClick={() => handleDeleteBudget(budget.category)}>
              <DeleteIcon />
            </IconButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );
}

export default BudgetManager;
