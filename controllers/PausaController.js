const Pausa = require('../models/Pausa');
const Validacoes = require('../validators/validacoes')
const validar = new Validacoes()
const datefns = require('date-fns');
const { ptBR } = require('date-fns/locale');

module.exports = {
  /*
  --------------------------------------------------------------------------------------------------------------------------
  CADASTRAR UMA NOVA PAUSA
  --------------------------------------------------------------------------------------------------------------------------
  */
  async criar(req, res) {
    const { inicio, fim, nome } = req.body

    const inicioFormat = new Date(`2020-01-01 ${inicio}`)
    const fimFormat = new Date(`2020-01-01 ${fim}`)

    console.log(inicio, fim, nome, inicioFormat, fimFormat)
    const pausa = await Pausa.create({
      inicio: inicioFormat,
      fim: fimFormat,
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
    let results = []
    pausas.forEach((valor, index) => {
      const inicioFormat = datefns.format(valor.inicio, "HH:mm")
      const fimFormat = datefns.format(valor.fim, "HH:mm")
      const duracao = datefns.formatDistanceStrict(valor.inicio, valor.fim, { locale: ptBR })
      results[index] = {
        id: valor.id,
        nome: valor.nome,
        inicio: inicioFormat,
        fim: fimFormat,
        duracao: duracao
      }
      //console.log(results)
    })
    return res.render('pausas/pausas', { pausas: results })
  },
  /*
  --------------------------------------------------------------------------------------------------------------------------
  RENDERIZA FORMULÁRIO DE EDIÇÃO
  --------------------------------------------------------------------------------------------------------------------------
  */
  async formEdit(req, res) {
    try {
      //pega o id
      const id = req.params.id

      let results = []
      //busca dados pelo id
      const pausas = await Pausa.findAll({ where: { id: id } })

      pausas.forEach((valor, index) => {
        const inicioFormat = datefns.format(valor.inicio, "HH:mm")
        const fimFormat = datefns.format(valor.fim, "HH:mm")
        const duracao = datefns.formatDistanceStrict(valor.inicio, valor.fim, { locale: ptBR })
        results[index] = {
          id: valor.id,
          nome: valor.nome,
          inicio: inicioFormat,
          fim: fimFormat,
          duracao: duracao
        }
        //console.log(results)
      })

      res.render('pausas/editar', { pausas: results })
    } catch (erro) {
      req.flash('msgErro', 'Falha no processamento da requisição  ' + (erro))
      res.redirect('/pausas')
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
  },
  /*
  --------------------------------------------------------------------------------------------------------------------------
    RENDER VIEW RELATÓRIOS
  --------------------------------------------------------------------------------------------------------------------------
  */
  async renderRelatorios(req, res) {
    try {
      const pausas = await Pausa.findAll()
      let results = []
      pausas.forEach((valor, index) => {
        const inicioFormat = datefns.format(valor.inicio, "HH:mm")
        const fimFormat = datefns.format(valor.fim, "HH:mm")
        const duracao = datefns.formatDistanceStrict(valor.inicio, valor.fim, { locale: ptBR })
        const cadastro = datefns.format(valor.createdAt, "dd-MM-yyyy' 'HH:mm")
        let status = "Ativo"
        if (valor.ativo === false) {
          status = "Desativado"
        }
        results[index] = {
          id: valor.id,
          nome: valor.nome,
          inicio: inicioFormat,
          fim: fimFormat,
          duracao: duracao,
          cadastradoEm: cadastro,
          ativo: status
        }
        //console.log(results)
      })
      return res.render('pausas/relatorios', { pausas: results })
    } catch (erro) {
      req.flash('msgErro', 'Falha no processamento da requisição' + erro)
      res.redirect('/pausas')
    }
  },
}