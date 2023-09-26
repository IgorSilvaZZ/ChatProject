const {
  ListMessagesConversationsMessageService,
} = require("../services/ListMessagesConversationsMessageService");

const { UpdateMessageService } = require("../services/UpdateMessageService");

module.exports = async ({ fkUser, fkConversation }, callback) => {
  const messages = await new ListMessagesConversationsMessageService().handle(
    fkConversation
  );

  if (messages.length > 0) {
    await new UpdateMessageService().handle(fkConversation, true);
  }

  /* const lastConversations = await new ListAllConversationUserService().handle(
    fkUser
  ); */

  /* const messagesStatusPending = await new ListStatusMessagesService().handle(
    fkConversation,
    false
  ); */

  callback(messages);
};
