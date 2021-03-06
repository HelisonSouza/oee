//const { Router } = require('express')
const express = require('express')
const routes = express.Router()
const auth = require('../auth/autenticacao')
const ProdutoController = require('../controllers/ProdutoController')
const { isPcp, isGestor } = require('../auth/autenticacao')

routes.post('/produtos/criar', ProdutoController.criar)
routes.get('/produtos', ProdutoController.listar)
routes.get('/produtos/editar/:id', ProdutoController.formEdit)
routes.post('/produtos/editar/:id', ProdutoController.editar)
routes.get('/produtos/desativar/:id', ProdutoController.desativar)
routes.get('/produtos/relatorios', ProdutoController.renderRelatorios)


module.exports = routes;