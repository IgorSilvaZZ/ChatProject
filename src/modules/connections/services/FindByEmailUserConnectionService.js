const {
  ConnectionsRepostiory,
} = require("../repositories/ConnectionsRepostiory");

class FindByEmailUserConnectionService {
  async handle(email) {
    const connection = await ConnectionsRepostiory.findOne({
      include: [{ association: "user", where: { email } }],
    });

    return connection;
  }
}

module.exports = { FindByEmailUserConnectionService };
