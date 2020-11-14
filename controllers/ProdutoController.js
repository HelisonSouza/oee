const Produto = require('../models/Produto');
const Validacoes = require('../validators/validacoes')
const validar = new Validacoes()
const datefns = require('date-fns');
const { endOfDecadeWithOptions } = require('date-fns/fp');

module.exports = {
  /*
  --------------------------------------------------------------------------------------------------------------------------
  CADASTRAR UM NOVO PRODUTO
  --------------------------------------------------------------------------------------------------------------------------
  */
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

  /*
  --------------------------------------------------------------------------------------------------------------------------
  LISTAR PRODUTOS ATIVOS
  --------------------------------------------------------------------------------------------------------------------------
  */
  async listar(req, res) {
    const produtos = await Produto.findAll({ where: { ativo: true } })
    return res.render('produtos/produtos', { produtos: produtos })
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
    validar.isRequired(id, 'Produto inválido ')
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
        //busca dados do produto pelo id
        const dados = await Produto.findOne({ where: { id: id } })
        if (!dados) {
          req.flash('msgErro', 'Produto não existe')
          res.redirect('/produtos')
        } else {
          res.render('produtos/editar', { produto: dados })
        }
      } catch {
        req.flash('msgErro', 'Falha no processamento da requisição')
        res.redirect('/produtos')
      }
    }
  },

  /*
  --------------------------------------------------------------------------------------------------------------------------
  EDITAR UM PRODUTO
  --------------------------------------------------------------------------------------------------------------------------
  */
  async editar(req, res) {
    //pega os dados
    const id = req.params.id
    const { nome, descricao } = req.body
    //passando velocidade para float    
    const velocidade = parseFloat(req.body.velocidade)
    console.log(velocidade)
    console.log(typeof velocidade)
    if (velocidade == 'NaN') {
      req.flash('msgErro', 'O valor do campo velocidade deve ser um número, tente novamente')
      res.redirect('/produtos')
    }
    // validações 
    validar.isRequired(id, 'Produto inválido ')
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
        //busca dados do produto pelo id
        const dados = await Produto.findOne({ where: { id: id } })
        if (!dados) {
          req.flash('msgErro', 'Produto não existe')
          res.redirect('/produtos')
        } else {
          //edita o produto
          const produto = await Produto.update({
            nome,
            descricao,
            velocidade
          }, { where: { id: id } })
          req.flash('msgSucesso', 'Produto editado com sucesso')
          res.redirect('/produtos')
        }
      } catch {
        req.flash('msgErro', 'Falha no processamento da requisição')
        res.redirect('/produtos')
      }
    }
  },

  /*
  --------------------------------------------------------------------------------------------------------------------------
  DESATIVAR UM PRODUTO
  --------------------------------------------------------------------------------------------------------------------------
  */
  async desativar(req, res) {
    const id = req.params.id
    // validações 
    validar.isRequired(id, 'Produto inválido ')
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
        //busca dados do produto pelo id
        const dados = await Produto.findOne({ where: { id: id } })
        if (!dados) {
          req.flash('msgErro', 'Produto não existe')
          res.redirect('/produtos')
        } else {
          const produto = await Produto.update({ ativo: false }, { where: { id: id } })
          req.flash('msgSucesso', 'O produto foi desativado')
          res.redirect('/produtos')
        }

      } catch {
        req.flash('msgErro', 'Falha no processamento da requisição')
        res.redirect('/produtos')
      }
    }
  },
  /*
--------------------------------------------------------------------------------------------------------------------------
RENDER VIEW RELATÓRIO DE PRODUTOS
--------------------------------------------------------------------------------------------------------------------------
*/
  async renderRelatorios(req, res) {
    try {
      var result = []
      const produtos = await Produto.findAll().then((dados) => {
        dados.forEach((valor, index) => {
          const newDate = datefns.format(valor.createdAt, "dd-MM-yyyy' 'HH:mm")
          let status = "Ativo"
          if (valor.ativo === false) {
            status = "Desativado"
          }
          result[index] = {
            id: valor.id,
            nome: valor.nome,
            descricao: valor.descricao,
            velocidade: valor.velocidade,
            cadastradoEm: newDate,
            ativo: status
          }
        })
      })
      console.log(result)
      res.render('produtos/relatorios', { produtos: result })
    } catch (erro) {
      req.flash('msgErro', 'Falha no processamento da requisição' + erro)
      res.redirect('/produtos')
    }
  },

} 