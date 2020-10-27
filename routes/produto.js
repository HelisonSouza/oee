//const { Router } = require('express')
const express = require('express')
const routes = express.Router()
const auth = require('../auth/autenticacao')
const ProdutoController = require('../controllers/ProdutoController')

routes.post('/produtos/criar', auth, ProdutoController.criar)
routes.get('/produtos', auth, ProdutoController.listar)
routes.get('/produtos/editar/:id', ProdutoController.formEdit)
routes.post('/produtos/editar/:id', ProdutoController.editar)
routes.get('/produtos/desativar/:id', ProdutoController.desativar)

module.exports = routes;