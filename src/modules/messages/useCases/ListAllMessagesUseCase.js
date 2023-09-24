const {
  NewConversationRepository,
} = require("../../users/repositories/NewConversationRepository");

const {
  ListMessagesConversationsMessageService,
} = require("../services/ListMessagesConversationsMessageService");

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

  if (messages.length > 0) {
    await new UpdateMessageService().handle(fkConversation, true);
  }

  /* const lastConversations = await new ListAllConversationUserService().handle(
    fkUser
  ); */

  /* const messagesStatusPending = await new ListStatusMessagesService().handle(
    fkConversation,
    false
  ); */

  callback(messages);
};
