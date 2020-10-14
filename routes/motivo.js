const express = require('express')
const routes = express.Router()

const MotivoController = require('../controllers/MotivoController');


routes.post('/motivos', MotivoController.criar)
routes.get('/motivos', MotivoController.listar)

module.exports = routes;