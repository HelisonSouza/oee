const express = require('express')
const routes = express.Router()

const ProducaoController = require('../controllers/ProducaoController');
const { isGestor, isPcp } = require('../auth/autenticacao')

routes.post('/producao/cadastrar', isGestor, ProducaoController.criar)
routes.get('/producoes', ProducaoController.listar)
routes.get('/producao/desativar/:id', isGestor, ProducaoController.desativar)
routes.get('/producao/editar/:id', isGestor, ProducaoController.formEdit)
routes.get('/producao/atribuir_pausas/:id', isGestor, ProducaoController.atribuir)
routes.get('/producao/relatorios', isGestor, ProducaoController.renderRelatorios)
routes.get('/producao/relatorio', isGestor, ProducaoController.relatorios)
routes.post('/producao/atribuir_pausas/:id', isGestor, ProducaoController.atribuirPausa)
routes.get('/producao/atribuir_pausa/excluir_atribuicao', isGestor, ProducaoController.excluirAtribuicao)

module.exports = routes;