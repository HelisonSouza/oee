const express = require('express')
const routes = express.Router()
const OperacaoController = require('../controllers/OperacaoController');

routes.get('/operacao', OperacaoController.busca)
routes.get('/operacao/start', OperacaoController.start)


module.exports = routes;