const express = require('express')
const routes = express.Router()

const PausaController = require('../controllers/PausaController');
const Producao_Pausa = require('../controllers/Producao_PausaController')


routes.post('/pausas/criar', PausaController.criar)
routes.get('/pausas', PausaController.listar)
routes.post('/pausas/:pausa_id/associar', Producao_Pausa.associar)
routes.get('/pausas/editar/:id', PausaController.formEdit)
routes.post('/pausas/editar/:id', PausaController.editar)
routes.get('/pausas/desativar/:id', PausaController.desativar)

module.exports = routes;