module.exports = async (params, callback) => {
  const { text, emailUserSender, emailUserReceiver, usernameSender } = params;

  // Pegando informações dos usuarios atraves do connection a partir do email
  const userSenderConnection =
    await new FindByEmailUserConnectionService().handle(emailUserSender);

  const userReceiverConnection =
    await new FindByEmailUserConnectionService().handle(emailUserReceiver);

  const fkUserSender = userSenderConnection.user_id;

  // Verificando se o usuario que vai receber esta offline
  if (!userReceiverConnection) {
  }
};
