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
  }

  const connections = await new FindAllUsersConnectionService().handle();

  const allConnectionsUsers = new ConnectionsSerialize().handle(connections);

  if (params && params.new_user) {
    global.io.emit("update_all_users", allConnectionsUsers);
  } else {
    callback(allConnectionsUsers);
  }
};
