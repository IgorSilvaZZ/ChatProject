const { UsersRepository } = require("../repositories/UsersRepository");
const { hash, compare } = require("bcryptjs");
const { sign } = require("jsonwebtoken");
const { secret } = require("../../../config/auth.json");

class AutheticateUserService {
  async handle({ email, password }) {
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
}

module.exports = { AutheticateUserService };
