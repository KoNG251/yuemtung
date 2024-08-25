const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('yuemtung', 'root', '', {
    host: 'localhost',
    dialect: 'mysql',
  });
  
  module.exports = sequelize;