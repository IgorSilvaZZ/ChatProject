const {
  FindAllUsersConnectionService,
} = require("../services/FindAllUsersConnectionService");

const {
  CreateConnectionService,
} = require("../services/CreateConnectionService");

const {
  ConnectionsSerialize,
} = require("../../../serializes/ConnectionsSerialize");

module.exports = async (params, callback) => {
  if (params && params.new_user) {
    await new CreateConnectionService().handle({
      user_id: params.id,
      socket_id: null,
    });

    const connectionsUpdateList =
      await new FindAllUsersConnectionService().handle();

    global.io.emit("update_list_users", connectionsUpdateList);
  } else {
    const connections = await new FindAllUsersConnectionService().handle();

    const allConnectionsUsers = new ConnectionsSerialize().handle(connections);

    callback(allConnectionsUsers);
  }
};
