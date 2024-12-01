import React, { useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme, CssBaseline, Box, StyledEngineProvider } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { he } from 'date-fns/locale';
import rtlPlugin from 'stylis-plugin-rtl';
import { CacheProvider } from '@emotion/react';
import createCache from '@emotion/cache';
import { prefixer } from 'stylis';
import axios from 'axios';

import Dashboard from './components/Dashboard';
import Login from './components/Login';
import Register from './components/Register';
import ErrorBoundary from './components/ErrorBoundary';
import NotFound from './components/NotFound';
import Navbar from './components/Navbar';
import PrivateRoute from './components/PrivateRoute';

// Configure axios defaults
axios.defaults.baseURL = 'http://localhost:5002';
axios.defaults.headers.post['Content-Type'] = 'application/json';

// Add axios interceptor for token
axios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

const cacheRtl = createCache({
  key: 'rtl',
  stylisPlugins: [prefixer, rtlPlugin],
});

const theme = createTheme({
  direction: 'rtl',
  typography: {
    fontFamily: 'Rubik, Arial, sans-serif',
    h1: { fontSize: '2.5rem', fontWeight: 600 },
    h2: { fontSize: '2rem', fontWeight: 600 },
    h3: { fontSize: '1.75rem', fontWeight: 600 },
    h4: { fontSize: '1.5rem', fontWeight: 500 },
    h5: { fontSize: '1.25rem', fontWeight: 500 },
    h6: { fontSize: '1rem', fontWeight: 500 },
  },
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

const AppContent = () => {
  const token = localStorage.getItem('token');
  
  return (
    <>
      <Navbar />
      <Box sx={{ p: 3, direction: 'rtl' }}>
        <Routes>
          <Route
            path="/"
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            }
          />
          <Route
            path="/login"
            element={token ? <Navigate to="/" /> : <Login />}
          />
          <Route
            path="/register"
            element={token ? <Navigate to="/" /> : <Register />}
          />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Box>
    </>
  );
};

function App() {
  useEffect(() => {
    // Set up axios defaults on app load
    const token = localStorage.getItem('token');
    if (token) {
      console.log('Setting default Authorization header');
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }

    // Set up axios interceptors for error handling
    axios.interceptors.response.use(
      (response) => response,
      (error) => {
        console.error('Axios error:', error.response || error);
        if (error.response?.status === 401) {
          console.log('Unauthorized access - clearing token');
          localStorage.removeItem('token');
          delete axios.defaults.headers.common['Authorization'];
          window.location.href = '/login';
        }
        return Promise.reject(error);
      }
    );
  }, []);

  return (
    <ErrorBoundary>
      <CacheProvider value={cacheRtl}>
        <StyledEngineProvider injectFirst>
          <ThemeProvider theme={theme}>
            <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={he}>
              <CssBaseline />
              <Router>
                <AppContent />
              </Router>
            </LocalizationProvider>
          </ThemeProvider>
        </StyledEngineProvider>
      </CacheProvider>
    </ErrorBoundary>
  );
}

export default App;
