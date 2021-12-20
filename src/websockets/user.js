const { UsersServices } = require("../modules/users/services/UsersServices");

const {
  MessagesServices,
} = require("../modules/messages/services/MessagesServices");

const {
  ConnectionsServices,
} = require("../modules/connections/services/ConnectionsServices");

const { ConnectionsSerialize } = require("../serializes/ConnectionsSerialize");
const { MessagesSerialize } = require("../serializes/MessagesSerialize");

module.exports = () => {
  global.io.on("connect", (socket) => {
    const usersServices = new UsersServices();
    const messagesServices = new MessagesServices();
    const connectionsServices = new ConnectionsServices();

    socket.on("acess_chat_parcipant", async (params) => {
      const { email } = params;

      const socket_id = socket.id;

      const user = await usersServices.findByEmailUser(email);

      if (user) {
        const connection = await connectionsServices.findByIdUserConnection(
          user.id
        );

        if (!connection) {
          await connectionsServices.createConnection({
            socket_id,
            user_id: user.id,
          });
        } else {
          await connectionsServices.updateUserConnection({
            user_id: user.id,
            socket_id,
          });
        }

        const connections = await connectionsServices.findAllConnectionsUser();

        const allParticipants = new ConnectionsSerialize().handle(connections);

        /* Listagem de ultimas conversas, retornando apenas o nome, fazer com que retorne socket_id ou faça o que ConnectionsSerialize faz atualmente */
        /* const listConversations = await messagesServices.findListConversation(
          user.id
        ); */

        global.io.emit("participants_list_all", allParticipants);
      }
    });

    socket.on("logout_parcipant", async (user_id) => {
      await connectionsServices.updateUserConnection({
        user_id,
        socket_id: null,
      });

      const connections =
        await connectionsServices.findAllWithSocketConnection();

      const newParticipants = new ConnectionsSerialize().handle(connections);

      global.io.emit("participants_list_all", newParticipants);
    });

    socket.on("user_send_message", async (params) => {
      const { text, socket_user, socket_user_receiver, username_message } =
        params;

      const user_receiver = await connectionsServices.findBySockerIdConnection(
        socket_user_receiver
      );

      const user_sender = await connectionsServices.findBySockerIdConnection(
        socket_user
      );

      await messagesServices.createMessage({
        fkUserReceiver: user_receiver.user_id,
        fkUserSender: user_sender.user_id,
        message: text,
      });

      global.io.to(socket_user_receiver).emit("user_receiver_message", {
        text,
        username_message,
        idUserSender: socket_user,
      });
    });

    socket.on("list_messages", async (params, callback) => {
      const { fkUser, fkUserParticipant } = params;

      const paramsUserSender = {
        fkUserSender: fkUser,
        fkUserReceiver: fkUserParticipant,
      };

      const paramsUserReceiver = {
        fkUserSender: fkUserParticipant,
        fkUserReceiver: fkUser,
      };

      const messagesUserSender = await messagesServices.findAll(
        paramsUserSender
      );

      const messagesUserReceiver = await messagesServices.findAll(
        paramsUserReceiver
      );

      const messagesConcated = messagesUserSender.concat(messagesUserReceiver);

      const messages = new MessagesSerialize().handle(messagesConcated);

      callback(messages);
    });
  });
};
