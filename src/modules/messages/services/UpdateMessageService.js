const {
  ConversationsRepository,
} = require("../../users/repositories/ConversationsRepository");

class UpdateMessageService {
  async handle(fkConversation, statusMessage) {
    const message = await ConversationsRepository.update(
      { statusMessage },
      { where: { fkConversation }, returning: true }
    );

    const messageUpdate = { ...message[1] };

    return messageUpdate;
  }
}

module.exports = { UpdateMessageService };
