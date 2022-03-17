const {
  ListAllConversationMessagesService,
} = require("../services/ListAllConversationMessagesService");

module.exports = async (params, callback) => {
  const messagesConversations =
    await new ListAllConversationMessagesService().handle(params.id);

  callback(messagesConversations);
};
