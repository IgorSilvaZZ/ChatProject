const { hash } = require("bcryptjs");

const { UsersRepository } = require("../repositories/UsersRepository");

class CreateUserService {
  async handle({ name, email, nickname, password }) {
    if (!email) {
      throw new Error("Email is invalid!");
    }

    if (!nickname) {
      throw new Error("Nickname is invalid!");
    }

    const userAlreadyExists = await UsersRepository.findOne({
      where: { email },
    });

    if (userAlreadyExists) {
      throw new Error("User already exists!");
    }

    const nicknameAlreadyExists = await UsersRepository.findOne({
      where: { nickname },
    });

    if (nicknameAlreadyExists) {
      throw new Error("User with nickname already exists!");
    }

    const hashPassword = await hash(password, 8);

    const user = await UsersRepository.create({
      name,
      email,
      nickname,
      password: hashPassword,
    });

    return user;
  }
}

module.exports = { CreateUserService };
