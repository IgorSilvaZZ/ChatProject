"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.createTable("tbNewMessages", {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true,
      },
      message: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      fkConversation: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: "tbNewConversations", key: "id" },
        onUpdate: "SET NULL",
        onDelete: "SET NULL",
      },
      statusMessage: {
        type: Sequelize.BOOLEAN,
        allowNull: true,
      },
      createdAt: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
      },
      updatedAt: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
      },
    });
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.dropTable("tbNewMessages");
  },
};
