const { Connection } = require("../../../entities/Connection");
const { Op } = require("sequelize");

class ConnectionsRepostiory {
  async create({ user_id, socket_id }) {
    const connection = await Connection.create({
      user_id,
      socket_id,
    });

    return connection;
  }

  async findByIdUser(user_id) {
    const connection = await Connection.findOne({
      where: { user_id },
    });

    return connection;
  }

  async updateUser({ user_id, socket_id }) {
    const connection = await Connection.update(
      { socket_id },
      { where: { user_id }, returning: true }
    );

    return connection;
  }

  async findAllUser() {
    const connections = await Connection.findAll({
      include: [{ association: "user" }],
    });

    return connections;
  }

  async withSocket() {
    const connections = await Connection.findAll({
      where: { socket_id: { [Op.ne]: null } },
      include: [{ association: "user" }],
    });

    return connections;
  }

  async findBySocketId(socket_id) {
    const connection = await Connection.findOne({ where: { socket_id } });

    return connection;
  }
}

module.exports = { ConnectionsRepostiory };
