const Sequelize = require('sequelize');
const ConfigDB = require('./config/config.js');

const connection = new Sequelize (ConfigDB)

module.exports = connection