const { Op } = require("sequelize");

const {
  PreferencesRepository,
} = require("../repositories/PreferencesRepository");

class FindByPreferenceUserService {
  async handle({ user_id, description, preferenceValue }) {
    const preference = await PreferencesRepository.findOne({
      where: {
        user_id,
        [description]: preferenceValue,
      },
    });

    return preference;
  }
}

module.exports = { FindByPreferenceUserService };
