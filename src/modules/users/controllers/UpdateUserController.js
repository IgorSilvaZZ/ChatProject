const { UpdateNameUserService } = require("../services/UpdateNameUserService");

class UpdateUserController {
  async execute(req, res) {
    const id = req.userId;

    const { name } = req.body;

    const user = await new UpdateNameUserService().handle({ id, name });

    return res.status(200).json(user);
  }
}

module.exports = { UpdateUserController };
