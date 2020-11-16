const express = require('express')
const routes = express.Router()

const ParadaController = require('../controllers/ParadaController');


routes.post('/paradas/criar', ParadaController.criar)
routes.get('/paradas', ParadaController.listar)
routes.post('/paradas/atribuir_motivo', ParadaController.atribuirMotivo)
routes.get('/paradas/relatorios', ParadaController.relatorios)

module.exports = routes;