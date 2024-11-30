import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Paper,
  LinearProgress
} from '@mui/material';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import EqualizerIcon from '@mui/icons-material/Equalizer';
import PieChartIcon from '@mui/icons-material/PieChart';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const ExpenseAnalytics = ({ expenses }) => {
  // חישוב סך ההוצאות לפי קטגוריה
  const categoryTotals = expenses.reduce((acc, expense) => {
    acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
    return acc;
  }, {});

  // מציאת הקטגוריה עם ההוצאה הגבוהה ביותר
  const highestExpenseCategory = Object.entries(categoryTotals)
    .sort(([, a], [, b]) => b - a)[0];

  // חישוב ממוצע הוצאות יומי
  const dailyAverage = expenses.length > 0
    ? expenses.reduce((sum, expense) => sum + expense.amount, 0) / expenses.length
    : 0;

  // נתונים לגרף מגמות
  const last6Months = Array.from({ length: 6 }, (_, i) => {
    const d = new Date();
    d.setMonth(d.getMonth() - i);
    return d.toLocaleString('he-IL', { month: 'short' });
  }).reverse();

  const monthlyData = last6Months.map(month => {
    return expenses
      .filter(expense => {
        const expenseMonth = new Date(expense.date)
          .toLocaleString('he-IL', { month: 'short' });
        return expenseMonth === month;
      })
      .reduce((sum, expense) => sum + expense.amount, 0);
  });

  const chartData = {
    labels: last6Months,
    datasets: [
      {
        label: 'הוצאות חודשיות',
        data: monthlyData,
        fill: false,
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1
      }
    ]
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'מגמת הוצאות ב-6 חודשים אחרונים'
      }
    }
  };

  return (
    <Box sx={{ mt: 4 }}>
      <Typography variant="h6" gutterBottom>
        ניתוח הוצאות
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                קטגוריה עם ההוצאה הגבוהה ביותר
              </Typography>
              <Typography variant="h5" component="div">
                {highestExpenseCategory?.[0]}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                ₪{highestExpenseCategory?.[1]?.toFixed(2)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                ממוצע הוצאות יומי
              </Typography>
              <Typography variant="h5" component="div">
                ₪{dailyAverage.toFixed(2)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                יעד חיסכון חודשי
              </Typography>
              <Typography variant="body2" color="textSecondary">
                התקדמות לעבר היעד
              </Typography>
              <LinearProgress 
                variant="determinate" 
                value={70} 
                sx={{ mt: 1 }}
              />
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12}>
          <Paper sx={{ p: 2 }}>
            <Line data={chartData} options={options} />
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ExpenseAnalytics;
