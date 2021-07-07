class ConnectionsSerialize {

    listAllConnetionsUser(connections){

        const serializedConnections = connections.map(connection => {
            return {
                socket_id: connection.socket_id,
                user_id: connection.user.id,
                name: connection.user.name
            }
        });

        return serializedConnections;
        
    }

}

module.exports = { ConnectionsSerialize }