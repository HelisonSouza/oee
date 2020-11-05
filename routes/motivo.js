const express = require('express')
const routes = express.Router()

const MotivoController = require('../controllers/MotivoController');


routes.post('/motivos', MotivoController.criar)
routes.get('/motivos', MotivoController.listar)
routes.get('/motivos', MotivoController.editar)

module.exports = routes;