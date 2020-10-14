const Parada = require('../models/Parada');

module.exports = {
  async criar(req, res) {
    const { inicio } = req.body
    const fim = inicio
    const usuario_id = 1
    const motivo_id = 1

    const parada = await Parada.create({
      inicio,
      fim,
      usuario: usuario_id,
      motivo: motivo_id
    })

    return res.json(parada)
  },

  async listar(req, res) {
    const paradas = await Parada.findAll()
    return res.json(paradas)
  }
}