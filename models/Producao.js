const { Model, DataTypes } = require('sequelize')

class Producao extends Model {
  static init(sequelize) {
    super.init({
      qtd_planejada: DataTypes.INTEGER,
      lote: DataTypes.STRING,
      data: DataTypes.DATE,
      qtd_produzida: DataTypes.INTEGER,
      qtd_defeito: DataTypes.INTEGER,
      status: DataTypes.STRING,
      finalizadaEm: DataTypes.DATE,
      ativo: DataTypes.BOOLEAN,
      velocidade_media: DataTypes.INTEGER
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
        }),
      this.hasMany(models.Parada, { foreignKey: 'producao_id', as: 'paradas' })
  }
}

module.exports = Producao