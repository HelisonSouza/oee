'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    queryInterface.dropTable('Producoes')
  },

  down: async (queryInterface, Sequelize) => {
    queryInterface.dropTable('Producoes')
  }
};
