"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.createTable("tbNewConversations", {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true,
      },
      fkUserSender: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: "tbUsers", key: "id" },
        onUpdate: "SET NULL",
        onDelete: "SET NULL",
      },
      fkUserReceiver: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: "tbUsers", key: "id" },
        onUpdate: "SET NULL",
        onDelete: "SET NULL",
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
    return queryInterface.dropTable("tbNewConversations");
  },
};
