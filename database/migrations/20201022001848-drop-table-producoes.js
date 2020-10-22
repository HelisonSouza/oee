'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    queryInterface.removeColumn('Producoes', 'inicio')
  },

  down: async (queryInterface, Sequelize) => {
    queryInterface.removeColumn('Producoes', 'inicio')
  }
};



