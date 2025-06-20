const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const router = express.Router();


router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body; // Remove role from destructuring
    
    console.log('Register attempt:', { name, email }); // Debug log
    
    // Validate required fields
    if (!name || !email || !password) {
      return res.status(400).json({ 
        message: 'Name, email, and password are required' 
      });
    }
    
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'email exist dejat' });
    }
    
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Create new user
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      role: 'client', // Default role for all new registrations
      isApproved: false
    });
    
    await newUser.save();
    console.log('User created successfully:', email); // Debug log
    
    res.status(201).json({ message: 'user saved successfully' });
    
  } catch (error) {
    console.error('Register error:', error); // Debug log
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Login route remains the same...
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    console.log('Login attempt:', email); // Debug log
    
    // Validate required fields
    if (!email || !password) {
      return res.status(400).json({ 
        message: 'Email and password are required' 
      });
    }
    
    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      console.log('User not found:', email); // Debug log
      return res.status(400).json({ message: 'user not found' });
    }
    
    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      console.log('Invalid password for:', email); // Debug log
      return res.status(400).json({ message: 'password incorrect' });
    }
    
    // Check if user is approved
    if (!user.isApproved) {
      console.log('User not approved:', email); // Debug log
      return res.status(400).json({ message: 'Account pending approval' });
    }
    
    // Generate JWT token
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: process.env.JWT_EXPIRES || '2d' }
    );
    
    res.status(200).json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
    
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
