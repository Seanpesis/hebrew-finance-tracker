import React, { useState } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  LinearProgress,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  IconButton,
  Tooltip,
  Chip
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import BeachAccessIcon from '@mui/icons-material/BeachAccess';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import SavingsIcon from '@mui/icons-material/Savings';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { he } from 'date-fns/locale';

const GoalsManager = ({ goals, setGoals }) => {
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedGoal, setSelectedGoal] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    targetAmount: '',
    currentAmount: '',
    category: '',
    deadline: null,
    description: ''
  });

  const handleOpenDialog = (goal = null) => {
    if (goal) {
      setSelectedGoal(goal);
      setFormData({
        title: goal.title,
        targetAmount: goal.targetAmount,
        currentAmount: goal.currentAmount,
        category: goal.category,
        deadline: new Date(goal.deadline),
        description: goal.description
      });
    } else {
      setSelectedGoal(null);
      setFormData({
        title: '',
        targetAmount: '',
        currentAmount: '',
        category: '',
        deadline: null,
        description: ''
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedGoal(null);
  };

  const handleSubmit = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('אנא התחבר מחדש');
      }

      // Validate required fields
      if (!formData.title || !formData.targetAmount || !formData.category || !formData.deadline) {
        throw new Error('נא למלא את כל שדות החובה');
      }

      // Create a copy of formData with parsed numbers and formatted date
      const goalData = {
        ...formData,
        targetAmount: Number(formData.targetAmount),
        currentAmount: Number(formData.currentAmount) || 0,
        deadline: formData.deadline.toISOString()
      };

      const baseUrl = '/api/goals';
      const url = selectedGoal ? `${baseUrl}/${selectedGoal._id}` : baseUrl;
      const method = selectedGoal ? 'PUT' : 'POST';

      console.log('Sending request to:', url);
      console.log('Request data:', goalData);
      console.log('Token:', token);

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(goalData)
      });

      console.log('Response status:', response.status);
      console.log('Response headers:', response.headers);

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        console.error('Server error:', errorData);
        throw new Error(errorData?.message || 'שגיאה בשמירת היעד');
      }

      const data = await response.json();
      console.log('Response data:', data);
      
      if (selectedGoal) {
        setGoals(goals.map(g => g._id === selectedGoal._id ? data : g));
      } else {
        setGoals([...goals, data]);
      }
      handleCloseDialog();
    } catch (error) {
      console.error('Error saving goal:', error);
      console.error('Error stack:', error.stack);
      alert(error.message || 'שגיאה בשמירת היעד');
    }
  };

  const handleDelete = async (goalId) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('אנא התחבר מחדש');
      }

      const response = await fetch(`/api/goals/${goalId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      console.log('Response status:', response.status);
      console.log('Response headers:', response.headers);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'שגיאה במחיקת היעד');
      }

      setGoals(goals.filter(g => g._id !== goalId));
    } catch (error) {
      console.error('Error deleting goal:', error);
      console.error('Error stack:', error.stack);
      alert(error.message || 'שגיאה במחיקת היעד');
    }
  };

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'חיסכון': return <SavingsIcon />;
      case 'השקעות': return <AccountBalanceIcon />;
      case 'קניות': return <ShoppingCartIcon />;
      case 'חופשה': return <BeachAccessIcon />;
      default: return <SavingsIcon />;
    }
  };

  const getProgress = (current, target) => {
    return Math.min((current / target) * 100, 100);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5" component="h2">
          יעדים פיננסיים
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
          sx={{ borderRadius: 2 }}
        >
          יעד חדש
        </Button>
      </Box>

      <Grid container spacing={3}>
        {goals.map((goal) => (
          <Grid item xs={12} sm={6} md={4} key={goal._id}>
            <Card 
              sx={{ 
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                position: 'relative',
                transition: 'transform 0.2s',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: 4
                }
              }}
            >
              <CardContent sx={{ flexGrow: 1 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                  <Typography variant="h6" component="h3" gutterBottom>
                    {goal.title}
                  </Typography>
                  <Box>
                    <Tooltip title="ערוך">
                      <IconButton size="small" onClick={() => handleOpenDialog(goal)}>
                        <EditIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="מחק">
                      <IconButton size="small" onClick={() => handleDelete(goal._id)}>
                        <DeleteIcon />
                      </IconButton>
                    </Tooltip>
                  </Box>
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  {getCategoryIcon(goal.category)}
                  <Chip 
                    label={goal.category} 
                    size="small" 
                    sx={{ ml: 1 }}
                  />
                </Box>

                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  {goal.description}
                </Typography>

                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" color="text.secondary">
                    התקדמות: ₪{goal.currentAmount.toLocaleString()} מתוך ₪{goal.targetAmount.toLocaleString()}
                  </Typography>
                  <LinearProgress 
                    variant="determinate" 
                    value={getProgress(goal.currentAmount, goal.targetAmount)}
                    sx={{ 
                      mt: 1,
                      height: 8,
                      borderRadius: 4,
                      bgcolor: 'rgba(0,0,0,0.1)',
                      '& .MuiLinearProgress-bar': {
                        borderRadius: 4
                      }
                    }}
                  />
                </Box>

                <Typography variant="body2" color="text.secondary">
                  תאריך יעד: {new Date(goal.deadline).toLocaleDateString('he-IL')}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Dialog 
        open={openDialog} 
        onClose={handleCloseDialog}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          {selectedGoal ? 'עריכת יעד' : 'יעד חדש'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
            <TextField
              label="כותרת"
              fullWidth
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            />
            <TextField
              label="סכום יעד"
              type="number"
              fullWidth
              value={formData.targetAmount}
              onChange={(e) => setFormData({ ...formData, targetAmount: e.target.value })}
            />
            <TextField
              label="סכום נוכחי"
              type="number"
              fullWidth
              value={formData.currentAmount}
              onChange={(e) => setFormData({ ...formData, currentAmount: e.target.value })}
            />
            <FormControl fullWidth>
              <InputLabel>קטגוריה</InputLabel>
              <Select
                value={formData.category}
                label="קטגוריה"
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              >
                <MenuItem value="חיסכון">חיסכון</MenuItem>
                <MenuItem value="השקעות">השקעות</MenuItem>
                <MenuItem value="קניות">קניות</MenuItem>
                <MenuItem value="חופשה">חופשה</MenuItem>
              </Select>
            </FormControl>
            <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={he}>
              <DatePicker
                label="תאריך יעד"
                value={formData.deadline}
                onChange={(newValue) => setFormData({ ...formData, deadline: newValue })}
                renderInput={(params) => <TextField {...params} fullWidth />}
              />
            </LocalizationProvider>
            <TextField
              label="תיאור"
              multiline
              rows={4}
              fullWidth
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>ביטול</Button>
          <Button onClick={handleSubmit} variant="contained">
            {selectedGoal ? 'עדכן' : 'צור'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default GoalsManager;
