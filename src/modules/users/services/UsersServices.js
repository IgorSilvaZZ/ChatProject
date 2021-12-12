const { UsersRepository } = require("../repositories/UsersRepository");
const { hash, compare } = require("bcryptjs");
const { sign } = require("jsonwebtoken");
const { secret } = require("../../../config/auth.json");

class UsersServices {
  async createUser({ name, email, password }) {
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

  async findByIdUser(id) {
    const user = await UsersRepository.findOne({
      where: { id },
      attributes: ["name", "email"],
    });

    if (!user) {
      throw new Error("User not found!");
    }

    return user;
  }

  async authenticateUser({ email, password }) {
    const user = await UsersRepository.findOne({ where: { email } });

    if (!user) {
      throw new Error("User not Found!");
    }

    if (!(await compare(password, user.password))) {
      throw new Error("Email/Password incorrect");
    }

    const token = sign({ email: user.email }, secret, {
      subject: String(user.id),
      expiresIn: "1d",
    });

    return { user, token };
  }

  async findByEmailUser(email) {
    const user = await UsersRepository.findOne({ where: { email } });

    return user;
  }
}

module.exports = { UsersServices };