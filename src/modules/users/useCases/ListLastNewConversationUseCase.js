const { Op } = require("sequelize");

const {
  NewConversationRepository,
} = require("../repositories/NewConversationRepository");

const {
  NewMessagesRepository,
} = require("../../messages/repositories/NewMessagesRepository");

class ListAllConversationUserService {
  async handle(fkUser) {
    const conversations = await NewConversationRepository.findAll({
      where: {
        [Op.or]: [{ fkUserSender: fkUser }, { fkUserReceiver: fkUser }],
      },
      include: [
        { association: "user_sender" },
        { association: "user_receiver" },
      ],
    });

    return conversations;
  }
}

class ListLastMessageConversationMessageService {
  async handle(fkConversation) {
    const lastMessageConversation = await NewMessagesRepository.findOne({
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

module.exports = async ({ fkUser }, callback) => {
  const conversations = await new ListAllConversationUserService().handle(
    fkUser
  );

  const lastConversationsMessagesUser = conversations.map((conversation) =>
    new ListLastMessageConversationMessageService().handle(conversation.id)
  );

  const lastMessagesConversations = await Promise.all(
    lastConversationsMessagesUser
  );

  callback(lastMessagesConversations);
};
