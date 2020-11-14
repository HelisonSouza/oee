const express = require('express')
const routes = express.Router()

const MotivoController = require('../controllers/MotivoController');


routes.post('/motivos', MotivoController.criar)
routes.get('/motivos', MotivoController.listar)
routes.post('/motivos/editar/:id', MotivoController.editar)
routes.get('/motivo/editar/:id', MotivoController.renderEditar)
routes.get('/motivo/desativar/:id', MotivoController.desativar)
routes.get('/motivos/relatorios', MotivoController.renderRelatorios)


module.exports = routes;