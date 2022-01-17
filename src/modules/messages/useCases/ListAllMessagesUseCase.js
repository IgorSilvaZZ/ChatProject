const {
  ListAllMessagesService,
} = require("../services/ListAllMessagesService");
const { MessagesSerialize } = require("../../../serializes/MessagesSerialize");

module.exports = async (params, callback) => {
  const { fkUser, fkUserParticipant } = params;

  const paramsUserSender = {
    fkUserSender: fkUser,
    fkUserReceiver: fkUserParticipant,
  };

  const paramsUserReceiver = {
    fkUserSender: fkUserParticipant,
    fkUserReceiver: fkUser,
  };

  const messagesUserSender = await new ListAllMessagesService().handle(
    paramsUserSender
  );

  const messagesUserReceiver = await new ListAllMessagesService().handle(
    paramsUserReceiver
  );

  const messagesConcated = messagesUserSender.concat(messagesUserReceiver);

  const messages = new MessagesSerialize().handle(messagesConcated);

  callback(messages);
};
