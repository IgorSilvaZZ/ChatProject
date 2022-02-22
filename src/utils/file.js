const fs = require("fs");

module.exports = async (fileName) => {
  try {
    await fs.promises.stat(fileName);
  } catch (error) {
    console.log(error.message);
    return;
  }

  await fs.promises.unlink(fileName);
};
