const Sequelize = require('sequelize');
const config = require('../config/config');

const { User } = require('../entities/User');
const { Connection } = require('../entities/Connection');

const connection = new Sequelize(config);

User.init(connection);
Connection.init(connection);

Connection.associate(connection.models);

module.exports = connection;