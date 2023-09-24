const { MessagesRepository } = require("../repositories/MessagesRepository");

class ListMessagesConversationsMessageService {
  async handle(fkConversation) {
    const messages = await MessagesRepository.findAll({
      where: { fkConversation },
      include: [
        {
          association: "conversation",
          include: [
            { association: "user_sender" },
            { association: "user_receiver" },
          ],
        },
      ],
    });

    return messages;
  }
}

module.exports = { ListMessagesConversationsMessageService };
