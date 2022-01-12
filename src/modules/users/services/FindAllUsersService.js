const { UsersRepository } = require("../repositories/UsersRepository");

class FindAllUsersService {
  async handle() {
    const users = await UsersRepository.findAll();

    return users;
  }
}

module.exports = { FindAllUsersService };
