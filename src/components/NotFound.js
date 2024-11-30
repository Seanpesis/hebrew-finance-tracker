import React from 'react';
import { Box, Typography, Button, Container } from '@mui/material';
import { withRouter } from 'react-router-dom';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';

const NotFound = ({ history }) => {
  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          textAlign: 'center',
          gap: 2
        }}
      >
        <ErrorOutlineIcon sx={{ fontSize: 64, color: 'error.main' }} />
        <Typography variant="h4" component="h1" gutterBottom>
          404
        </Typography>
        <Typography variant="h6" gutterBottom>
          העמוד המבוקש לא נמצא
        </Typography>
        <Typography color="text.secondary" paragraph>
          הדף שחיפשת אינו קיים או שהוסר
        </Typography>
        <Box sx={{ mt: 2 }}>
          <Button
            variant="contained"
            onClick={() => history.push('/')}
            sx={{ mx: 1 }}
          >
            חזרה לדף הבית
          </Button>
          <Button
            variant="outlined"
            onClick={() => history.goBack()}
            sx={{ mx: 1 }}
          >
            חזרה לדף הקודם
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default withRouter(NotFound);
