const { Op } = require("sequelize");

const { FindByEmailUser } = require("../services/FindByEmailUser");

const {
  FindByIdUserConnectionService,
} = require("../../connections/services/FindByIdUserConnectionService");

const {
  CreateConnectionService,
} = require("../../connections/services/CreateConnectionService");

const {
  UpdateUserConnectionService,
} = require("../../connections/services/UpdateUserConnectionService");

const {
  ListStatusMessagesService,
} = require("../../messages/services/ListStatusMessagesService");

const {
  ListAllConversationsUserService,
} = require("../services/ListAllConversationsUserService");

// Parte nova de conversas e ultimas mensagens
const {
  NewMessagesRepository,
} = require("../../messages/repositories/NewMessagesRepository");

const {
  NewConversationRepository,
} = require("../repositories/NewConversationRepository");

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
      attributes: ["id", "fkConversation", "message"],
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

module.exports = async (socket, params, callback) => {
  const { email } = params;

  const socket_id = socket.id;

  const user = await new FindByEmailUser().handle(email);

  if (user) {
    const connection = await new FindByIdUserConnectionService().handle(
      user.id
    );

    if (!connection) {
      await new CreateConnectionService().handle({
        socket_id,
        user_id: user.id,
      });
    } else {
      await new UpdateUserConnectionService().handle({
        user_id: user.id,
        socket_id,
      });
    }

    const messagesStatusPending = await new ListStatusMessagesService().handle({
      statusMessage: false,
      fkUserReceiver: user.id,
    });

    const lastConversations =
      await new ListAllConversationsUserService().handle(user.id);

    // Parte nova de conversas e mensagens
    const conversations = await new ListAllConversationUserService().handle(
      user.id
    );

    const lastConversationsMessagesUser = conversations.map((conversation) =>
      new ListLastMessageConversationMessageService().handle(conversation.id)
    );

    const lastMessagesConversations = await Promise.all(
      lastConversationsMessagesUser
    );

    callback(
      messagesStatusPending,
      lastConversations,
      lastMessagesConversations
    );
  }
};
