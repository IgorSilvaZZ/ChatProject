"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.addColumn("tbConversations", "fkGroup", {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: { model: "tbRooms", key: "id" },
      onUpdate: "SET NULL",
      onDelete: "SET NULL",
    });
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.removeColumn("tbConversations", "fkGroup");
  },
};
