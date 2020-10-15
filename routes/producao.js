const express = require('express')
const routes = express.Router()

const ProducaoController = require('../controllers/ProducaoController');


routes.post('/producao/cadastrar', ProducaoController.criar)
routes.get('/producoes', ProducaoController.listar)
routes.get('/producao/editar/:id', ProducaoController.formEdit)

module.exports = routes;