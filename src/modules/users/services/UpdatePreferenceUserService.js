const {
  PreferencesRepository,
} = require("../repositories/PreferencesRepository");

class UpdatePreferenceUserService {
  async handle({ preference, preferenceValue, user_id }) {
    await PreferencesRepository.update(
      {
        [preference]: preferenceValue,
      },
      {
        where: {
          user_id,
        },
      }
    );
  }
}

module.exports = { UpdatePreferenceUserService };
