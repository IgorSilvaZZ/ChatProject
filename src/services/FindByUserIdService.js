const { ConnectionsRepositories } = require('../repositories/ConnectionsRepositories');

class FindByUserIdService {

    async execute({ user_id }){

        const connection = await ConnectionsRepositories.findOne({ where: { user_id } });

        return connection;

    }

}

export { FindByUserIdService }