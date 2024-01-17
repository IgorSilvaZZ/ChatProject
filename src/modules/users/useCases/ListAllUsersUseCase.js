const { FindAllUsersService } = require("../services/FindAllUsersService");

const { usersFormattedMapper } = require("../mappers/UsersMapper");

module.exports = async (params) => {
  const users = await new FindAllUsersService().handle();

  const allUsers = usersFormattedMapper(users);

  global.io.emit("update_all_users", allUsers);
};
