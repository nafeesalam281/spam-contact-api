// models/index.js
const { Sequelize } = require('sequelize');

// SQLite (sabse aasan setup)
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: './database.sqlite',
  logging: false // Console mein SQL logs band karne ke liye
});

const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;

// Models ko import karein
db.User = require('./user.js')(sequelize, Sequelize);
db.Contact = require('./contact.js')(sequelize, Sequelize);
db.Spam = require('./spam.js')(sequelize, Sequelize);

// --- Relationships Banayein ---

// Ek User ke paas kai Contacts ho sakte hain
db.User.hasMany(db.Contact, { as: 'contacts', foreignKey: 'ownerId' });
db.Contact.belongsTo(db.User, { as: 'owner', foreignKey: 'ownerId' });

module.exports = db;