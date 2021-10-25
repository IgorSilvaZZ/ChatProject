const { UsersServices } = require("../services/UsersServices");

class CreateUserController {
  async handle(req, res) {
    const { name, email, password } = req.body;

    const service = new UsersServices();

    const user = await service.createUser({ name, email, password });

    return res.status(201).json(user);
  }
}

module.exports = { CreateUserController };
