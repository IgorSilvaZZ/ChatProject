const { CreateConnectionService } = require('../services/CreateConnectionService');
const { FindAllConnectionsService } = require('../services/FindAllConnectionsService');
const { FinByEmailUserService } = require('../services/FinByEmailUserService');
const { FindByIdUserConnectionService } = require('../services/FindByIdUserConnectionService');
const { UpdateUserConnectionService } = require('../services/UpdateUserConnectionService');
const { WithSocketConnectionService } = require('../services/WithSocketConnectionService')

const { ConnectionsSerialize } = require('../serializes/ConnectionsSerialize');

let participants = [];

module.exports = () => {

    global.io.on('connect', (socket) => {

        const createConnectionService = new CreateConnectionService();
        const findyEmailUserService = new FinByEmailUserService();
        const findyIdUserConnectionService = new FindByIdUserConnectionService();
        const updateUserConnectionService = new UpdateUserConnectionService();
        const findAllConnectionsService = new FindAllConnectionsService();
        const whithSocketConnectionService = new WithSocketConnectionService();

        const connectionsSerialize = new ConnectionsSerialize();

        socket.on('acess_chat_parcipant', async(params) => {

            const { username, email } = params;

            const socket_id = socket.id;

            const user = await findyEmailUserService.execute({ email });

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

            participants.push({ username, socket_id });

            global.io.emit('participants_list_all', allParticipants);

        });

        socket.on('logout_parcipant', async( user_id ) => {

            await updateUserConnectionService.execute({ user_id, socket_id: null });

            const connections = await whithSocketConnectionService.execute();

            const newParticipants = connectionsSerialize.listAllConnetionsUser(connections);

            global.io.emit('participants_list_all', newParticipants);            

        })

        socket.on('user_send_message', params => {

            const { text, socket_id, socket_user_send, username_message } = params;

            global.io.to(socket_id).emit('user_receiver_message', { text, socket_id, socket_user_send, username_message })

        })

    })
}