const { Message } = require("../../../entities/Message");

class MessagesRepository {
  async create({ fkUserSender, fkUserReceiver, message }) {
    const sendMessage = await Message.create({
      fkUserSender,
      fkUserReceiver,
      message,
    });

    return sendMessage;
  }

  async listByUsers({ fkUserSender, fkUserReceiver }) {
    const messages = await Message.findAll({
      include: [
        { association: "user_sender", where: { id: fkUserSender } },
        { association: "user_receiver", where: { id: fkUserReceiver } },
      ],
    });

    return messages;
  }
}

module.exports = { MessagesRepository };
