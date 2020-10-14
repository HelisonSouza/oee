const express = require('express')
const routes = express.Router()

const ParadaController = require('../controllers/ParadaController');


routes.post('/paradas/criar', ParadaController.criar)
routes.get('/paradas', ParadaController.listar)

module.exports = routes;