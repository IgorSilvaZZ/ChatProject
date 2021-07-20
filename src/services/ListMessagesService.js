const { MessagesRepositories } = require('../repositories/MessagesRepositories');
class ListMessagesService {

    async execute(fkChanel){

        const messages = await MessagesRepositories.findAll({ 
            where: { fkChanel },
            include: [
                { association: 'user_sender' },
                { association: 'user_receiver' }
            ] 
        });

        return messages

    }

}

module.exports = { ListMessagesService };