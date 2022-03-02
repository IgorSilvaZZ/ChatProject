class UsersSerialize {
  handle(users) {
    const usersSerializes = users.map((user) => {
      const { id, name, email, avatar } = user;

      return {
        id,
        name,
        email,
        avatar,
      };
    });

    return usersSerializes;
  }
}

module.exports = { UsersSerialize };
