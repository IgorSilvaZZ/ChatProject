const accessChatUseCase = require("../modules/users/useCases/AccessChatUseCase");
const listAllMessagesUseCase = require("../modules/messages/useCases/ListAllMessagesUseCase");
const sendMessageUseCase = require("../modules/users/useCases/SendMessageUseCase");
const logoutUserUseCase = require("../modules/users/useCases/LogoutUserUseCase");
const listAllUsersConnectionUseCase = require("../modules/connections/useCases/ListAllUsersConnectionUseCase");
const listLastConversationsUseCase = require("../modules/users/useCases/ListLastConversationUseCase");

module.exports = () => {
  global.io.on("connect", (socket) => {
    socket.on("access_chat", async (params, callback) => {
      await accessChatUseCase(socket, params, callback);
    });

    socket.on("logout_user", logoutUserUseCase);

    socket.on("list_all_users", listAllUsersConnectionUseCase);

    socket.on("user_send_message", sendMessageUseCase);

    socket.on("list_messages", listAllMessagesUseCase);

    socket.on("list_last_conversations", listLastConversationsUseCase);
  });
};
