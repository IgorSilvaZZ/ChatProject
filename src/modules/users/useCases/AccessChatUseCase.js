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

module.exports = async (socket, params) => {
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

    /* Listagem de ultimas conversas apenas para o usuario que está entrando, retornando apenas o nome, fazer com que retorne socket_id ou faça o que ConnectionsSerialize faz atualmente */
    /* const listConversations = await messagesServices.findListConversation(
          user.id
        ); */

    /* global.io.emit("list_all_users", allUsers); */
  }
};
