const {
  ConnectionsRepostiory,
} = require("../repositories/ConnectionsRepostiory");

const { Op } = require("sequelize");

class ConnectionsServices {
  async createConnection({ user_id, socket_id }) {
    const connection = await ConnectionsRepostiory.create({
      user_id,
      socket_id,
    });

    return connection;
  }

  async findByIdUserConnection(user_id) {
    const connection = await ConnectionsRepostiory.findOne({
      where: { user_id },
    });

    return connection;
  }

  async updateUserConnection({ user_id, socket_id }) {
    const connection = await ConnectionsRepostiory.update(
      { socket_id },
      { where: { user_id }, returning: true }
    );

    const connectionUpdated = { ...connection[1] };

    return connectionUpdated;
  }

  async findAllConnectionsUser() {
    const connections = await ConnectionsRepostiory.findAll({
      include: [{ association: "user" }],
    });

    return connections;
  }

  async findAllWithSocketConnection() {
    const connections = await ConnectionsRepostiory.findAll({
      where: { socket_id: { [Op.ne]: null } },
      include: [{ association: "user" }],
    });

    return connections;
  }

  async findBySockerIdConnection(socket_id) {
    const connection = await ConnectionsRepostiory.findOne({
      where: { socket_id },
    });

    return connection;
  }
}

module.exports = { ConnectionsServices };
