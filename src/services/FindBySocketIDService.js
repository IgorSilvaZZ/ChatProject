const { ConnectionsRepositories } = require('../repositories/ConnectionsRepositories');

class FindBySocketIDService {

    async execute(socket_id){

        const connection = await ConnectionsRepositories.findOne({ where: { socket_id } });

        return connection;

    }

}

module.exports = { FindBySocketIDService }