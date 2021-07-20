const { CreateConnectionService } = require('../services/CreateConnectionService');
const { FindAllConnectionsService } = require('../services/FindAllConnectionsService');
const { FinByEmailUserService } = require('../services/FinByEmailUserService');
const { FindByIdUserConnectionService } = require('../services/FindByIdUserConnectionService');
const { UpdateUserConnectionService } = require('../services/UpdateUserConnectionService');
const { WithSocketConnectionService } = require('../services/WithSocketConnectionService');
const { FindBySocketIDService } = require('../services/FindBySocketIDService');
const { CreateMessageService } = require('../services/CreateMessageService');
const { ListMessagesService } = require('../services/ListMessagesService');
const { CreateChanelService } = require('../services/CreateChanelService');
const { FindChanelByUserCreateService } = require('../services/FindChanelByUserCreateService');

const { ConnectionsSerialize } = require('../serializes/ConnectionsSerialize');

module.exports = () => {

    global.io.on('connect', (socket) => {

        const createConnectionService = new CreateConnectionService();
        const findyEmailUserService = new FinByEmailUserService();
        const findyIdUserConnectionService = new FindByIdUserConnectionService();
        const updateUserConnectionService = new UpdateUserConnectionService();
        const findAllConnectionsService = new FindAllConnectionsService();
        const whithSocketConnectionService = new WithSocketConnectionService();
        const findBySocketIDService = new FindBySocketIDService();
        const createMessageService = new CreateMessageService();
        const createChanelService = new CreateChanelService();
        const findChanelByUserCreateService = new FindChanelByUserCreateService();
        const listMessagesService = new ListMessagesService();

        const connectionsSerialize = new ConnectionsSerialize();

        socket.on('acess_chat_parcipant', async(params) => {

            const { email } = params;

            const socket_id = socket.id;

            const user = await findyEmailUserService.execute({ email });

            if(user){

                const connection = await findyIdUserConnectionService.execute(user.id);

                if(!connection){
                    await createConnectionService.execute({
                        socket_id,
                        user_id: user.id
                    })
                }else{
                    await updateUserConnectionService.execute({ user_id: user.id, socket_id });
                }

                const connections = await findAllConnectionsService.execute();

                const allParticipants = connectionsSerialize.listAllConnetionsUser(connections);

                global.io.emit('participants_list_all', allParticipants);

            }

        });

        socket.on('entry_chanel', async(params, callback) => {
            const { descChanel, fkUser, fkUserParticipant } = params;

            const chanelExists = await findChanelByUserCreateService.execute({ fkUser, fkUserParticipant });

            if(!chanelExists){

                const data = {
                    descChanel, 
                    fkUserCreate: fkUser
                }

                const chanel = await createChanelService.execute(data);

                callback(chanel.id);

            }else{

                callback(chanelExists.id);
            }
        })

        socket.on('logout_parcipant', async( user_id ) => {

            await updateUserConnectionService.execute({ user_id, socket_id: null });

            const connections = await whithSocketConnectionService.execute();

            const newParticipants = connectionsSerialize.listAllConnetionsUser(connections);

            global.io.emit('participants_list_all', newParticipants);            

        })

        socket.on('user_send_message', async(params) => {

            const { text, socket_user, socket_user_receiver, chanel_id, username_message } = params;

            const user_receiver = await findBySocketIDService.execute(socket_user_receiver);

            const user_sender = await findBySocketIDService.execute(socket_user);

            await createMessageService.execute({ 
                fkUserReceiver: user_receiver.id, 
                fkUserSender: user_sender.id, 
                fkChanel: chanel_id,
                message: text 
            })

            global.io.to(socket_user_receiver).emit('user_receiver_message', { text, username_message })

        })

        socket.on('list_messages', async (params, callback) => {

            const { idChanel } = params;

            const messages = await listMessagesService.execute(idChanel);

            callback(messages);
        })

    })
}