const { ConnectionsRepositories } = require('../repositories/ConnectionsRepositories');

class UpdateUserConnectionService {

    async execute({ user_id, socket_id }) {

        const connection = await ConnectionsRepositories.update({ socket_id }, { where: { user_id }, returning: true });

        const connectionUpdated = {...connection[1]}

        return connectionUpdated;

    }

}

module.exports = { UpdateUserConnectionService }