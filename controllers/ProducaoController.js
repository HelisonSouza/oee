const Producao = require('../models/Producao');
const Pausa = require('../models/Pausa');
const datefns = require('date-fns');
const { endOfDecadeWithOptions } = require('date-fns/fp');
const Validacoes = require('../validators/validacoes');
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
    const dataCompleta = req.body.data + ' ' + req.body.inicio
    const data = new Date(dataCompleta)

    const producao = await Producao.create({
      qtd_planejada,
      lote,
      data,
      qtd_produzida: 0,
      qtd_defeito: 0,
      usuario_id: 1,
      produto_id,
      status: "planejada"
    })

    return res.redirect('/producoes')
  },
  /*
  --------------------------------------------------------------------------------------------------------------------------
  LISTAR PRODUÇÕES
  --------------------------------------------------------------------------------------------------------------------------
  */
  async listar(req, res) {
    const producoes = await Producao.findAll({
      include: {
        association: 'produto',
      }
    }).then((dados) => {
      console.log(dados)
      var retorno = []
      dados.forEach((valor, index) => {
        const newDate = datefns.format(valor.data, "dd-MM-yyyy' 'HH:mm")

        retorno[index] = {
          id: valor.id,
          qtd_planejada: valor.qtd_planejada,
          lote: valor.lote,
          data: newDate,
          qtd_produzida: valor.qtd_produzida,
          qtd_defeito: valor.qtd_defeito,
          usuario_id: valor.usuario_id,
          produto_id: valor.produto.nome,
          status: valor.status
        }
      })
      res.render('producao/producao', { producao: retorno })
    })

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
  /*
  --------------------------------------------------------------------------------------------------------------------------
  RENDERIZAR PÁGINA DE RELATÓRIOS
  --------------------------------------------------------------------------------------------------------------------------
  */
  async renderRelatorios(req, res) {
    try {
      var result = []
      const producoes = Producao.findAll({
        include: {
          association: 'produto',
        }
      }).then((dados) => {
        dados.forEach((valor, index) => {
          const newDate = datefns.format(valor.data, "dd-MM-yyyy' 'HH:mm")
          result[index] = {
            id: valor.id,
            qtd_planejada: valor.qtd_planejada,
            lote: valor.lote,
            data: newDate,
            qtd_produzida: valor.qtd_produzida,
            qtd_defeito: valor.qtd_defeito,
            usuario_id: valor.usuario_id,
            produto_id: valor.produto.nome,
            status: valor.status
          }
        })
      })
      res.render('producao/relatorios', { producoes: result })
    } catch (erro) {
      req.flash('msgErro', 'Falha no processamento da requisição')
      res.redirect('/producoes')
    }
  },

  /*
  --------------------------------------------------------------------------------------------------------------------------
  RELATÓRIOS
  --------------------------------------------------------------------------------------------------------------------------
  */
  async relatorios(req, res) {

    //const { dataExata, incioPeriodo, fimPeriodo, lote, produtoId, produtoNome } = req.query
    /*{
      dataExata: '2020-11-11',
      incioPeriodo: '',
      fimPeriodo: '',
      lote: '003',
      produtoId: '0',
      produtoNome: ''
    }*/
    let consulta = req.query
    console.log(consulta)

    const filterObj = (obj, valorNegado) => {

      let keys = Object.keys(obj) //pega as keys do obj
      let values = Object.values(obj) // pega os valores do obj
      console.log(keys, values)
      //.filter(value => !valorNegado.includes(value)) //monta um array com o valores sem o filtro
      //.keys(obj) //
      /*
      .map(value => { obj[value]})
      .reduce((anterior, atual) => {
        return {
          ...anterior,
          ...atual
        }
      }, {})*/
      return { keys, values }

    }

    const dados = filterObj(consulta, [""])
    console.log(dados)
    /*
    for (var index in consulta) {
      //console.log(consulta[index])
      if (consulta[index] != "") dadosDaQuery = {index : consulta[index]}
    }

    console.log(dadosDaQuery)
    if(dataExata && dataExata != "") consultar.push[dataExata]
    const producoes = await Producao.findAll({
      where: {
        lote: lote,
        data: dataExata,
      }
    })
    console.log(req.query)
    res.render('producao/relatorios', { producoes })
    */
    res.send(dados)
  },

}

