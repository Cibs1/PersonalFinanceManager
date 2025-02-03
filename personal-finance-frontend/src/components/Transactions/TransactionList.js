import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Paper,
  Button,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";

function TransactionList({ onTransactionDeleted }) {
  const [transactions, setTransactions] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const token = localStorage.getItem("authToken");
        const response = await axios.get("http://localhost:8080/api/transactions", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setTransactions(response.data);
      } catch (err) {
        setError("Failed to fetch transactions. Please try again later.");
      }
    };

    fetchTransactions();
  }, []);

  const handleDelete = async (transactionId) => {
    try {
      const token = localStorage.getItem("authToken");
      await axios.delete(`http://localhost:8080/api/transactions/${transactionId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setTransactions((prevTransactions) =>
        prevTransactions.filter((transaction) => transaction.id !== transactionId)
      );

      if (onTransactionDeleted) {
        onTransactionDeleted();
      }
    } catch (err) {
      setError("Failed to delete transaction. Please try again.");
    }
  };

  return (
    <Box sx={{ padding: 3 }}>
      <Typography variant="h4" gutterBottom>
        Transactions
      </Typography>

      {error && <Typography color="error">{error}</Typography>}

      <Paper>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Description</TableCell>
              <TableCell>Amount</TableCell>
              <TableCell>Category</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {transactions.map((transaction) => (
              <TableRow key={transaction.id}>
                <TableCell>{transaction.description}</TableCell>
                <TableCell>${transaction.amount.toFixed(2)}</TableCell>
                <TableCell>{transaction.category}</TableCell>
                <TableCell>{transaction.date}</TableCell>
                <TableCell>
                  <Button
                    variant="outlined"
                    color="error"
                    onClick={() => handleDelete(transaction.id)}
                    startIcon={<DeleteIcon />}
                  >
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
    </Box>
  );
}

export default TransactionList;
