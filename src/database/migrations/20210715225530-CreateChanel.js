'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.createTable('tbChanels', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true,
      },
      descChanel: {
        type: Sequelize.STRING,
        allowNull: true
      },
      fkUserCreate: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'tbUsers', key: 'id' },
        onUpdate: 'SET NULL',
        onDeleted: 'SET NULL'
      },
      createdAt: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
      },
      updatedAt: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
      },
    })
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.dropTable('tbChanels');
  }
};
