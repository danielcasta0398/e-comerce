const { DataTypes } = require('sequelize');
const { db } = require('../utils/database');

//Users
const Categories = db.define('categories', {
  id: {
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
    type: DataTypes.INTEGER,
  },

  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },

  status: {
    type: DataTypes.STRING,
    defaultValue: 'active',
  },

});

module.exports = { Categories };
