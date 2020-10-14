const Usuario = require('../models/Usuario');

module.exports = {
  async criar(req, res) {
    //pega os dados do corpo da requisição
    const { nome, email, senha } = req.body
    //cria
    const usuario = await Usuario.create({ nome, email, senha })

    return res.json(usuario)
  },

  async listar(req, res) {
    const usuarios = await Usuario.findAll()

    return res.json(usuarios)
  }
}