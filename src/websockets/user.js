const {
  ConnectionsServices,
} = require("../modules/connections/services/ConnectionsServices");

const accessChatUseCase = require("../modules/users/useCases/AccessChatUseCase");
const listAllUsersUseCase = require("../modules/users/useCases/ListAllUsersUseCase");
const listAllMessagesUseCase = require("../modules/messages/useCases/ListAllMessagesUseCase");
const sendMessageUseCase = require("../modules/users/useCases/SendMessageUseCase");
const logoutUserUseCase = require("../modules/users/useCases/LogoutUserUseCase");

module.exports = () => {
  global.io.on("connect", (socket) => {
    socket.on("access_chat", async (params, callback) => {
      await accessChatUseCase(socket, params, callback);
    });

    socket.on("logout_user", logoutUserUseCase);

    socket.on("list_all_users", listAllUsersUseCase);

    socket.on("user_send_message", sendMessageUseCase);

    socket.on("list_messages", listAllMessagesUseCase);
  });
};
