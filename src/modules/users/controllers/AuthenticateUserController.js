const {
  AutheticateUserService,
} = require("../services/AutheticateUserService");

class AuthenticateUserController {
  async execute(req, res) {
    const { email, password } = req.body;

    const { user, token } = await new AutheticateUserService().handle({
      email,
      password,
    });

    const username = user.name;

    global.io.emit("acess_chat", { username });

    return res.json({ user, token });
  }
}

module.exports = { AuthenticateUserController };
