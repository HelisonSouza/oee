'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    queryInterface.addColumn(
      'Pausas',
      'ativo',
      {
        type: Sequelize.BOOLEAN,
        defaultValue: true
      }
    )
  },

  down: async (queryInterface, Sequelize) => {
    queryInterface.removeColumn(
      'Pausas',
      'ativo',
    )
  }
};
