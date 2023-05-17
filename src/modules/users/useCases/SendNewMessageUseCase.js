const { Op } = require("sequelize");

const {
  NewMessagesRepository,
} = require("../../messages/repositories/NewMessagesRepository");

const {
  NewConversationRepository,
} = require("../repositories/NewConversationRepository");

const { FindByEmailUser } = require("../services/FindByEmailUser");

class CreateMessageService {
  async handle({ message, fkConversation, statusMessage }) {
    const messageSend = NewMessagesRepository.create({
      message,
      fkConversation,
      statusMessage,
    });

    return messageSend;
  }
}

class CreateConversationUserService {
  async handle({ fkUserSender, fkUserReceiver }) {
    const conversation = await NewConversationRepository.create({
      fkUserSender,
      fkUserReceiver,
    });

    return conversation;
  }
}

class FindConversationUserService {
  async handle({ fkUserSender, fkUserReceiver }) {
    const conversation = await NewConversationRepository.findOne({
      where: {
        [Op.and]: [{ fkUserSender }, { fkUserReceiver }],
      },
    });

    return conversation;
  }
}

class ListAllConversationUserService {
  async handle(fkUser) {
    const conversations = await NewConversationRepository.findAll({
      where: {
        [Op.or]: [{ fkUserSender: fkUser }, { fkUserReceiver: fkUser }],
      },
      include: [{ association: "user_receiver" }],
    });

    return conversations;
  }
}

const verifyConversationUser = async ({ fkUserSender, fkUserReceiver }) => {
  const conversationForUserSender =
    await new FindConversationUserService().handle({
      fkUserSender,
      fkUserReceiver,
    });

  const conversationForUserReceiver =
    await new FindConversationUserService().handle({
      fkUserSender: fkUserReceiver,
      fkUserReceiver: fkUserSender,
    });

  return conversationForUserSender || conversationForUserReceiver;
};

module.exports = async (params, callback) => {
  const { text, emailUserSender, emailUserReceiver, usernameSender } = params;

  // Pegando informações dos usuarios atraves do connection a partir do email
  const userSenderConnection =
    await new FindByEmailUserConnectionService().handle(emailUserSender);

  const userReceiverConnection =
    await new FindByEmailUserConnectionService().handle(emailUserReceiver);

  const fkUserSender = userSenderConnection.user_id;

  let fkUserReceiver = null;
  let emitForUserReceiver = false;

  // Verificando se o usuario que vai receber esta offline
  if (!userReceiverConnection || userReceiverConnection.socket_id == null) {
    // Procurando o usuario que esta offline
    const { id } = await new FindByEmailUser().handle(emailUserReceiver);

    fkUserReceiver = id;
  } else {
    // Caso o usuario esteja online e capturando o o id do usuario conectado
    fkUserReceiver = userReceiverConnection.user_id;
    emitForUserReceiver = true;
  }
  // Verificar se contem uma conversa do usuario do logado (Enviando a mensagem)
  // Tanto para fkUserSender e fkUserReceiver
  // Garantindo que ele nao vai ter o id do usuario logado associado ao mesmo id do usuario que esta enviando a mensagem (fkUserReceiver)
  let conversationUser = verifyConversationUser({
    fkUserSender,
    fkUserReceiver,
  });

  if (!conversationUser) {
    // Assumindo que esta criando a conversa vai ser sempre o fkUserSender(Usuario que esta enviando)
    conversationUser = await new CreateConversationUserService().handle({
      fkUserSender,
      fkUserReceiver,
    });
  }

  await new CreateMessageService().handle({
    fkConversation: conversationUser.id,
    message: text,
    statusMessage: false,
  });

  // Criar o novo evento de receber mensagem
  if (emitForUserReceiver) {
    global.io
      .to(userReceiverConnection.socket_id)
      .emit("user_receiver_new_message", {
        text,
        usernameSender,
        idUser: fkUserSender,
      });
  }

  // Listando as conversas existente do usuario que esta enviando a mensagem
  const conversationsUser = await new ListAllConversationUserService().handle(
    fkUserSender
  );

  callback(conversationsUser);
};
