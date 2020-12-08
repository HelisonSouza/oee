const { Model, DataTypes } = require('sequelize')

class Parada extends Model {
  static init(sequelize) {
    super.init({
      inicio: DataTypes.DATE,
      fim: DataTypes.DATE,
      identificada: DataTypes.BOOLEAN
    }, {
      sequelize
    })
  }

  static associate(models) {
    this.belongsTo(models.Usuario, { foreignKey: 'usuario_id', as: 'usuario' })
    this.belongsTo(models.Motivo, { foreignKey: 'motivo_id', as: 'motivo' })
    this.belongsTo(models.Producao, { foreignKey: 'producao_id', as: 'producao' })
  }
}

module.exports = Parada