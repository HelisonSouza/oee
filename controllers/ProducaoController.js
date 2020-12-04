const Producao = require('../models/Producao');
const Produto = require('../models/Produto')
const Pausa = require('../models/Pausa');

const datefns = require('date-fns');
const { endOfDecadeWithOptions } = require('date-fns/fp');
const { ptBR } = require('date-fns/locale');
const Validacoes = require('../validators/validacoes');
const { Op } = require('sequelize');
const validar = new Validacoes()

module.exports = {
  /*
  --------------------------------------------------------------------------------------------------------------------------
  CADASTRAR UMA NOVA PRODUÇÃO
  --------------------------------------------------------------------------------------------------------------------------
  */
  async criar(req, res) {
    try {
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
    } catch (error) {
      req.flash('msgErro', 'Dados inválidos')
      res.redirect('/producoes')
    }

  },
  /*
  --------------------------------------------------------------------------------------------------------------------------
  LISTAR PRODUÇÕES
  --------------------------------------------------------------------------------------------------------------------------
  */
  async listar(req, res) {
    const producoes = []
    await Producao.findAll({
      include: {
        association: 'produto',
        attributes: ['nome'],
      },
      where: {
        status: 'planejada',
        ativo: true
      }
    }).then((dados) => {
      dados.forEach((dado, i) => {
        const data = datefns.format(dado.data, "dd/MM/yyyy' as 'HH:mm")

        producoes[i] = {
          id: dado.id,
          data: data,
          lote: dado.lote,
          qtd_planejada: dado.qtd_planejada,
          produto: dado.produto
        }
      })
    })
    const produtos = await Produto.findAll({
      where: {
        ativo: true
      }
    })
    res.render('producao/producao', { producao: producoes, produtos: produtos })
  },

  /*
 --------------------------------------------------------------------------------------------------------------------------
 DESATIVA PRODUÇÃO
 --------------------------------------------------------------------------------------------------------------------------
 */
  async desativar(req, res) {
    try {
      const { id } = req.params

      await Producao.update({ ativo: false }, { where: { id: id } })

      res.redirect('/producoes')
    } catch (error) {
      req.flash('msgErro', 'Falha no processamento da requisição' + error)
      res.redirect('/producoes')
    }

  },
  /*
 --------------------------------------------------------------------------------------------------------------------------
 RENDERIZAR O FORMULÁRIO DE EDIÇÃO
 --------------------------------------------------------------------------------------------------------------------------
 */
  async formEdit(req, res) {
    try {
      //pega o id
      const id = req.params.id
      //inicializa o array que receberá os dados tratados
      var result = []
      //busca dados pelo id
      const producoes = await Producao.findAll({
        where: { id: id },
        include: {
          association: 'produto',
        }
      }).then(res => {
        return res.map(row => {
          return row.dataValues
        })
      })

      producoes.forEach((valor, index) => {
        const dataFormatada = datefns.format(valor.data, "dd-MM-yyyy' 'HH:mm")
        const dataSeparada = datefns.format(valor.data, "yyyy-MM-dd")
        const horaSeparada = datefns.format(valor.data, "HH:mm")
        result[index] = {
          id: valor.id,
          qtd_planejada: valor.qtd_planejada,
          lote: valor.lote,
          data: dataFormatada,
          dataSeparada,
          horaSeparada,
          qtd_produzida: valor.qtd_produzida,
          qtd_defeito: valor.qtd_defeito,
          usuario_id: valor.usuario_id,
          produto_id: valor.produto.nome,
          status: valor.status
        }
      })

      const produtos = await Produto.findAll({
        where: {
          ativo: true
        }
      })

      res.render('producao/editar', { producao: result, produtos: produtos })
    } catch (error) {
      req.flash('msgErro', 'Falha no processamento da requisição' + error)
      res.redirect('/producoes')
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
    //inicializa o array que receberá os dados tratados
    var resultProducao = []
    var resultPausas = []
    try {
      //busca dados pelo id
      const producoes = await Producao.findAll({
        where: { id: id },
        include: [
          { association: 'produto' },
          { association: 'pausas' }
        ]
      }).then(res => {
        return res.map(row => {
          return row.dataValues
        })
      })
      producoes.forEach((valor, index) => {
        const dataFormatada = datefns.format(valor.data, "dd-MM-yyyy")
        const horaFormatada = datefns.format(valor.data, "HH:mm")
        resultProducao[index] = {
          id: valor.id,
          qtd_planejada: valor.qtd_planejada,
          lote: valor.lote,
          data: dataFormatada,
          hora: horaFormatada,
          qtd_produzida: valor.qtd_produzida,
          qtd_defeito: valor.qtd_defeito,
          usuario_id: valor.usuario_id,
          produto_id: valor.produto.nome,
          status: valor.status
        }
      })

      const pausas = await Pausa.findAll({ where: { ativo: true } }).then(res => {
        return res.map(row => {
          return row.dataValues
        })
      })
      pausas.forEach((valor, index) => {
        const inicioFormatado = datefns.format(valor.inicio, "HH:mm")
        const fimFormatado = datefns.format(valor.fim, "HH:mm")
        const duracao = datefns.formatDistanceStrict(valor.inicio, valor.fim, { locale: ptBR })
        resultPausas[index] = {
          id: valor.id,
          nome: valor.nome,
          inicio: inicioFormatado,
          fim: fimFormatado,
          duracao
        }
      })
      console.log(producoes)
      res.render('producao/atribuir', { producao: producoes, pausas: resultPausas })
    } catch (erro) {
      req.flash('msgErro', 'Falha no processamento da requisição  ' + erro)
      res.redirect('/producoes')
    }
  },

  async atribuirPausa(req, res) {
    const { id } = req.params
    const { pausa_id } = req.body
    console.log(pausa_id, id)
    const producao = await Producao.findByPk(id)
    const pausa = await Pausa.findByPk(pausa_id)

    await producao.addPausa(pausa)

    res.redirect(`/producao/atribuir_pausas/${id}`)

  },

  async excluirAtribuicao(req, res) {
    const { id_producao } = req.query
    const { id_pausa } = req.query

    const producao = await Producao.findByPk(id_producao)
    const pausa = await Pausa.findByPk(id_pausa)

    await producao.removePausa(pausa)

    res.redirect(`/producao/atribuir_pausas/${id_producao}`)
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
        where: {
          lote: { [Op.eq]: 004 }
        },
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

