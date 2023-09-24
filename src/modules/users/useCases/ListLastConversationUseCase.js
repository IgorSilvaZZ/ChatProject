const {
  ListLastMessageConversationMessageService,
} = require("../../messages/services/ListLastMessageConversationMessageService");

const {
  ListAllConversationUserService,
} = require("../services/ListAllConversationUserService");

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
