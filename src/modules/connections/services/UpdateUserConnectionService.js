const {
  ConnectionsRepostiory,
} = require("../repositories/ConnectionsRepostiory");

class UpdateUserConnectionService {
  async handle({ user_id, socket_id }) {
    const connection = await ConnectionsRepostiory.update(
      { socket_id },
      { where: { user_id }, returning: true }
    );

    const connectionUpdated = { ...connection[1] };

    return connectionUpdated;
  }
}

module.exports = { UpdateUserConnectionService };
