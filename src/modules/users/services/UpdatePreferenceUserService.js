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
      const preferenceCreate = {
        notification_preference: false,
        sound_preference: false,
      };

      const newPreference = await PreferencesRepository.create({
        ...preferenceCreate,
        [preference]: preferenceValue,
        user_id,
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
        ...preferencesExists,
        [preference]: preferenceValue,
      };

      return preferenceUpdated;
    }
  }
}

module.exports = { UpdatePreferenceUserService };
