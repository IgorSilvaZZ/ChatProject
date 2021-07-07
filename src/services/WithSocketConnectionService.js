const { ConnectionsRepositories } = require('../repositories/ConnectionsRepositories');

class WithSocketConnectionService {

    async execute() {

        const connections = ConnectionsRepositories.findAll({
            where: { socket_id: { $not: 'null' } }
        })

        return connections;

    }

}


module.exports = { WithSocketConnectionService }