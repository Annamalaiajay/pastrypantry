const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String },
  email: { type: String, required: true, unique: true },
  password: { type: String }, // Added Password back
  role: { type: String, default: 'user' },
  otp: { type: String },
  otpExpires: { type: Date },
  isVerified: { type: Boolean, default: false }, // Track if they passed OTP
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', userSchema);