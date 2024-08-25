const {DataTypes} = require('sequelize');
const sequelize = require('../config/db');

const Balance = sequelize.define('balances', {
    balance: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    tableName: 'balances', // Ensure the table name is correct
    timestamps: false,
  });
  
  module.exports = { Balance };
  
