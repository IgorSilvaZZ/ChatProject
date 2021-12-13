const { MessageRepository } = require("../repositories/MessageRepository");

class MessagesServices {
  async createMessage({ fkUserSender, fkUserReceiver, message }) {
    const messageSend = MessageRepository.create({
      fkUserSender,
      fkUserReceiver,
      message,
    });

    return messageSend;
  }

  async findAll(params) {
    const { fkUserSender, fkUserReceiver } = params;

    const messages = await MessageRepository.findAll({
      include: [
        { association: "user_sender", where: { id: fkUserSender } },
        { association: "user_receiver", where: { id: fkUserReceiver } },
      ],
    });

    return messages;
  }

  async findListConversation(fkUser) {
    const messages = await MessageRepository.listAllConversation(fkUser);

    return messages;
  }
}

module.exports = { MessagesServices };
