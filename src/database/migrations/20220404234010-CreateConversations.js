"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.createTable("tbConversations", {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true,
      },
      fkUserReceiver: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: "tbUsers", key: "id" },
        onUpdate: "SET NULL",
        onDeleted: "SET NULL",
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
    return queryInterface.dropTable("tbConversations");
  },
};
