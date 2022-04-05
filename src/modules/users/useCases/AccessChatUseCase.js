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
  ListStatusMessagesService,
} = require("../../messages/services/ListStatusMessagesService");

const {
  ListAllConversationsUserService,
} = require("../services/ListAllConversationsUserService");

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

    const lastConversations =
      await new ListAllConversationsUserService().handle(user.id);

    callback(messagesStatusPending, lastConversations);
  }
};
