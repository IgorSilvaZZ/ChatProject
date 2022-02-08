const { MessageRepository } = require("../repositories/MessageRepository");

class ListStatusMessagesService {
  async handle({ statusMessage, fkUserReceiver }) {
    const messages = await MessageRepository.findAll({
      where: { statusMessage },
      include: [
        { association: "user_receiver", where: { id: fkUserReceiver } },
        { association: "user_sender" },
      ],
    });

    return messages;
  }
}

module.exports = { ListStatusMessagesService };
