const {
  FindByPreferenceUserService,
} = require("../services/FindByPreferenceUserService");
const {
  UpdatePreferenceUserService,
} = require("../services/UpdatePreferenceUserService");
const {
  CreatePreferencesUserService,
} = require("../services/CreatePreferencesUserService");

module.exports = async ({ user_id, preference, preferenceValue }) => {
  const preferencesExists = await new FindByPreferenceUserService().handle({
    user_id,
    description: preference,
    preferenceValue,
  });

  if (preferencesExists) {
    await new UpdatePreferenceUserService().handle({
      user_id,
      preference,
      preferenceValue,
    });
  } else {
    await new CreatePreferencesUserService().handle({
      preferenceDescription: preference,
      preferenceValue,
      user_id,
    });
  }
};
