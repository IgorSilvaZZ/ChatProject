const {
  UpdateUserConnectionService,
} = require("../../connections/services/UpdateUserConnectionService");

module.exports = async (user_id) => {
  await new UpdateUserConnectionService().handle({
    user_id,
    socket_id: null,
  });
};
