const { UsersRepository } = require("../repositories/UsersRepository");
const { hash } = require("bcryptjs");

class CreateUserService {
  async handle({ name, email, password }) {
    if (!email) {
      throw new Error("Email is invalid!");
    }

    const userAlreadyExists = await UsersRepository.findOne({
      where: { email },
    });

    if (userAlreadyExists) {
      throw new Error("User already exists!");
    }

    const hashPassword = await hash(password, 8);

    const user = await UsersRepository.create({
      name,
      email,
      password: hashPassword,
    });

    return user;
  }
}

module.exports = { CreateUserService };
