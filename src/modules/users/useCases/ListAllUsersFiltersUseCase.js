const { FindAllUsersService } = require("../services/FindAllUsersService");

const { UsersSerialize } = require("../../../serializes/UsersSerialize");

module.exports = async (params, callback) => {
  const { email } = params;

  const users = await new FindAllUsersService().handle();

  const allUsers = new UsersSerialize().handle(users);

  const allUsersFilters = allUsers.filter((user) => user.email != email);

  callback(allUsersFilters);
};
