const {
  PreferencesRepository,
} = require("../repositories/PreferencesRepository");

class CreatePreferencesUserService {
  async handle({ preferenceDescription, preferenceValue, user_id }) {
    const preference = await PreferencesRepository.create({
      [preferenceDescription]: preferenceValue,
      user_id,
    });

    return preference;
  }
}

module.exports = { CreatePreferencesUserService };
