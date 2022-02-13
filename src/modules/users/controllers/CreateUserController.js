const { UsersServices } = require("../services/UsersServices");
const { CreateUserService } = require("../services/CreateUserService");

class CreateUserController {
  async execute(req, res) {
    const { name, email, password } = req.body;

    const user = await new CreateUserService().handle({
      name,
      email,
      password,
    });

    return res.status(201).json(user);
  }
}

module.exports = { CreateUserController };
