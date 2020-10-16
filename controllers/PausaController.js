const Pausa = require('../models/Pausa');
const format = require('date-fns/format')
const Validacoes = require('../validators/validacoes')
const validar = new Validacoes()

module.exports = {
  /*
  --------------------------------------------------------------------------------------------------------------------------
  CADASTRAR UMA NOVA PAUSA
  --------------------------------------------------------------------------------------------------------------------------
  */
  async criar(req, res) {
    const { inicio, fim, nome } = req.body

    const pausa = await Pausa.create({
      inicio,
      fim,
      nome,
    })

    return res.redirect('/pausas')
  },
  /*
  --------------------------------------------------------------------------------------------------------------------------
  LISTAR ATIVOS
  --------------------------------------------------------------------------------------------------------------------------
  */
  async listar(req, res) {
    const pausas = await Pausa.findAll({ where: { ativo: true } })
    const duracao = 10
    return res.render('pausas/pausas', { pausas: pausas, duracao: duracao })
  },
  /*
  --------------------------------------------------------------------------------------------------------------------------
  RENDERIZA FORMULÁRIO DE EDIÇÃO
  --------------------------------------------------------------------------------------------------------------------------
  */
  async formEdit(req, res) {
    //pega o id
    const id = req.params.id
    // validações 
    validar.isRequired(id, 'Pausa inválida ')
    // Se os dados forem inválidos, retorna com a mensagem do erro
    if (!validar.isValid()) {
      const erros = validar.errors()
      erros.forEach((value) => {
        console.log(value.message)
        req.flash('msgErro', `${value.message}`)
      })
      res.redirect('/pausas')
    } else {
      // Passou nas validações
      try {
        //busca dados pelo id
        const dados = await Pausa.findOne({ where: { id: id } })
        if (!dados) {
          req.flash('msgErro', 'Pausa não existe')
          res.redirect('/pausas')
        } else {
          res.render('pausas/editar', { pausas: dados })
        }
      } catch {
        req.flash('msgErro', 'Falha no processamento da requisição')
        res.redirect('/pausas')
      }
    }
  },
  /*
  --------------------------------------------------------------------------------------------------------------------------
  EDITAR UM PAUSA
  --------------------------------------------------------------------------------------------------------------------------
  */
  async editar(req, res) {
    //pega os dados
    const id = req.params.id
    const { nome, inicio, fim } = req.body

    // validações 
    validar.isRequired(id, 'Produto inválido ')
    validar.isRequired(nome, 'Nome inválido ')
    validar.hasMinLen(nome, 2, 'Nome muito curto ')
    validar.isRequired(inicio, 'Inicio inválido ')
    validar.isRequired(fim, 'Fim inválido ')

    // Se os dados forem inválidos, retorna com a mensagem do erro
    if (!validar.isValid()) {
      const erros = validar.errors()
      erros.forEach((value) => {
        console.log(value.message)
        req.flash('msgErro', `${value.message}`)
      })
      res.redirect('/pausas')
    } else {
      // Passou nas validações
      try {
        //busca dados pelo id
        const dados = await Pausa.findOne({ where: { id: id } })
        if (!dados) {
          req.flash('msgErro', 'Pausa não existe')
          res.redirect('/pausas')
        } else {
          //desativa pausa selecionada
          await Pausa.update({ ativo: false }, { where: { id: id } })
          //cria uma nova pausa
          const pausas = await Pausa.create({
            nome,
            inicio,
            fim
          })
          req.flash('msgSucesso', 'Pausa editada com sucesso')
          res.redirect('/pausas')
        }
      } catch {
        req.flash('msgErro', 'Falha no processamento da requisição')
        res.redirect('/pausas')
      }
    }
  },
  /*
 --------------------------------------------------------------------------------------------------------------------------
 DESATIVAR UMA PAUSA
 --------------------------------------------------------------------------------------------------------------------------
 */
  async desativar(req, res) {
    const id = req.params.id
    // validações 
    validar.isRequired(id, 'Pausa inválida ')
    // Se os dados forem inválidos, retorna com a mensagem do erro
    if (!validar.isValid()) {
      const erros = validar.errors()
      erros.forEach((value) => {
        console.log(value.message)
        req.flash('msgErro', `${value.message}`)
      })
      res.redirect('/pausas')

    } else {
      // Passou nas validações
      try {
        //busca dados pelo id
        const dados = await Pausa.findOne({ where: { id: id } })
        if (!dados) {
          req.flash('msgErro', 'Pausa não existe')
          res.redirect('/pausas')
        } else {
          await Pausa.update({ ativo: false }, { where: { id: id } })
          req.flash('msgSucesso', 'A pausa foi desativada')
          res.redirect('/pausas')
        }

      } catch {
        req.flash('msgErro', 'Falha no processamento da requisição')
        res.redirect('/pausas')
      }
    }
  }

}