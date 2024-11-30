import React, { useState } from 'react';
import {
  Box,
  Typography,
  TextField,
  Divider,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  LinearProgress,
  InputAdornment
} from '@mui/material';

const BudgetSummary = ({ expenses, income, onUpdateIncome }) => {
  const [isEditingIncome, setIsEditingIncome] = useState(false);
  const [tempIncome, setTempIncome] = useState(income?.toString() || '0');
  const [showBudgetAlert, setShowBudgetAlert] = useState(false);
  const [error, setError] = useState('');

  const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);
  const remaining = income - totalExpenses;
  const spentPercentage = income > 0 ? (totalExpenses / income) * 100 : 0;

  const handleIncomeChange = (event) => {
    const value = event.target.value;
    if (value === '' || /^\d*\.?\d*$/.test(value)) {
      setTempIncome(value);
      setError('');
    }
  };

  const handleIncomeSubmit = async () => {
    try {
      const numIncome = parseFloat(tempIncome);
      
      if (isNaN(numIncome) || numIncome < 0) {
        setError('נא להזין מספר חיובי');
        return;
      }

      await onUpdateIncome(numIncome);
      setIsEditingIncome(false);
      setError('');
    } catch (err) {
      console.error('Error updating income:', err);
      setError(err.message || 'אירעה שגיאה בעדכון ההכנסה');
    }
  };

  const handleDialogClose = () => {
    setIsEditingIncome(false);
    setTempIncome(income?.toString() || '0');
    setError('');
  };

  // מציג התראה כשנשאר פחות מ-20% מהתקציב
  React.useEffect(() => {
    if (income > 0 && remaining < income * 0.2) {
      setShowBudgetAlert(true);
    }
  }, [remaining, income]);

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h6" gutterBottom>
        סיכום תקציב
      </Typography>
      
      <Box sx={{ mt: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Typography variant="body1" sx={{ flexGrow: 1 }}>
            הכנסה חודשית:
          </Typography>
          <Button
            size="small"
            onClick={() => {
              setTempIncome(income?.toString() || '0');
              setIsEditingIncome(true);
            }}
            variant="outlined"
            color="primary"
          >
            ערוך
          </Button>
        </Box>
        <Typography variant="h5" sx={{ mb: 2 }}>
          ₪{income?.toLocaleString('he-IL', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </Typography>

        <Divider sx={{ my: 2 }} />
        
        <Typography variant="body1" sx={{ mb: 1 }}>
          סה"כ הוצאות: ₪{totalExpenses.toLocaleString('he-IL', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </Typography>
        
        <Box sx={{ mb: 2 }}>
          <Typography variant="body2" color="textSecondary" sx={{ mb: 1 }}>
            ניצול תקציב
          </Typography>
          <LinearProgress 
            variant="determinate" 
            value={Math.min(spentPercentage, 100)}
            color={spentPercentage > 80 ? "error" : "primary"}
            sx={{ height: 8, borderRadius: 5 }}
          />
          <Typography variant="body2" color="textSecondary" sx={{ mt: 0.5 }}>
            {spentPercentage.toFixed(1)}%
          </Typography>
        </Box>

        <Typography
          variant="h6"
          color={remaining >= 0 ? 'success.main' : 'error.main'}
          sx={{ mt: 2 }}
        >
          נותר: ₪{remaining.toLocaleString('he-IL', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </Typography>

        {showBudgetAlert && (
          <Alert 
            severity="warning" 
            sx={{ mt: 2 }}
            onClose={() => setShowBudgetAlert(false)}
          >
            שים לב! נשאר פחות מ-20% מהתקציב החודשי
          </Alert>
        )}
      </Box>

      <Dialog 
        open={isEditingIncome} 
        onClose={handleDialogClose}
        PaperProps={{
          sx: { minWidth: '300px' }
        }}
      >
        <DialogTitle>עריכת הכנסה חודשית</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="הכנסה חודשית"
            type="text"
            fullWidth
            value={tempIncome}
            onChange={handleIncomeChange}
            error={!!error}
            helperText={error}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">₪</InputAdornment>
              ),
            }}
            sx={{ mt: 2 }}
          />
        </DialogContent>
        <DialogActions sx={{ p: 2, pt: 0 }}>
          <Button onClick={handleDialogClose} color="inherit">
            ביטול
          </Button>
          <Button 
            onClick={handleIncomeSubmit} 
            color="primary" 
            variant="contained"
            disabled={!tempIncome || isNaN(parseFloat(tempIncome))}
          >
            שמור
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default BudgetSummary;
