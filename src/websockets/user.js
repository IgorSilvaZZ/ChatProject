const {
  CreateConnectionService,
} = require("../services/CreateConnectionService");
const {
  FindAllConnectionsService,
} = require("../services/FindAllConnectionsService");
const { FinByEmailUserService } = require("../services/FinByEmailUserService");
const {
  FindByIdUserConnectionService,
} = require("../services/FindByIdUserConnectionService");
const {
  UpdateUserConnectionService,
} = require("../services/UpdateUserConnectionService");
const {
  WithSocketConnectionService,
} = require("../services/WithSocketConnectionService");
const { FindBySocketIDService } = require("../services/FindBySocketIDService");
const { CreateMessageService } = require("../services/CreateMessageService");
const { ListMessagesService } = require("../services/ListMessagesService");

const { ConnectionsSerialize } = require("../serializes/ConnectionsSerialize");
const { MessagesSerialize } = require("../serializes/MessagesSerialize");

module.exports = () => {
  global.io.on("connect", (socket) => {
    const createConnectionService = new CreateConnectionService();
    const findyEmailUserService = new FinByEmailUserService();
    const findyIdUserConnectionService = new FindByIdUserConnectionService();
    const updateUserConnectionService = new UpdateUserConnectionService();
    const findAllConnectionsService = new FindAllConnectionsService();
    const whithSocketConnectionService = new WithSocketConnectionService();
    const findBySocketIDService = new FindBySocketIDService();
    const createMessageService = new CreateMessageService();
    const listMessagesService = new ListMessagesService();

    const connectionsSerialize = new ConnectionsSerialize();
    const messagesSerialize = new MessagesSerialize();

    socket.on("acess_chat_parcipant", async (params) => {
      const { email } = params;

      const socket_id = socket.id;

      const user = await findyEmailUserService.execute({ email });

      if (user) {
        const connection = await findyIdUserConnectionService.execute(user.id);

        if (!connection) {
          await createConnectionService.execute({
            socket_id,
            user_id: user.id,
          });
        } else {
          await updateUserConnectionService.execute({
            user_id: user.id,
            socket_id,
          });
        }

        const connections = await findAllConnectionsService.execute();

        const allParticipants =
          connectionsSerialize.listAllConnetionsUser(connections);

        global.io.emit("participants_list_all", allParticipants);
      }
    });

    socket.on("logout_parcipant", async (user_id) => {
      await updateUserConnectionService.execute({ user_id, socket_id: null });

      const connections = await whithSocketConnectionService.execute();

      const newParticipants =
        connectionsSerialize.listAllConnetionsUser(connections);

      global.io.emit("participants_list_all", newParticipants);
    });

    socket.on("user_send_message", async (params) => {
      const { text, socket_user, socket_user_receiver, username_message } =
        params;

      const user_receiver = await findBySocketIDService.execute(
        socket_user_receiver
      );

      const user_sender = await findBySocketIDService.execute(socket_user);

      await createMessageService.execute({
        fkUserReceiver: user_receiver.id,
        fkUserSender: user_sender.id,
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

      const messagesUserSender = await listMessagesService.execute(
        paramsUserSender
      );

      const messagesUserReceiver = await listMessagesService.execute(
        paramsUserReceiver
      );

      const messagesObject = messagesUserSender.concat(messagesUserReceiver);

      const messages = messagesSerialize.listAllMessages(messagesObject);

      callback(messages);
    });
  });
};
