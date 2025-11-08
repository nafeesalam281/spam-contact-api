// seed.js
const { faker } = require('@faker-js/faker');
const { sequelize, User, Contact, Spam } = require('./models');

const NUM_USERS = 50;
const MAX_CONTACTS_PER_USER = 20;
const NUM_SPAM_REPORTS = 100;

async function populateDatabase() {
  try {
    console.log('Database sync kiya ja raha hai (purana data delete hoga)...');
    await sequelize.sync({ force: true }); // Poora database reset karein

    console.log('Users banaye ja rahe hain...');
    const users = [];
    const allPhoneNumbers = new Set();

    for (let i = 0; i < NUM_USERS; i++) {
      let phoneNumber;
      do { phoneNumber = faker.phone.number('91########'); } 
      while (allPhoneNumbers.has(phoneNumber));
      allPhoneNumbers.add(phoneNumber);

      users.push({
        name: faker.person.fullName(),
        phoneNumber: phoneNumber,
        email: faker.internet.email(),
        password: 'password123' // Sabka password same hai
      });
    }
    const createdUsers = await User.bulkCreate(users, { validate: true, individualHooks: true });
    console.log(`${createdUsers.length} users ban gaye.`);
    
    console.log('Contacts banaye ja rahe hain...');
    const contacts = [];
    for (const user of createdUsers) {
      const numContacts = Math.floor(Math.random() * MAX_CONTACTS_PER_USER) + 1;
      for (let j = 0; j < numContacts; j++) {
        contacts.push({
          ownerId: user.id,
          name: faker.person.fullName(),
          phoneNumber: faker.phone.number('91########')
        });
      }
    }
    await Contact.bulkCreate(contacts);
    console.log(`${contacts.length} contacts ban gaye.`);

    console.log('Spam numbers mark kiye ja rahe hain...');
    const spamNumbers = new Map();
    const allPossibleNumbers = [...users.map(u => u.phoneNumber), ...contacts.map(c => c.phoneNumber)];

    for (let i = 0; i < NUM_SPAM_REPORTS; i++) {
      let phoneNumber = allPossibleNumbers[Math.floor(Math.random() * allPossibleNumbers.length)];
      spamNumbers.set(phoneNumber, (spamNumbers.get(phoneNumber) || 0) + 1);
    }
    const spamEntries = Array.from(spamNumbers.entries()).map(([phone, count]) => ({
      phoneNumber: phone,
      markedByCount: count
    }));
    await Spam.bulkCreate(spamEntries);
    console.log(`${spamEntries.length} spam entries ban gayi.`);

    console.log('--- Database Seeding Khatam! ---');

  } catch (error) {
    console.error('Seeding mein Error:', error);
  } finally {
    await sequelize.close();
  }
}

populateDatabase();