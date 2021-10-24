const { User } = require("../../../entities/User");

class UsersRepository {
  async create({ name, email, password }) {
    const user = await User.create({
      name,
      email,
      password,
    });

    return user;
  }

  async findByEmail(email) {
    const user = await User.findOne({ where: { email } });

    return user;
  }

  async exists(email) {
    const user = await User.findOne({ where: { email } });

    return !!user;
  }

  async findById(id) {
    const user = await User.findOne({
      where: { id },
      attributes: ["name", "email"],
    });

    return user;
  }
}

module.exports = { UsersRepository };
