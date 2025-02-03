import React, { useState, useEffect } from 'react';
import {
  Grid,
  Card,
  CardContent,
  Box,
  Typography,
  TextField,
  Button,
  List,
  ListItem,
  ListItemText,
  IconButton,
  FormControl,
  InputLabel,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from '@mui/material';
import TransactionList from './Transactions/TransactionList';
import TransactionForm from './Transactions/TransactionForm';
import ExpenseChart from './ExpenseChart';
import BudgetManager from './Budget/BudgetManager'; // ✅ Import BudgetManager
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';

function Dashboard() {
  const [refresh, setRefresh] = useState(false);
  const [salary, setSalary] = useState(parseFloat(localStorage.getItem('salary')) || 0);
  const [savings, setSavings] = useState(parseFloat(localStorage.getItem('savings')) || 0);
  const [monthlyExpenses, setMonthlyExpenses] = useState(JSON.parse(localStorage.getItem('monthlyExpenses')) || []);
  const [editingField, setEditingField] = useState(null);
  const [newValue, setNewValue] = useState('');
  const [expenseDesc, setExpenseDesc] = useState('');
  const [expenseAmount, setExpenseAmount] = useState('');

  useEffect(() => {
    localStorage.setItem('salary', salary);
    localStorage.setItem('savings', savings);
    localStorage.setItem('monthlyExpenses', JSON.stringify(monthlyExpenses));
  }, [salary, savings, monthlyExpenses]);

  const handleTransactionAdded = () => setRefresh(!refresh);

  const handleEdit = (field, value) => {
    setEditingField(field);
    setNewValue(value);
  };

  const handleSave = () => {
    if (editingField === 'salary') setSalary(parseFloat(newValue));
    if (editingField === 'savings') setSavings(parseFloat(newValue));
    setEditingField(null);
  };

  const handleCancelEdit = () => {
    setEditingField(null);
    setNewValue('');
  };

  const handleAddExpense = () => {
    if (expenseDesc.trim() && expenseAmount.trim()) {
      setMonthlyExpenses([...monthlyExpenses, { description: expenseDesc, amount: parseFloat(expenseAmount) }]);
      setExpenseDesc('');
      setExpenseAmount('');
    }
  };

  const handleRemoveExpense = (index) => {
    const updatedExpenses = monthlyExpenses.filter((_, i) => i !== index);
    setMonthlyExpenses(updatedExpenses);
  };

  const totalMonthlyExpenses = monthlyExpenses.reduce((sum, exp) => sum + parseFloat(exp.amount), 0);
  const remainingBalance = salary - totalMonthlyExpenses;
  const surplus = remainingBalance > 0;
  
  // ✅ Normalize value to fit the dual-sided bar (-100% to 100%)
  const maxAbsValue = Math.max(Math.abs(salary), Math.abs(totalMonthlyExpenses));
  const percentage = salary === 0 ? 50 : ((remainingBalance / maxAbsValue) * 50 + 50); // Shift center to 50%

  return (
    <Box sx={{ flexGrow: 1, padding: 3 }}>
      <Typography variant="h4" gutterBottom>
        Personal Finance Dashboard
      </Typography>

      {/* ✅ Summary Cards */}
      <Grid container spacing={3}>
        {/* Salary */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography>Salary (Monthly Income)</Typography>
              {editingField === 'salary' ? (
                <>
                  <TextField
                    type="number"
                    fullWidth
                    value={newValue}
                    onChange={(e) => setNewValue(e.target.value)}
                  />
                  <Button onClick={handleSave} variant="contained" sx={{ mt: 1 }}>Save</Button>
                  <Button onClick={handleCancelEdit} sx={{ mt: 1, ml: 1 }}>Cancel</Button>
                </>
              ) : (
                <Typography variant="h4" color="primary">
                  ${salary.toFixed(2)}
                  <IconButton onClick={() => handleEdit('salary', salary)} sx={{ ml: 1 }}>
                    <EditIcon />
                  </IconButton>
                </Typography>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Savings (Editable) */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography>Savings</Typography>
              {editingField === 'savings' ? (
                <>
                  <TextField
                    type="number"
                    fullWidth
                    value={newValue}
                    onChange={(e) => setNewValue(e.target.value)}
                  />
                  <Button onClick={handleSave} variant="contained" sx={{ mt: 1 }}>Save</Button>
                  <Button onClick={handleCancelEdit} sx={{ mt: 1, ml: 1 }}>Cancel</Button>
                </>
              ) : (
                <Typography variant="h4" color="success">
                  ${savings.toFixed(2)}
                  <IconButton onClick={() => handleEdit('savings', savings)} sx={{ ml: 1 }}>
                    <EditIcon />
                  </IconButton>
                </Typography>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Monthly Expenses Total */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography>Monthly Expenses</Typography>
              <Typography variant="h4" color="error">
                ${totalMonthlyExpenses.toFixed(2)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* ✅ Modern Income vs. Expenses Indicator */}
      <Box sx={{ marginTop: 3, textAlign: 'center', position: 'relative' }}>
        <Typography variant="h6">Income vs. Expenses</Typography>

        {/* Dual-Sided Gradient Progress Bar */}
        <Box sx={{
          height: 15,
          width: '100%',
          borderRadius: 10,
          background: 'linear-gradient(to right, #ffb3b3 0%, #ffffff 50%, #8cb5f6 100%)',
          position: 'relative',
          boxShadow: '0px 2px 5px rgba(0,0,0,0.2)',
        }}>
          {/* Marker */}
          <Box
            sx={{
              position: 'absolute',
              left: `${percentage}%`,
              transform: 'translateX(-50%)',
              top: -7,
              width: 15,
              height: 15,
              backgroundColor: 'white',
              borderRadius: '50%',
              border: '2px solid black',
              boxShadow: '0px 2px 6px rgba(0,0,0,0.3)',
            }}
          />
        </Box>

        {/* Label Below Marker */}
        <Typography
          sx={{
            position: 'absolute',
            left: `${percentage}%`,
            transform: 'translateX(-50%)',
            marginTop: 1,
            fontWeight: 'bold',
            color: surplus ? '#1976d2' : '#d32f2f',
          }}
        >
          ${remainingBalance.toFixed(2)}
        </Typography>
      </Box>

      {/* ✅ Budget Manager */}
      <BudgetManager />

      <TransactionForm onTransactionAdded={handleTransactionAdded} />
      <TransactionList key={refresh} />
      <ExpenseChart />
    </Box>
  );
}

export default Dashboard;
