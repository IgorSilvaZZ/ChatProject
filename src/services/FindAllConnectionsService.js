const { ConnectionsRepositories } = require('../repositories/ConnectionsRepositories');

class FindAllConnectionsService {

    async execute() {

        const connections = await ConnectionsRepositories.findAll();

        return connections;

    }

}

module.exports = { FindAllConnectionsService };