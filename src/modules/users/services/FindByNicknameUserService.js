const { UsersRepository } = require("../repositories/UsersRepository");

class FindByNicknameUserService {
  async handle(nickname) {
    const user = await UsersRepository.findOne({ where: { nickname } });

    return user;
  }
}

module.exports = { FindByNicknameUserService };
