const { UsersRepository } = require("../repositories/UsersRepository");

class UpdateNicknameUserService {
  async handle({ id, nickname }) {
    const nicknameAlreadyExists = await UsersRepository.findOne({
      where: { nickname },
    });

    if (nicknameAlreadyExists) {
      throw new Error("Username already exists!");
    }

    const user = await UsersRepository.findOne({
      where: { id },
    });

    user.nickname = nickname;

    await user.save();

    return user;
  }
}

module.exports = { UpdateNicknameUserService };
