const { Model, DataTypes } = require('sequelize')

class Producao extends Model {
  static init(sequelize) {
    super.init({
      qtd_planejada: DataTypes.INTEGER,
      lote: DataTypes.STRING,
      data: DataTypes.DATE,
      qtd_produzida: DataTypes.INTEGER,
      qtd_defeito: DataTypes.INTEGER,
    }, {
      sequelize,
      tableName: 'Producoes'
    })
  }
  static associate(models) {
    this.belongsTo(models.Usuario, { foreignKey: 'usuario_id', as: 'usuario' }),
      this.belongsTo(models.Produto, { foreignKey: 'produto_id', as: 'produto' }),
      this.belongsToMany(models.Pausa,
        {
          foreignKey: 'producao_id',
          through: 'Producao_Pausas',
          as: 'pausas'
        })
  }
}

module.exports = Producao