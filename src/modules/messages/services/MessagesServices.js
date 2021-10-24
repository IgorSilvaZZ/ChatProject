const { MessagesRepository } = require("../repositories/MessagesRepository");

class MessagesServices {
  messageRepository;

  constructor() {
    this.messageRepository = new MessagesRepository();
  }

  async findAll(params) {
    const { fkUserSender, fkUserReceiver } = params;

    const messages = await this.messageRepository.listByUsers({
      fkUserReceiver,
      fkUserSender,
    });

    return messages;
  }
}

module.exports = { MessagesServices };
