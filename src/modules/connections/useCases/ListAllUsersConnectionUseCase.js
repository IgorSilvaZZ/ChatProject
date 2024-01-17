const {
  FindAllUsersConnectionService,
} = require("../services/FindAllUsersConnectionService");

const {
  CreateConnectionService,
} = require("../services/CreateConnectionService");

const { connectionsFormattedMapper } = require("../mappers/ConnectionsMapper");

module.exports = async (params, callback) => {
  if (params && params.new_user) {
    await new CreateConnectionService().handle({
      user_id: params.id,
      socket_id: null,
    });

    const connectionsUpdateList =
      await new FindAllUsersConnectionService().handle();

    const allConnectionsUsersUpdated = connectionsFormattedMapper(
      connectionsUpdateList
    );

    global.io.emit("update_list_users", allConnectionsUsersUpdated);
  } else {
    const connections = await new FindAllUsersConnectionService().handle();

    const allConnectionsUsers = connectionsFormattedMapper(connections);

    callback(allConnectionsUsers);
  }
};
