const { Op } = require("sequelize");

const {
  PreferencesRepository,
} = require("../repositories/PreferencesRepository");

class FindByPreferenceUserService {
  async handle(description, user_id) {
    const preference = await PreferencesRepository.findOne({
      where: {
        [Op.and]: [{ user_id }, { description }],
      },
    });

    return preference;
  }
}

module.exports = { FindByPreferenceUserService };
