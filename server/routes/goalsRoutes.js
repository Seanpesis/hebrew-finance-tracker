const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');

// Placeholder for goals routes
router.get('/', auth, async (req, res) => {
  try {
    res.json([]);
  } catch (error) {
    console.error('Get goals error:', error);
    res.status(500).json({ message: 'שגיאה בטעינת היעדים' });
  }
});

module.exports = router;
