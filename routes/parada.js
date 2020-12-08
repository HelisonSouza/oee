const express = require('express')
const routes = express.Router()

const ParadaController = require('../controllers/ParadaController');


routes.post('/paradas/criar', ParadaController.criar)
routes.get('/paradas', ParadaController.listar)
routes.get('/paradas/atribuir_motivo/:id', ParadaController.atribuirMotivo)
routes.get('/paradas/relatorios', ParadaController.relatorios)
routes.get('/paradas/relatorio', ParadaController.relatorio)

module.exports = routes;