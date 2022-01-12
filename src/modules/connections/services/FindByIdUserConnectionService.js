const {
  ConnectionsRepostiory,
} = require("../repositories/ConnectionsRepostiory");

class FindByIdUserConnectionService {
  async handle(user_id) {
    const connection = await ConnectionsRepostiory.findOne({
      where: { user_id },
    });

    return connection;
  }
}

module.exports = { FindByIdUserConnectionService };
