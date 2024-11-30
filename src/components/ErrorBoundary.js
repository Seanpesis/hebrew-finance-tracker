import React, { Component } from 'react';
import {
  Box,
  Typography,
  Button,
  Container,
  Paper
} from '@mui/material';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by ErrorBoundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <Container maxWidth="sm">
          <Box sx={{ mt: 8, textAlign: 'center' }}>
            <Paper sx={{ p: 4, borderRadius: 2 }}>
              <ErrorOutlineIcon sx={{ fontSize: 64, color: 'error.main', mb: 2 }} />
              <Typography variant="h4" gutterBottom color="error">
                משהו השתבש
              </Typography>
              <Typography variant="body1" color="text.secondary" paragraph>
                מצטערים, אירעה שגיאה בלתי צפויה. אנא נסה לרענן את הדף.
              </Typography>
              <Box sx={{ mt: 4 }}>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => window.location.reload()}
                  sx={{ mx: 1 }}
                >
                  רענן דף
                </Button>
                <Button
                  variant="outlined"
                  color="primary"
                  onClick={() => window.location.href = '/'}
                  sx={{ mx: 1 }}
                >
                  חזור לדף הבית
                </Button>
              </Box>
            </Paper>
          </Box>
        </Container>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
