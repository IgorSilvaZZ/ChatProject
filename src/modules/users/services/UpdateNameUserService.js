const { UsersRepository } = require("../repositories/UsersRepository");

class UpdateNameUserService {
  async handle({ id, name }) {
    const user = await UsersRepository.findOne({
      where: { id },
    });

    user.name = name;

    await user.save();

    return user;
  }
}

module.exports = { UpdateNameUserService };
