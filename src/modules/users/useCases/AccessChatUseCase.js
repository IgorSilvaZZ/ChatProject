const { FindByEmailUser } = require("../services/FindByEmailUser");

const {
  FindByIdUserConnectionService,
} = require("../../connections/services/FindByIdUserConnectionService");

const {
  CreateConnectionService,
} = require("../../connections/services/CreateConnectionService");

const {
  UpdateUserConnectionService,
} = require("../../connections/services/UpdateUserConnectionService");

const {
  ListAllConversationMessagesService,
} = require("../../messages/services/ListAllConversationMessagesService");

const {
  ListStatusMessagesService,
} = require("../../messages/services/ListStatusMessagesService");

module.exports = async (socket, params, callback) => {
  const { email } = params;

  const socket_id = socket.id;

  const user = await new FindByEmailUser().handle(email);

  if (user) {
    const connection = await new FindByIdUserConnectionService().handle(
      user.id
    );

    if (!connection) {
      await new CreateConnectionService().handle({
        socket_id,
        user_id: user.id,
      });
    } else {
      await new UpdateUserConnectionService().handle({
        user_id: user.id,
        socket_id,
      });
    }

    const messagesStatusPending = await new ListStatusMessagesService().handle({
      statusMessage: false,
      fkUserReceiver: user.id,
    });

    callback(messagesStatusPending);
  }
};
