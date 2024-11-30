import React from 'react';
import { Doughnut } from 'react-chartjs-2';
import { Box, Typography } from '@mui/material';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

const ExpenseChart = ({ expenses }) => {
  const categoryTotals = expenses.reduce((acc, expense) => {
    acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
    return acc;
  }, {});

  const data = {
    labels: Object.keys(categoryTotals),
    datasets: [
      {
        data: Object.values(categoryTotals),
        backgroundColor: [
          '#FF6384',
          '#36A2EB',
          '#FFCE56',
          '#4BC0C0',
          '#9966FF',
          '#FF9F40',
          '#FF99CC'
        ],
        hoverBackgroundColor: [
          '#FF6384',
          '#36A2EB',
          '#FFCE56',
          '#4BC0C0',
          '#9966FF',
          '#FF9F40',
          '#FF99CC'
        ]
      }
    ]
  };

  const options = {
    plugins: {
      legend: {
        position: 'right',
        rtl: true,
        labels: {
          font: {
            size: 14
          }
        }
      }
    },
    maintainAspectRatio: false
  };

  return (
    <Box sx={{ height: '400px', position: 'relative' }}>
      {expenses.length > 0 ? (
        <Doughnut data={data} options={options} />
      ) : (
        <Typography variant="h6" align="center" sx={{ pt: 8 }}>
          אין הוצאות להצגה
        </Typography>
      )}
    </Box>
  );
};

export default ExpenseChart;
