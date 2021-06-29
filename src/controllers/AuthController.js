const { AuthenticateUserService } = require('../services/AuthenticateUserService');

class AuthController {

    async handle(req, res){

        const { email, password } = req.body;

        const authenticateUserService = new AuthenticateUserService();

        const token = await authenticateUserService.execute({ email, password });

        return res.status(200).json(token);

    }

}

module.exports = { AuthController }