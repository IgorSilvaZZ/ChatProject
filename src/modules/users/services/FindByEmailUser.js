const { UsersRepository } = require("../repositories/UsersRepository");

class FindByEmailUser {
  async handle(email) {
    const user = await UsersRepository.findOne({ where: { email } });

    return user;
  }
}

module.exports = { FindByEmailUser };
