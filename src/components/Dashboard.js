import React, { useState, useEffect } from 'react';
import { 
  Container, 
  Grid, 
  Paper, 
  Typography,
  Box,
  Tab,
  Tabs,
  CircularProgress,
  Alert,
  Snackbar
} from '@mui/material';
import ExpenseForm from './ExpenseForm';
import ExpenseChart from './ExpenseChart';
import ExpenseList from './ExpenseList';
import BudgetSummary from './BudgetSummary';
import ExpenseAnalytics from './ExpenseAnalytics';
import GoalsManager from './GoalsManager';
import FinancialAdvisor from './FinancialAdvisor';

const Dashboard = () => {
  const [expenses, setExpenses] = useState([]);
  const [income, setIncome] = useState(0);
  const [goals, setGoals] = useState([]);
  const [activeTab, setActiveTab] = useState(0);
  const [userName, setUserName] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('אנא התחבר מחדש');
        }

        // Fetch expenses
        const expensesRes = await fetch('http://localhost:5002/api/expenses', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        if (!expensesRes.ok) {
          const errorData = await expensesRes.json();
          throw new Error(errorData.message || 'שגיאה בטעינת הוצאות');
        }
        const expensesData = await expensesRes.json();
        setExpenses(expensesData);

        // Fetch goals
        const goalsRes = await fetch('http://localhost:5002/api/goals', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        if (!goalsRes.ok) {
          const errorData = await goalsRes.json();
          throw new Error(errorData.message || 'שגיאה בטעינת יעדים');
        }
        const goalsData = await goalsRes.json();
        setGoals(goalsData);

        // Fetch user data including income
        const userRes = await fetch('http://localhost:5002/api/users/profile', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        if (!userRes.ok) {
          const errorData = await userRes.json();
          throw new Error(errorData.message || 'שגיאה בטעינת פרופיל משתמש');
        }
        const userData = await userRes.json();
        setIncome(userData.income || 0);
        setUserName(userData.name || '');
        
      } catch (error) {
        console.error('Error fetching data:', error);
        setError(error.message || 'שגיאה בטעינת נתונים');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleUpdateIncome = async (newIncome) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('אנא התחבר מחדש');
      }

      const response = await fetch('http://localhost:5002/api/users/income', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ income: Number(newIncome) })
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'שגיאה בעדכון ההכנסה');
      }

      const userData = await response.json();
      setIncome(Number(userData.income));
      setSuccessMessage('ההכנסה עודכנה בהצלחה');
    } catch (error) {
      console.error('Error updating income:', error);
      setError(error.message);
      throw error;
    }
  };

  const handleExpenseAdded = async (newExpense) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('אנא התחבר מחדש');
      }

      console.log('Sending expense to server:', newExpense);
      const response = await fetch('http://localhost:5002/api/expenses', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(newExpense)
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Server error response:', errorData);
        throw new Error(errorData.message || errorData.error || 'שגיאה בהוספת הוצאה');
      }

      const savedExpense = await response.json();
      console.log('Received saved expense from server:', savedExpense);
      
      setExpenses(prevExpenses => [...prevExpenses, savedExpense]);
      setSuccessMessage('ההוצאה נוספה בהצלחה');
    } catch (error) {
      console.error('Error adding expense:', error);
      throw error; // Re-throw to be caught by the form
    }
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handleCloseError = () => {
    setError('');
  };

  const handleCloseSuccess = () => {
    setSuccessMessage('');
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" dir="rtl">
      <Snackbar open={!!error} autoHideDuration={6000} onClose={handleCloseError}>
        <Alert onClose={handleCloseError} severity="error" sx={{ width: '100%' }}>
          {error}
        </Alert>
      </Snackbar>

      <Snackbar open={!!successMessage} autoHideDuration={6000} onClose={handleCloseSuccess}>
        <Alert onClose={handleCloseSuccess} severity="success" sx={{ width: '100%' }}>
          {successMessage}
        </Alert>
      </Snackbar>

      <Box sx={{ 
        width: '100%', 
        mb: 4,
        mt: 3,
        borderRadius: 2,
        bgcolor: 'background.paper',
        boxShadow: 3,
        overflow: 'hidden'
      }}>
        <Box sx={{ 
          p: 3, 
          bgcolor: 'primary.main', 
          color: 'primary.contrastText',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <Typography variant="h5" component="h1" sx={{ fontWeight: 'bold' }}>
            {`שלום ${userName || 'אורח'}`}
          </Typography>
          <Typography variant="subtitle1">
            {new Date().toLocaleDateString('he-IL', { 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </Typography>
        </Box>

        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          variant="scrollable"
          scrollButtons="auto"
          aria-label="dashboard tabs"
          sx={{
            px: 2,
            borderBottom: 1,
            borderColor: 'divider',
            '& .MuiTab-root': {
              minWidth: 120,
              fontWeight: 500,
              fontSize: '1rem',
              textTransform: 'none',
              py: 2
            },
          }}
        >
          <Tab label="סקירה כללית" />
          <Tab label="הוצאות" />
          <Tab label="יעדים" />
          <Tab label="ניתוח" />
          <Tab label="ייעוץ פיננסי" />
        </Tabs>
      </Box>

      <Grid container spacing={3}>
        {activeTab === 0 && (
          <>
            <Grid item xs={12} md={8}>
              <Paper sx={{ 
                p: 3, 
                height: '100%',
                borderRadius: 2,
                boxShadow: 3
              }}>
                <Typography variant="h6" gutterBottom>
                  סיכום הוצאות
                </Typography>
                <ExpenseChart expenses={expenses} />
              </Paper>
            </Grid>
            <Grid item xs={12} md={4}>
              <Paper sx={{ 
                p: 3,
                height: '100%',
                borderRadius: 2,
                boxShadow: 3
              }}>
                <BudgetSummary 
                  expenses={expenses} 
                  income={income}
                  onUpdateIncome={handleUpdateIncome}
                />
              </Paper>
            </Grid>
            <Grid item xs={12}>
              <Paper sx={{ 
                p: 3,
                borderRadius: 2,
                boxShadow: 3
              }}>
                <ExpenseForm onExpenseAdded={handleExpenseAdded} />
              </Paper>
            </Grid>
          </>
        )}
        
        {activeTab === 1 && (
          <Grid item xs={12}>
            <Paper sx={{ 
              p: 3,
              borderRadius: 2,
              boxShadow: 3
            }}>
              <ExpenseList expenses={expenses} />
            </Paper>
          </Grid>
        )}
        
        {activeTab === 2 && (
          <Grid item xs={12}>
            <Paper sx={{ 
              p: 3,
              borderRadius: 2,
              boxShadow: 3
            }}>
              <GoalsManager goals={goals} setGoals={setGoals} />
            </Paper>
          </Grid>
        )}
        
        {activeTab === 3 && (
          <Grid item xs={12}>
            <Paper sx={{ 
              p: 3,
              borderRadius: 2,
              boxShadow: 3
            }}>
              <ExpenseAnalytics expenses={expenses} />
            </Paper>
          </Grid>
        )}
        
        {activeTab === 4 && (
          <Grid item xs={12}>
            <Paper sx={{ 
              p: 3,
              borderRadius: 2,
              boxShadow: 3
            }}>
              <FinancialAdvisor expenses={expenses} income={income} goals={goals} />
            </Paper>
          </Grid>
        )}
      </Grid>
    </Container>
  );
};

export default Dashboard;
