const Sequelize = require('sequelize');
const config = require('../config/config');

const { User } = require('../entities/User');
const { Connection } = require('../entities/Connection');
const { Message } = require('../entities/Message');

const connection = new Sequelize(config);

User.init(connection);
Connection.init(connection);
Message.init(connection);

Connection.associate(connection.models);
Message.associate(connection.models);

module.exports = connection;