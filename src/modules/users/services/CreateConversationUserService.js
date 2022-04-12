const {
  ConversationsRepository,
} = require("../repositories/ConversationsRepository");

class CreateConversationUserService {
  async handle({ fkUserSender, fkUserReceiver }) {
    const conversation = await ConversationsRepository.create({
      fkUserSender,
      fkUserReceiver,
    });

    return conversation;
  }
}

module.exports = { CreateConversationUserService };
