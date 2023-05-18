const { Op } = require("sequelize");

const {
  NewConversationRepository,
} = require("../repositories/NewConversationRepository");

class ListAllConversationUserService {
  async handle(fkUser) {
    const conversations = await NewConversationRepository.findAll({
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

module.exports = async ({ fkUser }, callback) => {
  const conversations = await new ListAllConversationUserService().handle(
    fkUser
  );

  callback(conversations);
};
