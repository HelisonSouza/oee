'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    queryInterface.dropTable('Paradas')
  },

  down: async (queryInterface, Sequelize) => {
    queryInterface.dropTable('Paradas')
  }
};
