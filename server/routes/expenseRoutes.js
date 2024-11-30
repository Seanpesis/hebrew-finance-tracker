const express = require('express');
const router = express.Router();
const Expense = require('../models/Expense');
const auth = require('../middleware/auth');

// Get all expenses for the authenticated user
router.get('/', auth, async (req, res) => {
  try {
    console.log('Fetching expenses for user:', req.user._id);
    const expenses = await Expense.find({ user: req.user._id })
      .sort({ date: -1 })
      .lean()  // Convert to plain JavaScript objects
      .exec(); // Execute the query
    
    console.log('Found expenses:', expenses);
    res.json(expenses);
  } catch (error) {
    console.error('Error fetching expenses:', error);
    res.status(500).json({ message: 'שגיאה בטעינת הוצאות' });
  }
});

// Add a new expense
router.post('/', auth, async (req, res) => {
  try {
    console.log('Creating new expense:', req.body);
    console.log('User ID:', req.user._id);

    const { amount, category, description, date } = req.body;

    // Validate required fields
    if (!amount || !category) {
      return res.status(400).json({ message: 'סכום וקטגוריה הם שדות חובה' });
    }

    // Validate amount
    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      return res.status(400).json({ message: 'סכום ההוצאה חייב להיות מספר חיובי' });
    }

    // Create expense object with user ID from auth middleware
    const expenseData = {
      user: req.user._id,  // Use _id instead of id
      amount: parsedAmount,
      category,
      description: description || '',
      date: date ? new Date(date) : new Date()
    };

    console.log('Saving expense with data:', expenseData);
    
    // Create and save the expense
    const expense = new Expense(expenseData);
    const savedExpense = await expense.save();
    
    console.log('Saved expense:', savedExpense);
    
    // Convert to plain object and send
    const plainExpense = savedExpense.toObject();
    res.status(201).json(plainExpense);
  } catch (error) {
    console.error('Error creating expense:', error);
    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: error.message || 'נתוני ההוצאה אינם תקינים' });
    }
    res.status(500).json({ message: 'שגיאה בשמירת ההוצאה' });
  }
});

// Update an expense
router.put('/:id', auth, async (req, res) => {
  try {
    const { amount, category, description, date } = req.body;
    const expense = await Expense.findOne({ _id: req.params.id, user: req.user._id });

    if (!expense) {
      return res.status(404).json({ message: 'ההוצאה לא נמצאה' });
    }

    // Update fields
    if (amount) expense.amount = amount;
    if (category) expense.category = category;
    if (description !== undefined) expense.description = description;
    if (date) expense.date = date;

    const updatedExpense = await expense.save();
    res.json(updatedExpense);
  } catch (error) {
    console.error('Error updating expense:', error);
    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: 'נתוני ההוצאה אינם תקינים' });
    }
    res.status(500).json({ message: 'שגיאה בעדכון ההוצאה' });
  }
});

// Delete an expense
router.delete('/:id', auth, async (req, res) => {
  try {
    const expense = await Expense.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    
    if (!expense) {
      return res.status(404).json({ message: 'ההוצאה לא נמצאה' });
    }

    res.json({ message: 'ההוצאה נמחקה בהצלחה' });
  } catch (error) {
    console.error('Error deleting expense:', error);
    res.status(500).json({ message: 'שגיאה במחיקת ההוצאה' });
  }
});

module.exports = router;
