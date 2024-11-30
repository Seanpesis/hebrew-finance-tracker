const mongoose = require('mongoose');

const expenseSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'משתמש הוא שדה חובה']
  },
  amount: {
    type: Number,
    required: [true, 'סכום הוא שדה חובה'],
    min: [0, 'הסכום חייב להיות חיובי']
  },
  category: {
    type: String,
    required: [true, 'קטגוריה היא שדה חובה'],
    enum: {
      values: ['מזון', 'תחבורה', 'דיור', 'בילויים', 'קניות', 'חשבונות', 'אחר'],
      message: 'קטגוריה {VALUE} אינה חוקית'
    }
  },
  description: {
    type: String,
    trim: true,
    maxlength: [200, 'התיאור לא יכול להיות ארוך מ-200 תווים']
  },
  date: {
    type: Date,
    default: Date.now,
    required: [true, 'תאריך הוא שדה חובה']
  },
  isRecurring: {
    type: Boolean,
    default: false
  },
  recurringInterval: {
    type: String,
    enum: ['weekly', 'monthly', 'yearly'],
    default: 'monthly'
  }
}, {
  timestamps: true,
  toJSON: {
    transform: function(doc, ret) {
      ret.id = ret._id;
      delete ret._id;
      delete ret.__v;
      return ret;
    }
  }
});

// Add index for better query performance
expenseSchema.index({ user: 1, date: -1 });

// Pre-save middleware to validate amount
expenseSchema.pre('save', function(next) {
  if (this.amount) {
    this.amount = parseFloat(this.amount.toFixed(2));
  }
  next();
});

const Expense = mongoose.model('Expense', expenseSchema);

module.exports = Expense;
