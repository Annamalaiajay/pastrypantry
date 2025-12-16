const express = require('express');
const bcrypt = require('bcryptjs'); 
const jwt = require('jsonwebtoken');
const User = require('./models/User');
const { sendOTP } = require('./emailService');
const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET || "super_secret_brownie_key";

// 1. LOGIN
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid Password" });

    const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, { expiresIn: '1d' });
    
    // UPDATED: Sending createdAt date
    res.json({ 
      token, 
      user: { 
        name: user.name, 
        role: user.role, 
        email: user.email, 
        createdAt: user.createdAt 
      } 
    });

  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
});

// 2. REGISTER STEP 1
router.post('/register-init', async (req, res) => {
  const { email } = req.body;
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser && existingUser.isVerified) {
      return res.status(400).json({ message: "User already exists! Please Login." });
    }

    const otp = Math.floor(1000 + Math.random() * 9000).toString();
    
    if (existingUser) {
        existingUser.otp = otp;
        await existingUser.save();
    } else {
        const tempUser = new User({ email, otp, password: "temp", isVerified: false });
        await tempUser.save();
    }
    
    await sendOTP(email, otp);
    res.json({ message: "OTP sent to email!" });

  } catch (error) {
    res.status(500).json({ message: "Error sending OTP" });
  }
});

// 3. REGISTER STEP 2
router.post('/register-complete', async (req, res) => {
  const { email, otp, name, password } = req.body;
  try {
    const user = await User.findOne({ email });
    
    if (!user || user.otp !== otp) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    user.name = name;
    user.password = hashedPassword;
    user.otp = null; 
    user.isVerified = true;
    
    if(email === "dsharmiaishu17@gmail.com") {
        user.role = 'admin';
    } else {
        user.role = 'user';
    }

    await user.save();

    const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, { expiresIn: '1d' });
    
    // UPDATED: Sending createdAt date
    res.json({ 
      token, 
      user: { 
        name: user.name, 
        role: user.role, 
        email: user.email, 
        createdAt: user.createdAt 
      } 
    });

  } catch (error) {
    res.status(500).json({ message: "Registration Failed" });
  }
});

module.exports = router;