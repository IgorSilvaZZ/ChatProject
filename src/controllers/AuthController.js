const { AuthenticateUserService } = require('../services/AuthenticateUserService');

class AuthController {

    async handle(req, res){

        const { email, password } = req.body;

        const authenticateUserService = new AuthenticateUserService();

        const data = await authenticateUserService.execute({ email, password });

        const username =  data.user.name;

        global.io.emit('acess_chat', { username });

        return res.status(200).json(data);

    }

}

module.exports = { AuthController }