const {
  UpdatePreferenceUserService,
} = require("../services/UpdatePreferenceUserService");

class UpdatePreferencesController {
  async execute(req, res) {
    const id = req.userId;

    const { preference_name, preference_value } = req.body;

    const updatePreferences = await new UpdatePreferenceUserService().handle({
      preference: preference_name,
      preferenceValue: preference_value,
      user_id: id,
    });

    return res.status(200).json(updatePreferences);
  }
}

module.exports = { UpdatePreferencesController };
