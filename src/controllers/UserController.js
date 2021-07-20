const { CreateUserService } = require('../services/CreateUserService');
const { FindAllConnectionsService } = require('../services/FindAllConnectionsService');
const { CreateMessageService } = require('../services/CreateMessageService');
const { ListMessagesService } = require('../services/ListMessagesService');
const { WithSocketConnectionService } = require('../services/WithSocketConnectionService')
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
        const withSocketConnectionService = new WithSocketConnectionService();

        const connection = await withSocketConnectionService.execute();

        return res.status(200).json(connection);

    }

    async sendMessage(req, res){

        const { fkUserSender, fkUserReceiver, message } = req.body;

        const createMessageService = new CreateMessageService();

        const sendMessage = await createMessageService.execute({ fkUserSender, fkUserReceiver, message });

        return res.status(200).json(sendMessage);

    }   

    async listMessages(req, res){

        const { fkUserSender, fkUserReceiver } = req.body;

        const listMessagesService = new ListMessagesService();

        const messages = await listMessagesService.execute({ fkUserSender, fkUserReceiver });

        return res.status(200).json(messages);

    }

}

module.exports = { UserController }