const {
  ConversationsRepository,
} = require("../repositories/ConversationsRepository");

class ListAllConversationsUserService {
  async handle(fkUserSender) {
    const conversations = await ConversationsRepository.findAll({
      where: { fkUserSender },
      include: [{ association: "user_receiver" }],
    });

    return conversations;
  }
}

module.exports = { ListAllConversationsUserService };
