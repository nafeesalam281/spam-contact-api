// routes/search.js
const router = require('express').Router();
// Import User, Contact, Spam, sequelize AND Sequelize
const { User, Contact, Spam, sequelize, Sequelize } = require('../models'); 
// Get Op directly from the Sequelize object
const { Op } = Sequelize; 
const authMiddleware = require('../middleware/authMiddleware');

// GET /api/search/name/:name
router.get('/name/:name', authMiddleware, async (req, res) => {
  const queryName = req.params.name;
  try {
    // This code block was correct
    const usersStart = await User.findAll({ where: { name: { [Op.startsWith]: queryName } }, attributes: ['name', 'phoneNumber'] });
    const contactsStart = await Contact.findAll({ where: { name: { [Op.startsWith]: queryName } }, attributes: ['name', 'phoneNumber'] });
    const usersContain = await User.findAll({ where: { name: { [Op.like]: `%${queryName}%`, [Op.notStartsWith]: queryName } }, attributes: ['name', 'phoneNumber'] });
    const contactsContain = await Contact.findAll({ where: { name: { [Op.like]: `%${queryName}%`, [Op.notStartsWith]: queryName } }, attributes: ['name', 'phoneNumber'] });
    
    const startsWithResults = [...usersStart, ...contactsStart];
    const containsResults = [...usersContain, ...contactsContain];

    const allPhoneNumbers = [...new Set([...startsWithResults, ...containsResults].map(r => r.phoneNumber))];
    const spamRecords = await Spam.findAll({ where: { phoneNumber: { [Op.in]: allPhoneNumbers } } });
    const spamMap = spamRecords.reduce((map, record) => (map[record.phoneNumber] = record.markedByCount, map), {});

    const formatResults = (results) => results.map(p => ({
      name: p.name,
      phoneNumber: p.phoneNumber,
      spamLikelihood: spamMap[p.phoneNumber] || 0
    })).filter((p, i, self) => i === self.findIndex(t => t.phoneNumber === p.phoneNumber && t.name === p.name));

    res.status(200).json([...formatResults(startsWithResults), ...formatResults(containsResults)]);
  } catch (error) {
    res.status(500).json({ error: 'Something went wrong.', details: error.message });
  }
});

// GET /api/search/phone/:number
router.get('/phone/:number', authMiddleware, async (req, res) => {
  const queryNumber = req.params.number;
  try {
    // This code block was correct
    const registeredUser = await User.findOne({ where: { phoneNumber: queryNumber } });
    const spam = await Spam.findOne({ where: { phoneNumber: queryNumber } });
    const spamLikelihood = spam ? spam.markedByCount : 0;

    if (registeredUser) {
      return res.status(200).json([{ name: registeredUser.name, phoneNumber: registeredUser.phoneNumber, email: registeredUser.email, spamLikelihood }]);
    }
    
    const contacts = await Contact.findAll({ where: { phoneNumber: queryNumber }, attributes: ['name', 'phoneNumber'] });
    if (contacts.length === 0) return res.status(404).json({ message: 'No results found.' });

    res.status(200).json(contacts.map(c => ({ name: c.name, phoneNumber: c.phoneNumber, spamLikelihood })));
  } catch (error) {
    res.status(500).json({ error: 'Something went wrong.', details: error.message });
  }
});

// GET /api/search/details/:number
router.get('/details/:number', authMiddleware, async (req, res) => {
  const queryNumber = req.params.number;
  const searcher = req.user; 
  try {
    // This code block was correct
    const spam = await Spam.findOne({ where: { phoneNumber: queryNumber } });
    const spamLikelihood = spam ? spam.markedByCount : 0;
    
    const targetPerson = await User.findOne({ where: { phoneNumber: queryNumber } });
    if (!targetPerson) {
      const contact = await Contact.findOne({ where: { phoneNumber: queryNumber }, attributes: ['name'] });
      return res.status(200).json({ name: contact ? contact.name : "Unknown", phoneNumber: queryNumber, spamLikelihood });
    }

    let personDetails = { name: targetPerson.name, phoneNumber: targetPerson.phoneNumber, spamLikelihood };

    const searcherInTargetContacts = await Contact.findOne({
      where: {
        ownerId: targetPerson.id,
        phoneNumber: searcher.phoneNumber
      }
    });

    if (searcherInTargetContacts) {
      personDetails.email = targetPerson.email;
    }

    res.status(200).json(personDetails);
  } catch (error) {
    res.status(500).json({ error: 'Something went wrong.', details: error.message });
  }
});

module.exports = router;