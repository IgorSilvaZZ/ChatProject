const Sequelize = require('sequelize');
const config = require('../config/config');

const { User } = require('../entities/User');

const connection = new Sequelize(config);

User.init(connection);

module.exports = connection;