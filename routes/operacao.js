const express = require('express')
const routes = express.Router()
const OperacaoController = require('../controllers/OperacaoController');

routes.get('/operacao', OperacaoController.busca)
routes.get('/operacao/start', OperacaoController.start)
routes.get('/operacao/start/:id', OperacaoController.startId)


module.exports = routes;