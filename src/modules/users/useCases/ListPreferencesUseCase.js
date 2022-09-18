const {
  FindByPreferenceUserService,
} = require("../services/FindByPreferenceUserService");

module.exports = async (
  { user_id, preferenceDescription, preferenceValue },
  callback
) => {
  const preferences = await new FindByPreferenceUserService().handle({
    user_id,
    description: preferenceDescription,
    preferenceValue,
  });

  callback(preferences);
};
