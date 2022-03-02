'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    return queryInterface.addColumn(
      'tbUsers',
      'avatar',
      Sequelize.STRING
    )
  },

  async down (queryInterface, Sequelize) {
    return queryInterface.removeColumn(
      'tbUsers',
      'avatar'
    )
  }
};
