const { Router } = require('express')
const express = require('express')
const routes = express.Router()

const ProdutoController = require('../controllers/ProdutoController')

routes.post('/produtos/criar', ProdutoController.criar)
routes.get('/produtos', ProdutoController.listar)
routes.get('/produtos/editar/:id', ProdutoController.formEdit)
routes.post('/produtos/editar/:id', ProdutoController.editar)



module.exports = routes;