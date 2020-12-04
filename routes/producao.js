const express = require('express')
const routes = express.Router()

const ProducaoController = require('../controllers/ProducaoController');
const { isAdm } = require('../auth/autenticacao')

routes.post('/producao/cadastrar', ProducaoController.criar)
routes.get('/producoes', ProducaoController.listar)
routes.get('/producao/desativar/:id', ProducaoController.desativar)
routes.get('/producao/editar/:id', ProducaoController.formEdit)
routes.get('/producao/atribuir_pausas/:id', ProducaoController.atribuir)
routes.get('/producao/relatorios', ProducaoController.renderRelatorios)
routes.get('/producao/relatorio', ProducaoController.relatorios)
routes.post('/producao/atribuir_pausas/:id', ProducaoController.atribuirPausa)
routes.get('/producao/atribuir_pausa/excluir_atribuicao', ProducaoController.excluirAtribuicao)

module.exports = routes;