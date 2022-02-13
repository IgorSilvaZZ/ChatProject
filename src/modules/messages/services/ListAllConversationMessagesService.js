const { MessageRepository } = require("../repositories/MessageRepository");

class ListAllConversationMessagesService {
  async handle(fkUser) {
    const messages = await MessageRepository.listAllConversation(fkUser);

    return messages;
  }
}

module.exports = { ListAllConversationMessagesService };
