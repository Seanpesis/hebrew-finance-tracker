const express = require('express');
const router = express.Router();
const Goal = require('../models/Goal');
const auth = require('../middleware/auth');

// Get all goals for a user
router.get('/', auth, async (req, res) => {
  try {
    console.log('Fetching goals for user:', req.user._id);
    const goals = await Goal.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .lean()
      .exec();
    console.log('Found goals:', goals);
    res.json(goals);
  } catch (err) {
    console.error('Error fetching goals:', err);
    res.status(500).json({ message: 'שגיאה בטעינת היעדים' });
  }
});

// Create a new goal
router.post('/', auth, async (req, res) => {
  try {
    console.log('Creating new goal:', req.body);
    const { title, targetAmount, currentAmount, category, deadline, description } = req.body;
    
    // Validate required fields
    if (!title || !targetAmount || !category || !deadline) {
      return res.status(400).json({ message: 'כל שדות החובה חייבים להיות מלאים' });
    }

    // Create goal with proper user ID
    const goalData = {
      user: req.user._id,
      title,
      targetAmount: Number(targetAmount),
      currentAmount: Number(currentAmount) || 0,
      category,
      deadline: new Date(deadline),
      description: description || ''
    };

    console.log('Saving goal with data:', goalData);
    const goal = new Goal(goalData);
    const savedGoal = await goal.save();
    console.log('Saved goal:', savedGoal);

    // Convert to plain object and send
    const plainGoal = savedGoal.toObject();
    res.status(201).json(plainGoal);
  } catch (err) {
    console.error('Error creating goal:', err);
    if (err.name === 'ValidationError') {
      return res.status(400).json({ message: err.message || 'נתוני היעד אינם תקינים' });
    }
    res.status(500).json({ message: 'שגיאה ביצירת היעד' });
  }
});

// Update a goal
router.put('/:id', auth, async (req, res) => {
  try {
    const { title, targetAmount, currentAmount, category, deadline, description } = req.body;
    
    const goal = await Goal.findOne({ _id: req.params.id, user: req.user._id });
    if (!goal) {
      return res.status(404).json({ message: 'היעד לא נמצא' });
    }

    // Update goal fields
    goal.title = title;
    goal.targetAmount = Number(targetAmount);
    goal.currentAmount = Number(currentAmount) || 0;
    goal.category = category;
    goal.deadline = new Date(deadline);
    goal.description = description || '';

    const updatedGoal = await goal.save();
    const plainGoal = updatedGoal.toObject();
    res.json(plainGoal);
  } catch (err) {
    console.error('Error updating goal:', err);
    if (err.name === 'ValidationError') {
      return res.status(400).json({ message: err.message || 'נתוני היעד אינם תקינים' });
    }
    res.status(500).json({ message: 'שגיאה בעדכון היעד' });
  }
});

// Delete a goal
router.delete('/:id', auth, async (req, res) => {
  try {
    const goal = await Goal.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    if (!goal) {
      return res.status(404).json({ message: 'היעד לא נמצא' });
    }
    res.json({ message: 'היעד נמחק בהצלחה' });
  } catch (err) {
    res.status(500).json({ message: 'שגיאה במחיקת היעד' });
  }
});

// Update goal progress
router.patch('/:id/progress', auth, async (req, res) => {
  try {
    const { amount } = req.body;
    const goal = await Goal.findOne({ _id: req.params.id, user: req.user._id });
    
    if (!goal) {
      return res.status(404).json({ message: 'היעד לא נמצא' });
    }

    goal.currentAmount = Math.min(goal.currentAmount + amount, goal.targetAmount);
    await goal.save();
    
    res.json(goal);
  } catch (err) {
    res.status(400).json({ message: 'שגיאה בעדכון ההתקדמות' });
  }
});

module.exports = router;
