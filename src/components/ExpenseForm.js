import React, { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
  Alert,
  Snackbar,
  Grid
} from '@mui/material';

const categories = [
  'מזון',
  'תחבורה',
  'דיור',
  'בילויים',
  'קניות',
  'חשבונות',
  'אחר'
];

const ExpenseForm = ({ onExpenseAdded }) => {
  const [expense, setExpense] = useState({
    amount: '',
    category: '',
    description: '',
    date: new Date().toISOString().split('T')[0]
  });
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (!expense.amount || !expense.category) {
        setError('נא למלא סכום וקטגוריה');
        return;
      }

      const amount = parseFloat(expense.amount);
      if (isNaN(amount) || amount <= 0) {
        setError('נא להזין סכום חיובי תקין');
        return;
      }

      const expenseData = {
        amount: amount,
        category: expense.category,
        description: expense.description || '',
        date: new Date(expense.date).toISOString()
      };

      console.log('Submitting expense:', expenseData);
      await onExpenseAdded(expenseData);

      // Reset form
      setExpense({
        amount: '',
        category: '',
        description: '',
        date: new Date().toISOString().split('T')[0]
      });
      setError('');
    } catch (err) {
      console.error('Error submitting expense:', err);
      const errorMessage = err.response?.data?.message || 
                          err.response?.data?.error || 
                          err.message || 
                          'שגיאה בהוספת ההוצאה';
      setError(errorMessage);
    }
  };

  const handleCloseError = () => {
    setError('');
  };

  return (
    <Box component="form" onSubmit={handleSubmit}>
      <Snackbar open={!!error} autoHideDuration={6000} onClose={handleCloseError}>
        <Alert onClose={handleCloseError} severity="error" sx={{ width: '100%' }}>
          {error}
        </Alert>
      </Snackbar>

      <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', color: 'primary.main' }}>
        הוספת הוצאה חדשה
      </Typography>

      <Grid container spacing={3} sx={{ mt: 1 }}>
        <Grid item xs={12} sm={6} md={3}>
          <TextField
            required
            fullWidth
            label="סכום"
            type="number"
            value={expense.amount}
            onChange={(e) => setExpense({ ...expense, amount: e.target.value })}
            inputProps={{ min: "0", step: "0.01" }}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
              }
            }}
          />
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <FormControl required fullWidth>
            <InputLabel>קטגוריה</InputLabel>
            <Select
              value={expense.category}
              label="קטגוריה"
              onChange={(e) => setExpense({ ...expense, category: e.target.value })}
              sx={{
                borderRadius: 2,
                '& .MuiOutlinedInput-notchedOutline': {
                  borderColor: 'grey.300'
                }
              }}
            >
              {categories.map((category) => (
                <MenuItem key={category} value={category}>
                  {category}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <TextField
            fullWidth
            type="date"
            label="תאריך"
            value={expense.date}
            onChange={(e) => setExpense({ ...expense, date: e.target.value })}
            InputLabelProps={{ shrink: true }}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
              }
            }}
          />
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Button
            type="submit"
            variant="contained"
            fullWidth
            sx={{
              height: '56px',
              borderRadius: 2,
              textTransform: 'none',
              fontSize: '1rem',
              fontWeight: 'bold'
            }}
          >
            הוסף הוצאה
          </Button>
        </Grid>

        <Grid item xs={12}>
          <TextField
            fullWidth
            label="תיאור"
            value={expense.description}
            onChange={(e) => setExpense({ ...expense, description: e.target.value })}
            multiline
            rows={2}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
              }
            }}
          />
        </Grid>
      </Grid>
    </Box>
  );
};

export default ExpenseForm;
