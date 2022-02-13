const { MessageRepository } = require("../repositories/MessageRepository");

class UpdateMessageService {
  async handle({ statusMessage, fkUserSender, fkUserReceiver }) {
    const messages = await MessageRepository.update(
      { statusMessage },
      { where: { fkUserSender, fkUserReceiver }, returning: true }
    );

    const messagesUpdated = { ...messages[1] };

    return messagesUpdated;
  }
}

module.exports = { UpdateMessageService };
