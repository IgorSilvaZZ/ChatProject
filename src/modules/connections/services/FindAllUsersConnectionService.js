const {
  ConnectionsRepostiory,
} = require("../repositories/ConnectionsRepostiory");

class FindAllUsersConnectionService {
  async handle() {
    const connections = await ConnectionsRepostiory.findAll({
      include: [{ association: "user" }],
    });

    return connections;
  }
}

module.exports = { FindAllUsersConnectionService };
