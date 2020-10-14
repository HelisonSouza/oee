const { Model, DataTypes } = require('sequelize')

class Pausa extends Model {
  static init(sequelize) {
    super.init({
      nome: DataTypes.STRING,
      inicio: DataTypes.TIME,
      fim: DataTypes.TIME,
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