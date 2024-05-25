const { UpdateNameUserService } = require("../services/UpdateNameUserService");
const {
  UpdateNicknameUserService,
} = require("../services/UpdateNicknameUserService");

// Classes para ser reutilizada apenas para metodo HTTP do tipo PATCH
class PatchUserController {
  async execute(req, res) {
    const id = req.userId;

    // Só pode ser atualizado uma propriedade por vez, por enquanto não vai ser possivel atualizar todos nesse controller

    if ("name" in req.body) {
      const user = await new UpdateNameUserService().handle({
        id,
        name: req.body.name,
      });

      return res.json(user);
    } else if ("nickname" in req.body) {
      const user = await new UpdateNicknameUserService().handle({
        id,
        nickname: req.body.nickname,
      });

      return res.json(user);
    }
  }
}

module.exports = { PatchUserController };
