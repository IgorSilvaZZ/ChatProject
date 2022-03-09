class ConnectionsSerialize {
  handle(connections) {
    const serializedConnections = connections.map((connection) => {
      const { socket_id } = connection;
      const { id, name, email, avatar } = connection.user;

      return {
        socket_id,
        id,
        name,
        email,
        avatar,
      };
    });

    return serializedConnections;
  }
}

module.exports = { ConnectionsSerialize };
