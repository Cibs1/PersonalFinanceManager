import React, { useState } from 'react';
import { Grid, Card, CardContent, Box, Typography } from '@mui/material';
import TransactionList from './Transactions/TransactionList';
import TransactionForm from './Transactions/TransactionForm';
import ExpenseChart from './ExpenseChart';

function Dashboard() {
  const [refresh, setRefresh] = useState(false);

  const handleTransactionAdded = () => {
    setRefresh(!refresh); // Trigger re-fetch in TransactionList
  };

  return (
    <Box sx={{ flexGrow: 1, padding: 3 }}>
      <Typography variant="h4" gutterBottom>
        Personal Finance Dashboard
      </Typography>

      {/* Summary Cards */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography>Total Balance</Typography>
              <Typography variant="h4" color="primary">
                $12,345.67
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography>Monthly Expenses</Typography>
              <Typography variant="h4" color="error">
                $2,345.67
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography>Savings</Typography>
              <Typography variant="h4" color="success">
                $10,000.00
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Transaction Form */}
      <TransactionForm onTransactionAdded={handleTransactionAdded} />

      {/* Transaction List */}
      <TransactionList key={refresh} />

      {/* Expense Chart */}
      <ExpenseChart />
    </Box>
  );
}

export default Dashboard;
