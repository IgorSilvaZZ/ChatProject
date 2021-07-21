const { MessagesRepositories } = require('../repositories/MessagesRepositories');

class CreateMessageService {

    async execute({ fkUserSender, fkUserReceiver, message }){

        const sendMessage = await MessagesRepositories.create({
            fkUserSender, 
            fkUserReceiver,
            message
        })

        return sendMessage;

    }

}

module.exports = { CreateMessageService }