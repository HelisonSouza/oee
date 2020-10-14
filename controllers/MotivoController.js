const Motivo = require('../models/Motivo');
const { listar } = require('./UsuarioController');

module.exports = {
  async criar(req, res) {
    //pega os dados do corpo da requisição
    const { descricao } = req.body
    //cria
    const motivo = await Motivo.create({ descricao })

    return res.json(motivo)
  },
  async listar(req, res) {
    const motivos = await Motivo.findAll()

    return res.json(motivos)
  }
}