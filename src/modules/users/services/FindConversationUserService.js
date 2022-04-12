const { Op } = require("sequelize");

const {
  ConversationsRepository,
} = require("../repositories/ConversationsRepository");

class FindConversationUserService {
  async handle({ fkUserSender, fkUserReceiver }) {
    const conversation = await ConversationsRepository.findOne({
      where: {
        [Op.and]: [{ fkUserSender }, { fkUserReceiver }],
      },
    });

    return conversation;
  }
}

module.exports = { FindConversationUserService };
