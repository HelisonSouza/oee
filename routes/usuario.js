const express = require('express')
const routes = express.Router()

const UsuarioController = require('../controllers/UsuarioController')
const auth = require('../auth/autenticacao')

routes.get('/usuarios', auth, UsuarioController.listar)
routes.post('/usuarios', UsuarioController.criar)
routes.get('/usuarios/editar/:id', UsuarioController.render)
routes.post('/usuarios/editar/:id', UsuarioController.editar)
routes.get('/usuarios/desativar/:id', UsuarioController.desativar)
routes.get('/login', UsuarioController.renderLogin)
routes.post('/login', UsuarioController.login)

module.exports = routes;