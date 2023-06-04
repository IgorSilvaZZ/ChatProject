const { Op } = require("sequelize");

const {
  NewConversationRepository,
} = require("../../users/repositories/NewConversationRepository");

const {
  NewMessagesRepository,
} = require("../repositories/NewMessagesRepository");

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

class ListStatusMessagesService {
  async handle(fkConversation, statusMessage) {
    const messagesStatus = await NewMessagesRepository.findAll({
      where: { statusMessage, fkConversation },
      include: [
        {
          association: "conversation",
          include: [
            { association: "user_sender" },
            { association: "user_receiver" },
          ],
        },
      ],
    });

    return messagesStatus;
  }
}

class ListMessagesConversationsMessageService {
  async handle(fkConversation) {
    const messages = await NewMessagesRepository.findAll({
      where: { fkConversation },
      include: [
        {
          association: "conversation",
          include: [
            { association: "user_sender" },
            { association: "user_receiver" },
          ],
        },
      ],
    });

    return messages;
  }
}

class UpdateMessageService {
  async handle(fkConversation, statusMessage) {
    const message = await NewConversationRepository.update(
      { statusMessage },
      { where: { fkConversation }, returning: true }
    );

    const messageUpdate = { ...message[1] };

    return messageUpdate;
  }
}

module.exports = async ({ fkUser, fkConversation }, callback) => {
  const messages = await new ListMessagesConversationsMessageService().handle(
    fkConversation
  );

  await new UpdateMessageService().handle(fkConversation, true);

  /* const lastConversations = await new ListAllConversationUserService().handle(
    fkUser
  ); */

  /* const messagesStatusPending = await new ListStatusMessagesService().handle(
    fkConversation,
    false
  ); */

  callback(messages);
};
