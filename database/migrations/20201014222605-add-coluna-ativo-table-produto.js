'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    queryInterface.addColumn(
      'Produtos',
      'ativo',
      {
        type: Sequelize.BOOLEAN,
        defaultValue: true
      }
    )
  },

  down: async (queryInterface, Sequelize) => {
    queryInterface.removeColumn(
      'Produtos',
      'ativo',
    )
  }
};
