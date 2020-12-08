const express = require('express')
const routes = express.Router()

const UsuarioController = require('../controllers/UsuarioController')
const { isAdm } = require('../auth/autenticacao')

routes.get('/usuarios', isAdm, UsuarioController.listar)
routes.post('/usuarios', isAdm, UsuarioController.criar)
routes.get('/usuarios/editar/:id', isAdm, UsuarioController.render)
routes.post('/usuarios/editar/:id', isAdm, UsuarioController.editar)
routes.get('/usuarios/desativar/:id', isAdm, UsuarioController.desativar)
routes.get('/login', UsuarioController.renderLogin)
routes.post('/login', UsuarioController.login)
routes.get('/usuarios/relatorios', isAdm, UsuarioController.renderRelatorios)
routes.get('/logout', UsuarioController.logout)


module.exports = routes;