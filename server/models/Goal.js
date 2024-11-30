const mongoose = require('mongoose');

const goalSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: [true, 'נא להזין כותרת']
  },
  targetAmount: {
    type: Number,
    required: [true, 'נא להזין סכום יעד']
  },
  currentAmount: {
    type: Number,
    default: 0
  },
  category: {
    type: String,
    required: [true, 'נא לבחור קטגוריה'],
    enum: ['חיסכון', 'השקעות', 'קניות', 'חופשה']
  },
  deadline: {
    type: Date,
    required: [true, 'נא להזין תאריך יעד']
  },
  description: {
    type: String,
    default: ''
  },
  progress: {
    type: Number,
    default: 0,
    get: function() {
      return (this.currentAmount / this.targetAmount) * 100;
    }
  },
  transactions: [{
    amount: Number,
    type: {
      type: String,
      enum: ['הפקדה', 'משיכה']
    },
    date: {
      type: Date,
      default: Date.now
    },
    note: String
  }]
}, {
  timestamps: true,
  toJSON: { getters: true }
});

// וירטואלים לחישובים נוספים
goalSchema.virtual('remainingAmount').get(function() {
  return this.targetAmount - this.currentAmount;
});

goalSchema.virtual('daysRemaining').get(function() {
  return Math.ceil((this.deadline - new Date()) / (1000 * 60 * 60 * 24));
});

goalSchema.virtual('monthlyTargetSaving').get(function() {
  const monthsRemaining = this.daysRemaining / 30;
  return this.remainingAmount / monthsRemaining;
});

// מידלוור לעדכון אוטומטי של התקדמות
goalSchema.pre('save', function(next) {
  if (this.currentAmount > this.targetAmount) {
    this.currentAmount = this.targetAmount;
  }
  next();
});

const Goal = mongoose.model('Goal', goalSchema);

module.exports = Goal;
