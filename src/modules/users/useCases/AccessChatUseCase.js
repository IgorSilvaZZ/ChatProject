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
  ListAllConversationUserService,
} = require("../services/ListAllConversationUserService");

const {
  ListLastMessageConversationMessageService,
} = require("../../messages/services/ListLastMessageConversationMessageService");

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

    // Parte nova de conversas e mensagens
    const conversations = await new ListAllConversationUserService().handle(
      user.id
    );

    const messagesStatusPending = conversations.map((conversation) =>
      new ListStatusMessagesService().handle({
        statusMessage: false,
        fkUserReceiver: user.id,
        fkConversation: conversation.id,
      })
    );

    const lastConversationsMessagesUser = conversations.map((conversation) =>
      new ListLastMessageConversationMessageService().handle(conversation.id)
    );

    const lastMessagesConversations = await Promise.all(
      lastConversationsMessagesUser
    );

    callback(messagesStatusPending, lastMessagesConversations);
  }
};
