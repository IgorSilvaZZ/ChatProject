const {
  ConnectionsRepostiory,
} = require("../repositories/ConnectionsRepostiory");

class ConnectionsServices {
  connectionRepository;

  constructor() {
    this.connectionRepository = new ConnectionsRepostiory();
  }

  async createConnection({ user_id, socket_id }) {
    const connection = await this.connectionRepository.create({
      user_id,
      socket_id,
    });

    return connection;
  }

  async findByIdUserConnection(user_id) {
    const connection = await this.connectionRepository.findByIdUser(user_id);

    return connection;
  }

  async updateUserConnection({ user_id, socket_id }) {
    const connection = await this.connectionRepository.updateUser({
      user_id,
      socket_id,
    });

    const connectionUpdated = { ...connection[1] };

    return connectionUpdated;
  }

  async findAllConnectionsUser() {
    const connections = await this.connectionRepository.findAllUser();

    return connections;
  }

  async findAllWithSocketConnection() {
    const connections = await this.connectionRepository.withSocket();

    return connections;
  }

  async findBySockerIdConnection(socket_id) {
    const connection = await this.connectionRepository.findBySocketId(
      socket_id
    );

    return connection;
  }
}

module.exports = { ConnectionsServices };
