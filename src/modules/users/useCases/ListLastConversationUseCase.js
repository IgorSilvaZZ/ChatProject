const {
  ListStatusMessagesService,
} = require("../../messages/services/ListStatusMessagesService");
const {
  ListAllConversationsUserService,
} = require("../services/ListAllConversationsUserService");

module.exports = async (params, callback) => {
  const { fkUserSender } = params;

  const conversations = await new ListAllConversationsUserService().handle(
    fkUserSender
  );

  const messagesStatusPending = await new ListStatusMessagesService().handle({
    statusMessage: false,
    fkUserReceiver: fkUserSender,
  });

  callback(conversations, messagesStatusPending);
};
