const { Model, DataTypes } = require('sequelize') //Importa a classe Model e Datatypes do Sequelize

class Motivo extends Model {
  static init(sequelize) {
    super.init({
      descricao: DataTypes.STRING,
    }, {
      sequelize
    })
  }
}

module.exports = Motivo