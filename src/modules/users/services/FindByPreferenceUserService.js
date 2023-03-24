const {
  PreferencesRepository,
} = require("../repositories/PreferencesRepository");

class FindByPreferenceUserService {
  async handle({ user_id }) {
    const preference = await PreferencesRepository.findOne({
      where: {
        user_id,
      },
    });

    return preference;
  }
}

module.exports = { FindByPreferenceUserService };
