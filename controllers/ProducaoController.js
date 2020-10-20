const Producao = require('../models/Producao');
const Pausa = require('../models/Pausa');
const datefns = require('date-fns');
const Validacoes = require('../validators/validacoes')
const validar = new Validacoes()

module.exports = {
  /*
  --------------------------------------------------------------------------------------------------------------------------
  CADASTRAR UMA NOVA PRODUÇÃO
  --------------------------------------------------------------------------------------------------------------------------
  */
  async criar(req, res) {
    const {
      qtd_planejada,
      lote,
      produto_id
    } = req.body
    const data_recebida = req.body.data
    const inicio_recebido = req.body.inicio

    const data_formatada = datefns.format(data_recebida, 'MM-dd-yyyy')
    const inicio_formatado = datefns.format(inicio_recebido, 'hh:mm')
    console.log(data_formatada, inicio_formatado)

    const producao = await Producao.create({
      qtd_planejada,
      lote,
      data,
      inicio,
      qtd_produzida: 0,
      qtd_defeito: 0,
      usuario_id: 1,
      produto_id
    })

    return res.redirect('/producoes')
  },
  /*
  --------------------------------------------------------------------------------------------------------------------------
  LISTAR PRODUÇÕES
  --------------------------------------------------------------------------------------------------------------------------
  */
  async listar(req, res) {
    const producoes = await Producao.findAll()
    console
    return res.render('producao/producao', { producao: producoes })
  },

  /*
 --------------------------------------------------------------------------------------------------------------------------
 RENDERIZAR O FORMULÁRIO DE EDIÇÃO
 --------------------------------------------------------------------------------------------------------------------------
 */
  async formEdit(req, res) {
    //pega o id
    const id = req.params.id
    // validações 
    validar.isRequired(id, 'Produção inválida ')
    // Se os dados forem inválidos, retorna com a mensagem do erro
    if (!validar.isValid()) {
      const erros = validar.errors()
      erros.forEach((value) => {
        console.log(value.message)
        req.flash('msgErro', `${value.message}`)
      })
      res.redirect('/producoes')
    } else {
      // Passou nas validações
      try {
        //busca dados pelo id
        const dados = await Producao.findOne({ where: { id: id } })
        if (!dados) {
          req.flash('msgErro', 'Produção não existe')
          res.redirect('/producoes')
        } else {
          res.render('producao/editar', { producao: dados })
        }
      } catch {
        req.flash('msgErro', 'Falha no processamento da requisição')
        res.redirect('/producoes')
      }
    }
  },
  /*
--------------------------------------------------------------------------------------------------------------------------
RENDERIZAR O FORMULÁRIO DE ATRIBUIÇÃO DE PAUSAS
--------------------------------------------------------------------------------------------------------------------------
*/
  async atribuir(req, res) {
    //pega o id
    const id = req.params.id
    // validações 
    validar.isRequired(id, 'Produção inválida ')
    // Se os dados forem inválidos, retorna com a mensagem do erro
    if (!validar.isValid()) {
      const erros = validar.errors()
      erros.forEach((value) => {
        console.log(value.message)
        req.flash('msgErro', `${value.message}`)
      })
      res.redirect('/producoes')
    } else {
      // Passou nas validações
      try {
        //busca dados pelo id
        const dados = await Producao.findOne({ where: { id: id } })
        if (!dados) {
          req.flash('msgErro', 'Produção não existe')
          res.redirect('/producoes')
        } else {
          const pausas = await Pausa.findAll({ where: { ativo: true } })
          res.render('producao/atribuir', { producao: dados, pausas: pausas })
        }
      } catch {
        req.flash('msgErro', 'Falha no processamento da requisição')
        res.redirect('/producoes')
      }
    }
  },
}