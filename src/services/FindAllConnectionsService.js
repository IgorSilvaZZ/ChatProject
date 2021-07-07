const { ConnectionsRepositories } = require('../repositories/ConnectionsRepositories');

class FindAllConnectionsService {

    async execute() {

        const connections = await ConnectionsRepositories.findAll({
            include: [
                { association: 'user' }
            ]
        });

        return connections;

    }

}

module.exports = { FindAllConnectionsService };