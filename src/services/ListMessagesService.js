const { MessagesRepositories } = require('../repositories/MessagesRepositories');

class ListMessagesService {

    async execute(){

        const messages = await MessagesRepositories.findAll();

        return messages

    }

}

module.exports = { ListMessagesService };