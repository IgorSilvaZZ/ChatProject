const { UsersServices } = require("../services/UsersServices");

class AuthenticateUserController {
  async handle(req, res) {
    const { email, password } = req.body;

    const service = new UsersServices();

    const { user, token } = await service.authenticateUser({ email, password });

    const username = user.name;

    global.io.emit("acess_chat", { username });

    return res.json({ user, token });
  }
}

module.exports = { AuthenticateUserController };
