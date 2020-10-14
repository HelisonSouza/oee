'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Produtos', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      nome: {
      type: Sequelize.STRING,
      allowNull: false,
    },
      descricao: {
      type: Sequelize.STRING,
      allowNull: false,
    },
      velocidade: {
      type: Sequelize.FLOAT,
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
    await queryInterface.dropTable('Produtos');
  }
};
