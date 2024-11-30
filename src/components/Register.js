import React, { useState } from 'react';
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  Link,
} from '@mui/material';
import { withRouter } from 'react-router-dom';
import axios from 'axios';

const Register = ({ history }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setError('הסיסמאות אינן תואמות');
      return;
    }
    try {
      const response = await axios.post('/api/users/register', {
        name: formData.name,
        email: formData.email,
        password: formData.password,
      });
      localStorage.setItem('token', response.data.token);
      history.push('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'אירעה שגיאה בהרשמה');
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <Paper elevation={3} sx={{ p: 4, mt: 8, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Typography component="h1" variant="h5">
          הרשמה
        </Typography>
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
          {error && (
            <Typography color="error" align="center" sx={{ mb: 2 }}>
              {error}
            </Typography>
          )}
          <TextField
            margin="normal"
            required
            fullWidth
            name="name"
            label="שם מלא"
            type="text"
            autoFocus
            value={formData.name}
            onChange={handleChange}
            dir="rtl"
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="email"
            label="אימייל"
            type="email"
            value={formData.email}
            onChange={handleChange}
            dir="rtl"
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="סיסמה"
            type="password"
            value={formData.password}
            onChange={handleChange}
            dir="rtl"
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="confirmPassword"
            label="אימות סיסמה"
            type="password"
            value={formData.confirmPassword}
            onChange={handleChange}
            dir="rtl"
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            הרשמה
          </Button>
          <Box sx={{ textAlign: 'center' }}>
            <Link component="button" variant="body2" onClick={() => history.push('/')}>
              כבר יש לך חשבון? התחבר כאן
            </Link>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
};

export default withRouter(Register);
