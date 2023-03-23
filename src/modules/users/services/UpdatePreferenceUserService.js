const {
  PreferencesRepository,
} = require("../repositories/PreferencesRepository");

class UpdatePreferenceUserService {
  async handle({ preference, preferenceValue, user_id }) {
    const preferencesExists = await PreferencesRepository.findOne({
      where: {
        user_id,
      },
    });

    if (!preferencesExists) {
      const newPreference = await PreferencesRepository.create({
        [preference]: preferenceValue,
      });

      return newPreference;
    } else {
      await PreferencesRepository.update(
        {
          [preference]: preferenceValue,
        },
        {
          where: {
            user_id,
          },
          returning: true,
        }
      );

      const preferenceUpdated = {
        [preference]: preferenceValue,
      };

      return preferenceUpdated;
    }
  }
}

module.exports = { UpdatePreferenceUserService };
