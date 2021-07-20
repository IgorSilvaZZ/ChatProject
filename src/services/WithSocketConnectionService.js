const { ConnectionsRepositories } = require('../repositories/ConnectionsRepositories');
const { Op } = require('sequelize');
class WithSocketConnectionService {

    async execute() {

        const connections = await ConnectionsRepositories.findAll({
            where: { socket_id: { [ Op.ne ]:  null } },
            include: [
                { association: 'user' }
            ]
        })

        return connections;

    }

}


module.exports = { WithSocketConnectionService }