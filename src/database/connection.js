const Sequelize = require("sequelize");
const config = require("../config/config");

const { User } = require("../entities/User");
const { Connection } = require("../entities/Connection");
const { Message } = require("../entities/Message");
const { Conversation } = require("../entities/Conversation");
const { Preferences } = require("../entities/Preferences");

const connection = new Sequelize(config);

User.init(connection);
Connection.init(connection);
Preferences.init(connection);
Message.init(connection);
Conversation.init(connection);

Connection.associate(connection.models);
Preferences.associate(connection.models);
Message.associate(connection.models);
Conversation.associate(connection.models);

module.exports = connection;
