const { MessagesRepository } = require("../repositories/MessagesRepository");

class ListLastMessageConversationMessageService {
  async handle(fkConversation) {
    const lastMessageConversation = await MessagesRepository.findOne({
      where: { fkConversation },
      attributes: ["id", "fkConversation", "message", "sendMessage"],
      include: [
        {
          association: "conversation",
          attributes: ["fkUserReceiver", "fkUserSender"],
          include: [
            {
              association: "user_sender",
              attributes: ["id", "name", "avatar"],
            },
            {
              association: "user_receiver",
              attributes: ["id", "name", "avatar"],
            },
          ],
        },
      ],
      order: [["createdAt", "DESC"]],
      limit: 1,
    });

    return lastMessageConversation;
  }
}

module.exports = { ListLastMessageConversationMessageService };
