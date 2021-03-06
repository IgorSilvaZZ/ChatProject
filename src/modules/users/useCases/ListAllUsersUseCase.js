const { FindAllUsersService } = require("../services/FindAllUsersService");

const { UsersSerialize } = require("../../../serializes/UsersSerialize");

module.exports = async (params) => {
  const users = await new FindAllUsersService().handle();

  const allUsers = new UsersSerialize().handle(users);

  global.io.emit("update_all_users", allUsers);
};
