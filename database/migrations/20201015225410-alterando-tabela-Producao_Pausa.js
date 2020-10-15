'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    queryInterface.dropTable('Producao_Pausas')
  },

  down: async (queryInterface, Sequelize) => {
    queryInterface.dropTable('Producao_Pausas')
  }
};
