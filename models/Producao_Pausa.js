const { Model, DataTypes } = require('sequelize')

class Producao_Pausa extends Model {
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
    this.belongsTo(models.Producao, { foreignKey: 'producao_id', as: 'producao' }),
      this.belongsTo(models.Pausa, { foreignKey: 'pausa_id', as: 'pausa' })
  }
}

module.exports = Producao_Pausa