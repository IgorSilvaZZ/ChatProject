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

const verifyConversationUsers = async ({ fkUserSender, fkUserReceiver }) => {
  const conversation = await new FindConversationUserService().handle({
    fkUserSender,
    fkUserReceiver,
  });

  return conversation;
};

const createConversationUser = async ({ fkUserSender, fkUserReceiver }) => {
  const conversation = await new CreateConversationUserService().handle({
    fkUserSender,
    fkUserReceiver,
  });

  return conversation;
};

module.exports = async (params, callback) => {
  const { text, emailUserSender, emailUserReceiver, usernameSender } = params;

  // Pegando informações dos usuarios atraves do connection a partir do email
  const userSenderConnection =
    await new FindByEmailUserConnectionService().handle(emailUserSender);

  const userReceiverConnection =
    await new FindByEmailUserConnectionService().handle(emailUserReceiver);

  const fkUserSender = userSenderConnection.user_id;

  // Verificando se o usuario que vai receber esta offline
  if (!userReceiverConnection || userReceiverConnection.socket_id == null) {
    // Procurando o usuario que esta offline
    const { id: fkUserReceiver } = await new FindByEmailUser().handle(
      emailUserReceiver
    );

    // Verificando se existente para o usuario logado
    const conversationUser = await verifyConversationUsers({
      fkUserSender,
      fkUserReceiver,
    });

    if (!conversationUser) {
      await createConversationUser({
        fkUserSender,
        fkUserReceiver,
      });
    }

    //Fazer veficação de conversa existente para o usuario não logado, ou seja o outro usuario que estou mandando mensagem
    const conversationOtherUser = await verifyConversationUsers({
      fkUserSender: fkUserReceiver,
      fkUserReceiver: fkUserSender,
    });

    // Criando conversa que nao existe para o usuario logado
    if (!conversationOtherUser) {
      await createConversationUser({
        fkUserSender: fkUserReceiver,
        fkUserReceiver: fkUserSender,
      });
    }
  }
};
