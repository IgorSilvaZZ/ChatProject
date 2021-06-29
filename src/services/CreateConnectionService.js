const { ConnectionsRepositories } = require('../repositories/ConnectionsRepositories');

class CreateConnectionService {

    async execute({ user_id, socket_id }){

        const connection = await ConnectionsRepositories.create({
            user_id,
            socket_id
        })

        return connection;

    }

}

module.exports = { CreateConnectionService }