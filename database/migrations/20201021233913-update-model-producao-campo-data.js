'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    queryInterface.dropTable('Producao')
  },

  down: async (queryInterface, Sequelize) => {
    queryInterface.dropTable('Producao')
  }
};
