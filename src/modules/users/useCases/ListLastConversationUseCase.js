const {
  ListAllConversationsUserService,
} = require("../services/ListAllConversationsUserService");

module.exports = async (params, callback) => {
  const { fkUserSender } = params;

  const conversations = await new ListAllConversationsUserService().handle(
    fkUserSender
  );

  callback(conversations);
};
