'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    queryInterface.addColumn(
      'Produtos',
      'producao_id',
      {
        allowNull: true,
        type: Sequelize.INTEGER,
        references: { model: 'Producao', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      }
    )
  },


  down: async (queryInterface, Sequelize) => {
    queryInterface.removeColumn(
      'Produtos',
      'producao_id'
    )
  }
};
