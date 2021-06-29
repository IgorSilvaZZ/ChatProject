const { CreateUserService } = require('../services/CreateUserService');

class UserController { 
    
    async create(req, res){

        const { name, email, password } = req.body;

        const createUserService = new CreateUserService();

        const user = await createUserService.execute({ name, email, password });

        return res.status(201).json(user);

    }

}

module.exports = { UserController }