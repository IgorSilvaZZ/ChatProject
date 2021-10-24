const { UsersServices } = require("../services/UsersServices");

class GetUserController {
  async handle(req, res) {
    const { id } = req.params;

    const service = new UsersServices();

    const user = await service.findByIdUser(id);

    return res.json(user);
  }
}

module.exports = { GetUserController };
