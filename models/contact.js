// models/contact.js
module.exports = (sequelize, DataTypes) => {
  const Contact = sequelize.define('Contact', {
    ownerId: { // Yeh User model se link hai
      type: DataTypes.INTEGER,
      references: {
        model: 'Users',
        key: 'id'
      }
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    phoneNumber: {
      type: DataTypes.STRING,
      allowNull: false
    }
  });
  
  return Contact;
};