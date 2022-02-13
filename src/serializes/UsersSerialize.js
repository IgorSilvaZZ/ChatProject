class UsersSerialize {
  handle(users) {
    const usersSerializes = users.map((user) => {
      const { id, name, email } = user;

      return {
        id,
        name,
        email,
      };
    });

    return usersSerializes;
  }
}

module.exports = { UsersSerialize };
