const { UsersRepository } = require("../repositories/UsersRepository");

class FindByUserService {
  async handle(id) {
    const user = await UsersRepository.findOne({
      where: { id },
      attributes: ["name", "email"],
    });

    if (!user) {
      throw new Error("User not found!");
    }

    return user;
  }
}

module.exports = { FindByUserService };
