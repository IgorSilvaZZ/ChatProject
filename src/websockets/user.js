const {
  ConnectionsServices,
} = require("../modules/connections/services/ConnectionsServices");

const accessChatUseCase = require("../modules/users/useCases/AccessChatUseCase");
const listAllUsersUseCase = require("../modules/users/useCases/ListAllUsersUseCase");
const listAllMessagesUseCase = require("../modules/messages/useCases/ListAllMessagesUseCase");
const sendMessageUseCase = require("../modules/users/useCases/SendMessageUseCase");

const { ConnectionsSerialize } = require("../serializes/ConnectionsSerialize");

// # Verificar ao logar se contem mensagens não lidar (Notificação)
// # Atualizar a parte de ultimas conversas (Ao mandar mensagem nova, Ao logar na aplicação)

module.exports = () => {
  global.io.on("connect", (socket) => {
    const connectionsServices = new ConnectionsServices();

    socket.on("access_chat", async (params, callback) => {
      await accessChatUseCase(socket, params, callback);
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

    socket.on("list_all_users", listAllUsersUseCase);

    socket.on("user_send_message", sendMessageUseCase);

    socket.on("list_messages", listAllMessagesUseCase);
  });
};
