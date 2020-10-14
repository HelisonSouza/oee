const { Model, DataTypes } = require('sequelize')

class Parada extends Model {
  static init(sequelize) {
    super.init({
      inicio: DataTypes.DATE,
      fim: DataTypes.DATE,
    }, {
      sequelize
    })
  }

  static associate(models) {
    this.belongsTo(models.Usuario, { foreignKey: 'usuario_id', as: 'usuario' }),
      this.belongsTo(models.Motivo, { foreignKey: 'motivo_id', as: 'motivo' })
  }
}

module.exports = Parada