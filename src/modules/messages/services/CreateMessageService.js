const { MessagesRepository } = require("../repositories/MessagesRepository");

class CreateMessageService {
  async handle({ message, fkConversation, statusMessage, fkUserSender }) {
    const messageSend = await MessagesRepository.create({
      message,
      fkConversation,
      statusMessage,
      sendMessage: fkUserSender,
    });

    return messageSend;
  }
}
module.exports = { CreateMessageService };
