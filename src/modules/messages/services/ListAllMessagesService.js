const { MessageRepository } = require("../repositories/MessageRepository");

class ListAllMessagesService {
  async handle(params) {
    const { fkUserSender, fkUserReceiver } = params;
    const messages = await MessageRepository.findAll({
      include: [
        { association: "user_sender", where: { id: fkUserSender } },
        { association: "user_receiver", where: { id: fkUserReceiver } },
      ],
    });

    return messages;
  }
}

module.exports = { ListAllMessagesService };
