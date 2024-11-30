const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const auth = require('../middleware/auth');

// Register User
router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    console.log('Registration attempt:', { email, name });

    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.log('User already exists:', email);
      return res.status(400).json({ message: 'משתמש זה כבר קיים במערכת' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user
    const user = await User.create({
      name,
      email,
      password: hashedPassword
    });

    if (user) {
      console.log('User registered successfully:', email);
      const token = generateToken(user._id);
      res.status(201).json({
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email
        }
      });
    }
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ 
      message: 'שגיאה בהרשמה',
      error: error.message 
    });
  }
});

// Login User
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log('Login attempt:', { email });

    if (!email || !password) {
      return res.status(400).json({ message: 'נא למלא את כל השדות' });
    }

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      console.log('User not found:', email);
      return res.status(401).json({ message: 'אימייל או סיסמה שגויים' });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    console.log('Password match:', isMatch);

    if (!isMatch) {
      console.log('Invalid password for user:', email);
      return res.status(401).json({ message: 'אימייל או סיסמה שגויים' });
    }

    // Generate token
    console.log('Generating token with secret:', process.env.JWT_SECRET ? 'exists' : 'missing');
    const token = generateToken(user._id);
    console.log('Login successful, token generated for:', email);

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ 
      message: 'שגיאה בהתחברות',
      error: error.message 
    });
  }
});

// Get User Profile
router.get('/profile', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'משתמש לא נמצא' });
    }
    res.json(user);
  } catch (error) {
    console.error('Profile fetch error:', error);
    res.status(500).json({ message: 'שגיאה בטעינת פרופיל המשתמש' });
  }
});

// Update User Income
router.put('/income', auth, async (req, res) => {
  try {
    const { income } = req.body;
    if (income < 0) {
      return res.status(400).json({ message: 'הכנסה לא יכולה להיות שלילית' });
    }

    const user = await User.findByIdAndUpdate(
      req.user.id,
      { income },
      { new: true }
    );

    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ message: 'משתמש לא נמצא' });
    }
  } catch (error) {
    console.error('Income update error:', error);
    res.status(500).json({ message: 'שגיאה בעדכון ההכנסה' });
  }
});

// Generate JWT Token
const generateToken = (id) => {
  return jwt.sign(
    { id },
    process.env.JWT_SECRET || 'your-secret-key',
    { expiresIn: '30d' }
  );
};

module.exports = router;
