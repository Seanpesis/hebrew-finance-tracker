const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = mongoose.Schema({
  name: {
    type: String,
    required: [true, 'נא להזין שם']
  },
  email: {
    type: String,
    required: [true, 'נא להזין אימייל'],
    unique: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'נא להזין אימייל תקין']
  },
  password: {
    type: String,
    required: [true, 'נא להזין סיסמה'],
    minlength: [6, 'סיסמה חייבת להכיל לפחות 6 תווים']
  },
  income: {
    type: Number,
    default: 0,
    min: [0, 'הכנסה לא יכולה להיות שלילית']
  },
  preferences: {
    language: {
      type: String,
      default: 'he'
    },
    currency: {
      type: String,
      default: 'ILS'
    },
    theme: {
      type: String,
      default: 'light'
    }
  }
}, {
  timestamps: true
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    next();
    return;
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Match password method
userSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Remove password from JSON response
userSchema.methods.toJSON = function() {
  const obj = this.toObject();
  delete obj.password;
  return obj;
};

const User = mongoose.model('User', userSchema);

module.exports = User;
