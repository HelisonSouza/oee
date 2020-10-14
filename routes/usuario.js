const express = require('express')
const routes = express.Router()

const UsuarioController = require('../controllers/UsuarioController')

routes.post('/usuarios', UsuarioController.criar)
routes.get('/usuarios', UsuarioController.listar)

module.exports = routes;