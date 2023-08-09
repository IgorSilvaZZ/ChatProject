const accessChatUseCase = require("../modules/users/useCases/AccessChatUseCase");
const logoutUserUseCase = require("../modules/users/useCases/LogoutUserUseCase");
const listAllUsersConnectionUseCase = require("../modules/connections/useCases/ListAllUsersConnectionUseCase");

// Novos useCases para conversas e mensagens (Nova feature)
const sendNewMessageUseCase = require("../modules/users/useCases/SendNewMessageUseCase");
const listLastNewConversations = require("../modules/users/useCases/ListLastNewConversationUseCase");
const listNewMessagesUseCase = require("../modules/messages/useCases/ListAllNewMessagesUseCase");

module.exports = () => {
  global.io.on("connect", (socket) => {
    socket.on("access_chat", async (params, callback) => {
      await accessChatUseCase(socket, params, callback);
    });

    socket.on("logout_user", logoutUserUseCase);

    socket.on("list_all_users", listAllUsersConnectionUseCase);

    socket.on("update_users", (params) => {
      listAllUsersConnectionUseCase(params);
    });

    // Novos eventos para conversas e mensagens (Nova feature)
    socket.on("user_send_new_message", sendNewMessageUseCase);

    socket.on("list_user_new_conversations", listLastNewConversations);

    socket.on("list_new_messages", listNewMessagesUseCase);
  });
};
