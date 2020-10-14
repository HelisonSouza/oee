'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Producoes', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      produto_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'Produtos', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: ' CASCADE',
      },
      qtd_planejada: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      lote: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      data: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      inicio: {
        type: Sequelize.TIME,
        allowNull: false,
      },
      qtd_produzida: {
        type: Sequelize.INTEGER,
      },
      qtd_defeito: {
        type: Sequelize.INTEGER,
      },
      usuario_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'Usuarios', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
      }

    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Producoes');
  }
};
