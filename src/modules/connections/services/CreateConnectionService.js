const {
  ConnectionsRepostiory,
} = require("../repositories/ConnectionsRepostiory");

class CreateConnectionService {
  async handle({ user_id, socket_id }) {
    const connection = await ConnectionsRepostiory.create({
      user_id,
      socket_id,
    });

    return connection;
  }
}

module.exports = { CreateConnectionService };
