const Producao = require('../models/Producao');

module.exports = {
  async criar(req, res) {
    const {
      qtd_planejada,
      lote,
      data,
      inicio,
      qtd_produzida,
      qtd_defeito,
      usuario_id,
      produto_id
    } = req.body

    const producao = await Producao.create({
      qtd_planejada,
      lote,
      data,
      inicio,
      qtd_produzida,
      qtd_defeito,
      usuario_id,
      produto_id
    })

    return res.json(producao)
  },

  async listar(req, res) {
    const producoes = await Producao.findAll()
    return res.json(producoes)
  }
}