const {
  UpdateAvatarUserService,
} = require("../services/UpdateAvatarUserService");

class UpdateAvatarUserController {
  async execute(req, res) {
    const id = req.userId;

    const avatar_file = req.file.filename;

    const user = await new UpdateAvatarUserService().handle({
      id,
      avatar_file,
    });

    return res.status(200).json(user);
  }
}

module.exports = { UpdateAvatarUserController };
