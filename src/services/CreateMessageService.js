const { MessagesRepositories } = require('../repositories/MessagesRepositories');

class CreateMessageService {

    async execute({ fkUserSender, fkUserReceiver, fkChanel, message }){

        const sendMessage = await MessagesRepositories.create({
            fkUserSender, 
            fkUserReceiver,
            fkChanel,
            message
        })

        return sendMessage;

    }

}

module.exports = { CreateMessageService }