const { UsersRepository } = require("../repositories/UsersRepository");
const deleteFile = require("../../../utils/file");

class UpdateAvatarUserService {
  async handle({ id, avatar_file }) {
    const userExists = await UsersRepository.findOne({
      where: { id },
    });

    if (userExists.avatar) {
      await deleteFile(`./tmp/avatar/${userExists.avatar}`);
    }

    userExists.avatar = avatar_file;

    await userExists.save();

    return userExists;
  }
}

module.exports = { UpdateAvatarUserService };
