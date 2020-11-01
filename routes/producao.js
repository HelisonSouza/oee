const express = require('express')
const routes = express.Router()

const ProducaoController = require('../controllers/ProducaoController');
const { isAdm } = require('../auth/autenticacao')

routes.post('/producao/cadastrar', ProducaoController.criar)
routes.get('/producoes', ProducaoController.listar)
routes.get('/producao/editar/:id', ProducaoController.formEdit)
routes.get('/producao/atribuir_pausas/:id', ProducaoController.atribuir)

module.exports = routes;