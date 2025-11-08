// server.js
require('dotenv').config();
const express = require('express');
const { sequelize } = require('./models');

// Routes ko import karein
const authRoutes = require('./routes/auth');
const spamRoutes = require('./routes/spam');
const searchRoutes = require('./routes/search');

const app = express();
app.use(express.json()); // JSON bodies ko parse karein

// --- Routes ko register karein ---
app.use('/api/auth', authRoutes);
app.use('/api/spam', spamRoutes);
app.use('/api/search', searchRoutes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, async () => {
  console.log(`Server port ${PORT} par chal raha hai...`);
  try {
    await sequelize.sync({ force: false }); // force: true se database reset hota hai
    console.log('Database connected aur synced!');
  } catch (error) {
    console.error('Database connect nahi ho paya:', error);
  }
});