const express = require('express')
const routes = express.Router()

const ProducaoController = require('../controllers/ProducaoController');


routes.post('/producoes', ProducaoController.criar)
routes.get('/producoes', ProducaoController.listar)

module.exports = routes;