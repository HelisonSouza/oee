const Produto = require('../models/Produto');
const Validacoes = require('../validators/validacoes')

//Inicializa as validações
const validar = new Validacoes()

module.exports = {

  async criar(req, res) {

    //pega os dados do corpo da requisição -> 
    const { nome, descricao } = req.body
    //passando velocidade para um float    
    const velocidade = parseFloat(req.body.velocidade)
    console.log(velocidade)
    console.log(typeof velocidade)
    if (velocidade == 'NaN') {
      req.flash('msgErro', 'O valor do campo velocidade deve ser um número, tente novamente')
      res.redirect('/produtos')
    }

    //Executar as validações
    validar.isRequired(nome, 'Nome inválido ')
    validar.hasMinLen(nome, 2, 'Nome muito curto ')

    // Se os dados forem inválidos, retorna com a mensagem do erro
    if (!validar.isValid()) {
      const erros = validar.errors()
      erros.forEach((value) => {
        console.log(value.message)
        req.flash('msgErro', `${value.message}`)
      })
      res.redirect('/produtos')

    } else {
      // Passou nas validações
      try {
        //Criar novo produto
        const produtos = await Produto.create({ nome, descricao, velocidade })
        req.flash('msgSucesso', 'Um novo produto foi cadastrado.')
        res.redirect('/produtos')
      } catch (error) {
        req.flash('msgErro', `Erro no processo do cadastro. Tente novamente...,${error}`)
      }

    }
  },

  async listar(req, res) {
    const produtos = await Produto.findAll()
    return res.render('produtos/produtos', { produtos: produtos })
  },
  async formEdit(req, res) {
    const { nome, descricao, velocidade } = req.body
    const id = req.params.id
    // validações 

    //busca dados do produto pelo id
    const dados = await Produto.findOne({ where: { id: id } })
    //console.log(produto)
    return res.render('produtos/editar', { produto: dados })
  },

  async editar(req, res) {
    const id = req.params.id
    const { nome, descricao, velocidade } = req.body
    //console.log(id, descricao, nome, velocidade)
    const produto = await Produto.update({ nome, descricao, velocidade }, { where: { id: id } })
    return res.redirect('/produtos')
  }
} 