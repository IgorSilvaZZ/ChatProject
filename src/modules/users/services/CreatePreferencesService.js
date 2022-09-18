const {
  PreferencesRepository,
} = require("../repositories/PreferencesRepository");

class CreatePreferencesService {
  async handle(description, user_id) {
    const preference = await PreferencesRepository.create({
      description,
      user_id,
    });

    return preference;
  }
}

module.exports = { CreatePreferencesService };
