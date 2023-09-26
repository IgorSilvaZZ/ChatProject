const { MessagesRepository } = require("../repositories/MessagesRepository");

class ListStatusMessagesService {
  async handle({ fkConversation, statusMessage }) {
    const messagesStatus = await MessagesRepository.findAll({
      where: { statusMessage, fkConversation },
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

    return messagesStatus;
  }
}

module.exports = { ListStatusMessagesService };
