// routes/spam.js
const router = require('express').Router();
const { Spam } = require('../models');
const authMiddleware = require('../middleware/authMiddleware');

// POST /api/spam/mark
router.post('/mark', authMiddleware, async (req, res) => {
  const { phoneNumber } = req.body;
  if (!phoneNumber) {
    return res.status(400).json({ error: 'Phone number is required.' });
  }
  try {
    const [spamEntry, created] = await Spam.findOrCreate({
      where: { phoneNumber: phoneNumber },
      defaults: { markedByCount: 1 }
    });
    if (!created) {
      spamEntry.markedByCount += 1;
      await spamEntry.save();
    }
    res.status(200).json({ message: 'Number marked as spam.', spamCount: spamEntry.markedByCount });
  } catch (error) {
    res.status(500).json({ error: 'Something went wrong.', details: error.message });
  }
});

module.exports = router;