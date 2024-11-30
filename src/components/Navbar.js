import React from 'react';
import {
  AppBar,
  Box,
  Toolbar,
  Typography,
  IconButton,
  Menu,
  MenuItem,
  Avatar
} from '@mui/material';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import { withRouter } from 'react-router-dom';

const Navbar = ({ history, userName }) => {
  const [anchorEl, setAnchorEl] = React.useState(null);

  // אם אנחנו בדף הלוגין או הרשמה, לא נציג את הנאבבר
  if (history.location.pathname === '/login' || history.location.pathname === '/register') {
    return null;
  }

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userName');
    history.push('/login');
    handleClose();
  };

  return (
    <AppBar position="static" sx={{ marginBottom: 3 }}>
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          מעקב הוצאות
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          {userName && (
            <Typography variant="body1" sx={{ marginLeft: 1 }}>
              שלום, {userName}
            </Typography>
          )}
          <IconButton
            size="large"
            aria-label="account of current user"
            aria-controls="menu-appbar"
            aria-haspopup="true"
            onClick={handleMenu}
            color="inherit"
          >
            <Avatar sx={{ bgcolor: 'secondary.main' }}>
              {userName?.charAt(0) || <AccountCircleIcon />}
            </Avatar>
          </IconButton>
          <Menu
            id="menu-appbar"
            anchorEl={anchorEl}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'right',
            }}
            keepMounted
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            open={Boolean(anchorEl)}
            onClose={handleClose}
          >
            <MenuItem onClick={handleLogout}>
              <ExitToAppIcon sx={{ marginLeft: 1 }} />
              התנתק
            </MenuItem>
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default withRouter(Navbar);
