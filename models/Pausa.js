const { Model, DataTypes } = require('sequelize')

class Pausa extends Model {
  static init(sequelize) {
    super.init({
      nome: DataTypes.STRING,
      inicio: DataTypes.DATE,
      fim: DataTypes.DATE,
      ativo: DataTypes.BOOLEAN
    }, {
      sequelize
    })
  }
  static associate(models) {
    this.belongsToMany(models.Producao,
      {
        foreignKey: 'pausa_id',
        through: 'Producao_Pausas',
        as: 'producao'
      })
  }
}

module.exports = Pausa