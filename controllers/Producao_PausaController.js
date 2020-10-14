const Producao_Pausa = require('../models/Producao_Pausa');
const Pausa = require('../models/Pausa')
const Producao = require('../models/Producao')

module.exports = {
  async associar(req, res) {
    const { pausa_id } = req.params
    const { producao_id, nome, inicio, fim } = req.body

    const pausa = await Pausa.findByPk(pausa_id)

    //Verifica se a produção ja foi programada
    if (!pausa) {
      return res.status(400).json({ error: 'Pausa não cadastrada' })
    }

    const producao = await Producao.findByPk(producao_id)

    //Verifica se a produção ja foi programada
    if (!producao) {
      return res.status(400).json({ error: 'Produção não programada' })
    }

    const parada = await Producao_Pausa.create({
      pausa_id,
      producao_id,
      nome,
      inicio,
      fim,
    })

    return res.json(parada)

  },

  async listar(req, res) {
    const paradas = await Producao_Pausa.findAll()
    return res.json(paradas)
  }
}