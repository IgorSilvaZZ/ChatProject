const { MessagesRepositories } = require('../repositories/MessagesRepositories');
const { Op } = require('sequelize');
class ListMessagesService {

    async execute(params){

        const { fkUserSender, fkUserReceiver } = params;

        const messages = await MessagesRepositories.findAll({ 
            where: { [ Op.and ]: [ { fkUserSender }, { fkUserReceiver } ] },
            include: [
                { association: 'user_sender' },
                { association: 'user_receiver' }
            ] 
        });

        return messages

    }

}

module.exports = { ListMessagesService };