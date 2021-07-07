const { CreateUserService } = require('../services/CreateUserService');
const { FindAllConnectionsService } = require('../services/FindAllConnectionsService');

class UserController { 
    
    async create(req, res){

        const { name, email, password } = req.body;

        const createUserService = new CreateUserService();

        const user = await createUserService.execute({ name, email, password });

        return res.status(201).json(user);

    }

    //Metodo para teste
    async connectionsUsers(req, res) {

        const findAllConnectionsService = new FindAllConnectionsService();

        const connection = await findAllConnectionsService.execute();

        return res.status(200).json(connection);

    }

}

module.exports = { UserController }