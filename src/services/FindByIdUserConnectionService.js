const { ConnectionsRepositories } = require('../repositories/ConnectionsRepositories');

class FindByIdUserConnectionService {

    async execute(user_id){

        const connection = await ConnectionsRepositories.findOne({ where: { user_id } });

        return connection;

    }   

}

module.exports = { FindByIdUserConnectionService };