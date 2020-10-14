const Pausa = require('../models/Pausa');
const Producao = require('../models/Producao')

module.exports = {
  async criar(req, res) {
    const { inicio, fim, nome } = req.body

    const pausa = await Pausa.create({
      inicio,
      fim,
      nome,
    })

    return res.json(pausa)
  },

  async listar(req, res) {
    const pausas = await Pausa.findAll()
    return res.json(pausas)
  }
}