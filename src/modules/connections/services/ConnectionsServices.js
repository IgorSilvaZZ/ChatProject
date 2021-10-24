const {
  ConnectionsRepostiory,
} = require("../repositories/ConnectionsRepostiory");

class ConnectionsServices {
  connectionRepository;

  constructor() {
    this.connectionRepository = new ConnectionsServices();
  }

  async createConnection({ user_id, socket_id }) {
    const connection = await this.connectionRepository.createConnection({
      user_id,
      socket_id,
    });

    return connection;
  }
}

module.exports = { ConnectionsServices };
