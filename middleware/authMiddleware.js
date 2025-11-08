// middleware/authMiddleware.js
const jwt = require('jsonwebtoken');
const { User } = require('../models'); 

module.exports = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // "Bearer TOKEN"

  if (!token) {
    return res.status(401).json({ error: 'Access denied. No token provided.' });
  }

  try {
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    
    // User ki poori details (phone number sahit) fetch karein
    const user = await User.findByPk(decodedToken.id, {
      attributes: ['id', 'name', 'phoneNumber']
    });

    if (!user) {
      return res.status(401).json({ error: 'User not found.' });
    }

    req.user = user.toJSON(); // User details ko request mein add karein
    next(); 
  } catch (ex) {
    res.status(400).json({ error: 'Invalid token.' });
  }
};