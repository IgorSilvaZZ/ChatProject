"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.renameTable("tbNewConversations", "tbConversations");
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.renameTable("tbConversations", "tbNewConversations");
  },
};
