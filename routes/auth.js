// routes/auth.js
const router = require('express').Router();
const jwt = require('jsonwebtoken');
const { User } = require('../models');

// POST /api/auth/register
router.post('/register', async (req, res) => {
  const { name, phoneNumber, password, email } = req.body;
  if (!name || !phoneNumber || !password) {
    return res.status(400).json({ error: 'Name, phoneNumber, and password are required.' });
  }
  try {
    const existingUser = await User.findOne({ where: { phoneNumber } });
    if (existingUser) {
      return res.status(400).json({ error: 'Phone number already registered.' });
    }
    const newUser = await User.create({ name, phoneNumber, password, email: email || null });
    res.status(201).json({ userId: newUser.id, name: newUser.name });
  } catch (error) {
    res.status(500).json({ error: 'Something went wrong.', details: error.message });
  }
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
  const { phoneNumber, password } = req.body;
  if (!phoneNumber || !password) {
    return res.status(400).json({ error: 'PhoneNumber and password are required.' });
  }
  try {
    const user = await User.findOne({ where: { phoneNumber } });
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials.' });
    }
    const isMatch = await user.validPassword(password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid credentials.' });
    }
    const token = jwt.sign(
      { id: user.id, name: user.name },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );
    res.status(200).json({ message: 'Login successful!', token: token });
  } catch (error) {
    res.status(500).json({ error: 'Something went wrong.', details: error.message });
  }
});

module.exports = router;