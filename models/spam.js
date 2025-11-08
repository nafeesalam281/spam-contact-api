// models/spam.js
module.exports = (sequelize, DataTypes) => {
  const Spam = sequelize.define('Spam', {
    phoneNumber: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    markedByCount: {
      type: DataTypes.INTEGER,
      defaultValue: 1
    }
  });
  
  return Spam;
};