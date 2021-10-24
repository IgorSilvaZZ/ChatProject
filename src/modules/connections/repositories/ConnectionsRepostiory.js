const { Connection } = require("../../../entities/Connection");

class ConnectionsRepostiory {
  async create({ user_id, socket_id }) {
    const connection = await Connection.create({
      user_id,
      socket_id,
    });

    return connection;
  }
}

module.exports = { ConnectionsRepostiory };
