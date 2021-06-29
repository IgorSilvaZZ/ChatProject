let participants = [];

module.exports = () => {

    global.io.on('connect', (socket) => {

        socket.on('acess_chat_parcipant', (username) => {

            participants.push({ username, socket_id: socket.id });

            global.io.emit('participants_list_all', participants);

        });

        socket.on('logout_parcipant', username => {

            const newParticipants = participants.filter(participant => participant.username !== username);
            
            participants = newParticipants;

            global.io.emit('participants_list_all', participants);            

        })

        socket.on('user_send_message', params => {

            const { text, socket_id, socket_user_send, username_message } = params;

            global.io.to(socket_id).emit('user_receiver_message', { text, socket_id, socket_user_send, username_message })

        })

    })
}