'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Producao_Pausas', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      producao_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'Producoes', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: ' CASCADE',
      },
      pausa_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'Pausas', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: ' CASCADE',
      },
      nome: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      inicio: {
        type: Sequelize.TIME,
        allowNull: false,
      },
      fim: {
        type: Sequelize.TIME,
        allowNull: false,
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
    await queryInterface.dropTable('Producao_Pausas');
  }
};
