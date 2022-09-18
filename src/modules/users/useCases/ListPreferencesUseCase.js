const {
  FindByPreferenceUserService,
} = require("../services/FindByPreferenceUserService");

module.exports = async ({ user_id }, callback) => {
  const preferences = await new FindByPreferenceUserService().handle({
    user_id,
  });

  callback(preferences);
};
