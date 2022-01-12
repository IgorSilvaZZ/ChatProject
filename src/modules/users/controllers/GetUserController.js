const { FindByUserService } = require("../services/FindByUserService");

class GetUserController {
  async execute(req, res) {
    const { id } = req.params;

    const user = await new FindByUserService().handle(id);

    return res.json(user);
  }
}

module.exports = { GetUserController };
