const express = require('express')
const routes = express.Router()

const PausaController = require('../controllers/PausaController');
const Producao_Pausa = require('../controllers/Producao_PausaController')


routes.post('/pausas', PausaController.criar)
routes.get('/pausas', PausaController.listar)
routes.post('/pausas/:pausa_id/associar', Producao_Pausa.associar)

module.exports = routes;