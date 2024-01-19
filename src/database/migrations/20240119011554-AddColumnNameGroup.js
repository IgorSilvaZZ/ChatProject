"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.addColumn("tbRooms", "name", {
      type: Sequelize.TEXT,
      allowNull: true,
      after: "id",
    });
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.removeColumn("tbRooms", "name");
  },
};
