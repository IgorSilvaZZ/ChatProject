class UsersSerialize {
  handle(users) {
    const usersSerializes = users.map((user) => {
      const { id, name, nickname, email, avatar } = user;

      return {
        id,
        name,
        nickname,
        email,
        avatar,
      };
    });

    return usersSerializes;
  }
}

module.exports = { UsersSerialize };
