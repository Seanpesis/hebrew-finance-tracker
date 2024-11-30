import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography
} from '@mui/material';

const ExpenseList = ({ expenses }) => {
  return (
    <>
      <Typography variant="h6" gutterBottom>
        רשימת הוצאות
      </Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell align="right">תאריך</TableCell>
              <TableCell align="right">קטגוריה</TableCell>
              <TableCell align="right">תיאור</TableCell>
              <TableCell align="right">סכום</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {expenses.map((expense) => (
              <TableRow key={expense.id}>
                <TableCell align="right">{expense.date}</TableCell>
                <TableCell align="right">{expense.category}</TableCell>
                <TableCell align="right">{expense.description}</TableCell>
                <TableCell align="right">₪{expense.amount.toFixed(2)}</TableCell>
              </TableRow>
            ))}
            {expenses.length === 0 && (
              <TableRow>
                <TableCell colSpan={4} align="center">
                  אין הוצאות להצגה
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
};

export default ExpenseList;
