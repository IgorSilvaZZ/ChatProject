const { compare } = require("bcryptjs");
const { sign } = require("jsonwebtoken");

const { UsersRepository } = require("../repositories/UsersRepository");

const {
  FindByPreferenceUserService,
} = require("../services/FindByPreferenceUserService");

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

    const user_id = String(user.id);

    let preferences = {};

    preferences = await new FindByPreferenceUserService().handle({
      user_id,
    });

    if (!preferences) {
      preferences = {
        notification_preference: false,
        sound_preference: false,
      };
    }

    const token = sign({ email: user.email }, secret, {
      subject: user_id,
      expiresIn: "1d",
    });

    return { user, preferences, token };
  }
}

module.exports = { AutheticateUserService };
