function connectionsFormattedMapper(connections) {
  const connectionsFormattedList = connections.map((connection) => {
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

  return connectionsFormattedList;
}

module.exports = { connectionsFormattedMapper };
