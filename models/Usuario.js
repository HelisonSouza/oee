const { Model, DataTypes } = require('sequelize');

class Usuario extends Model {
  static init(sequelize) {
    super.init({
      nome: DataTypes.STRING,
      email: DataTypes.STRING,
      senha: DataTypes.STRING,
      tipo: DataTypes.STRING,
      ativo: DataTypes.BOOLEAN
    }, {
      sequelize
    })
  }
}

module.exports = Usuario;