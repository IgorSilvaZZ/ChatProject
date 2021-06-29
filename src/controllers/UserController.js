const { CreateUserService } = require('../services/CreateUserService');

class UserController { 

    login(req, res){

        const { username } = req.body;

        global.io.emit('acess_chat', { username });

        return res.status(200).json({ message: 'Login efetuado com sucesso!', username });
    }

    async create(req, res){

        const { name, email, password } = req.body;

        const createUserService = new CreateUserService();

        const user = await createUserService.execute({ name, email, password });

        return res.status(201).json(user);

    }

}

module.exports = { UserController }