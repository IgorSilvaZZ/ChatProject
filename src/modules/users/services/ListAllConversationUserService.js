const { Op } = require("sequelize");

const {
  ConversationsRepository,
} = require("../repositories/ConversationsRepository");

class ListAllConversationUserService {
  async handle(fkUser) {
    const conversations = await ConversationsRepository.findAll({
      where: {
        [Op.or]: [{ fkUserSender: fkUser }, { fkUserReceiver: fkUser }],
      },
      include: [
        { association: "user_sender" },
        { association: "user_receiver" },
      ],
    });

    return conversations;
  }
}

module.exports = { ListAllConversationUserService };
