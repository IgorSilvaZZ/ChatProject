const { MessageRepository } = require("../repositories/MessageRepository");

class CreateMessageService {
  async handle({ fkUserSender, fkUserReceiver, message, statusMessage }) {
    const messageSend = MessageRepository.create({
      fkUserSender,
      fkUserReceiver,
      message,
      statusMessage,
    });

    return messageSend;
  }
}

module.exports = { CreateMessageService };
