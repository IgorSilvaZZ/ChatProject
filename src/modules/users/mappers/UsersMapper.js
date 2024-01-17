function usersFormattedMapper(users) {
  const userListFormatted = users.map((user) => {
    const { id, name, email, avatar } = user;

    return {
      id,
      name,
      email,
      avatar,
    };
  });

  return userListFormatted;
}

module.exports = { usersFormattedMapper };
