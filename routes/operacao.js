const express = require('express')
const routes = express.Router()
const OperacaoController = require('../controllers/OperacaoController');

routes.get('/operacao', OperacaoController.busca)
routes.get('/operacao/start', OperacaoController.painel)
routes.get('/operacao/start/:id', OperacaoController.start)

routes.get('/operacao/executadas', OperacaoController.getProducoesExecutadas)
routes.get('/paradas')
routes.get('/motivos')



module.exports = routes;