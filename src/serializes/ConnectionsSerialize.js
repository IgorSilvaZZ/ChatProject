class ConnectionsSerialize {
  handle(connections) {
    const serializedConnections = connections.map((connection) => {
      const { socket_id } = connection;
      const { id, name } = connection.user;

      return {
        socket_id,
        user_id: id,
        name,
      };
    });

    return serializedConnections;
  }
}

module.exports = { ConnectionsSerialize };
