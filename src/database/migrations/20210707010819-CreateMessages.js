"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.createTable("tbMessages", {
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
      fkUserSender: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: "tbUsers", key: "id" },
        onUpdate: "SET NULL",
        onDeleted: "SET NULL",
      },
      fkUserReceiver: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: "tbUsers", key: "id" },
        onUpdate: "SET NULL",
        onDeleted: "SET NULL",
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

  down: async (queryInterface, Sequelize) => {
    return queryInterface.dropTable("tbMessages");
  },
};
