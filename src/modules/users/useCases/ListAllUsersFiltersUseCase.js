const { FindAllUsersService } = require("../services/FindAllUsersService");

const { usersFormattedMapper } = require("../mappers/UsersMapper");

module.exports = async (params, callback) => {
  const { email } = params;

  const users = await new FindAllUsersService().handle();

  const allUsers = usersFormattedMapper(users);

  const allUsersFilters = allUsers.filter((user) => user.email != email);

  callback(allUsersFilters);
};
