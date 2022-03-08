const {
  FindByEmailUserConnectionService,
} = require("../../connections/services/FindByEmailUserConnectionService");

const { FindByEmailUser } = require("../services/FindByEmailUser");

const {
  CreateMessageService,
} = require("../../messages/services/CreateMessageService");

const {
  ListAllConversationMessagesService,
} = require("../../messages/services/ListAllConversationMessagesService");

module.exports = async (params, callback) => {
  const {
    text,
    emailUserSender,
    emailUserReceiver,
    usernameSender,
    updateListConversations,
  } = params;

  // Da pessoa que está mandando mensagem não precisa fazer a validação do connection pois ele já está conectado na aplicação
  const userSenderConnection =
    await new FindByEmailUserConnectionService().handle(emailUserSender);

  const userReceiverConnection =
    await new FindByEmailUserConnectionService().handle(emailUserReceiver);

  const fkUserSender = userSenderConnection.user_id;

  if (!userReceiverConnection || userReceiverConnection.socket_id == null) {
    // Caso o usuario esteja offline
    const userReceiver = await new FindByEmailUser().handle(emailUserReceiver);

    const fkUserReceiver = userReceiver.id;

    await new CreateMessageService().handle({
      fkUserSender,
      fkUserReceiver,
      message: text,
      statusMessage: false,
    });
  } else {
    // Caso o usuario esteja online
    const fkUserReceiver = userReceiverConnection.user_id;

    await new CreateMessageService().handle({
      fkUserSender,
      fkUserReceiver,
      message: text,
      statusMessage: false,
    });

    global.io
      .to(userReceiverConnection.socket_id)
      .emit("user_receiver_message", {
        text,
        usernameSender,
        idUser: fkUserSender,
      });
  }

  if (updateListConversations) {
    const allMessagesConversations =
      await new ListAllConversationMessagesService().handle(fkUserSender);

    callback(allMessagesConversations);
  }
};
