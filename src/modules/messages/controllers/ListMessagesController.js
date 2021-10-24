const { MessagesServices } = require("../services/MessagesServices");

class ListMessagesController {
  async handle(req, res) {
    const { fkUserSender, fkUserReceiver } = req.body;

    const service = new MessagesServices();

    const messages = await service.findAll({ fkUserSender, fkUserReceiver });

    return res.json(messages);
  }
}

module.exports = { ListMessagesController };
