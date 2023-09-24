"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.renameTable("tbNewMessages", "tbMessages");
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.renameTable("tbMessages", "tbNewMessages");
  },
};
