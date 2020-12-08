const Producao = require('../models/Producao');
const Produto = require('../models/Produto')
const Pausa = require('../models/Pausa');

const datefns = require('date-fns');
const { endOfDecadeWithOptions } = require('date-fns/fp');
const { ptBR } = require('date-fns/locale');
const Validacoes = require('../validators/validacoes');
const { Op } = require('sequelize');
const validar = new Validacoes()
const path = require('path')
const fs = require('fs')

const PdfPrinter = require('pdfmake')
const fonts = {
  Roboto: {
    normal: path.resolve('public/fonts/Roboto-Regular.ttf'),
    bold: path.resolve('public/fonts/Roboto-Bold.ttf'),
    italics: path.resolve('public/fonts/Roboto-Italic.ttf'),
    bolditalics: path.resolve('public/font/Roboto-BoldItalic.ttf')
  }
}

let queryConsulta = {}
const strRows = []

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
      let agora = new Date()
      let dataStart = datefns.subDays(agora, 30)
      let dataStartFormt = datefns.format(dataStart, "yyyy-MM-dd' 'HH:mm:ss", { locale: ptBR })
      let dataEnd = datefns.addDays(agora, 1)
      let dataEndFormat = datefns.format(dataEnd, "yyyy-MM-dd' 'HH:mm:ss", { locale: ptBR })

      let {
        start = dataStartFormt,
        end = dataEndFormat,
        status = "finalizada",
        page = 1,
        limit = 10,
        ativo = true
      } = req.query
      if (!start)
        start = dataStartFormt
      if (!end)
        end = dataEndFormat
      if (!limit)
        limit = 10
      if (!page)
        page = 1

      page = parseInt(page - 1)
      limit = parseInt(limit)

      queryConsulta = { start, end, status, page, limit, ativo }

      let { count: size, rows: producoes } = await Producao.findAndCountAll({
        where: {
          status,
          data: { [Op.between]: [start, end] },
          ativo
        },
        limit,
        offset: page * limit,
        include: {
          association: 'produto',
        }
      })
      if (producoes) {
        producoes.forEach((valor, index) => {
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
      }

      if (ativo) {
        ativo = "apenas produções ativas"
      } else {
        ativo = "apenas produções desativadas"
      }
      let queryString = {
        start: datefns.format(new Date(start), "dd/MM/yyyy", { locale: ptBR }),
        end: datefns.format(new Date(end), "dd/MM/yyyy", { locale: ptBR }),
        status,
        ativo: ativo
      }

      res.render('producao/relatorios', { producoes: result, query: queryString })
    } catch (erro) {
      req.flash('msgErro', 'Falha no processamento da requisição' + erro)
      res.redirect('/producoes')
    }
  },

  /*
  --------------------------------------------------------------------------------------------------------------------------
  RELATÓRIOS EM PDF
  --------------------------------------------------------------------------------------------------------------------------
  */
  async relatorios(req, res) {
    //incializa as variáveis de consulta
    let status = queryConsulta.status
    let start = queryConsulta.start
    let end = queryConsulta.end
    let ativo = queryConsulta.ativo
    let limit = queryConsulta.limit
    let page = queryConsulta.page
    let result = []
    //Gera as strings de auxilio
    let strStatus = status
    let srtStart = datefns.format(new Date(start), "dd/MM/yyyy", { locale: ptBR })
    let strEnd = datefns.format(new Date(end), "dd/MM/yyyy", { locale: ptBR })
    let strAtivo = ativo ? 'ativas' : 'desativadas'

    //Executa a consulta
    let { count: size, rows: producoes } = await Producao.findAndCountAll({
      where: {
        status: status,
        data: { [Op.between]: [start, end] },
        ativo
      },
      limit,
      offset: page * limit,
      include: {
        association: 'produto',
      }
    })
    if (producoes) {
      producoes.forEach((valor, index) => {
        const newDate = datefns.format(valor.data, "dd-MM-yyyy' 'HH:mm")
        let id = valor.id.toString()
        let inicio = newDate.toString()
        let lote = valor.lote.toString()
        let produto = valor.produto.nome.toString()
        let planejada = valor.qtd_planejada.toString()
        let produzida = valor.qtd_produzida.toString()
        let defeito = valor.qtd_defeito.toString()

        result[index] = {
          id,
          inicio,
          lote,
          produto,
          planejada,
          produzida,
          defeito,
        }
      })
    }


    //gerando linhas dinâmicas na tabela
    const cows = ['id', 'Data de Inicio', 'Lote', 'Produto', 'Planejado', 'Produzido', 'Defeito']
    const title = {
      text: "Relatório de Produções",
      style: {
        fontSize: 14,
      }
    }

    const descricao = {
      text: `Produções de ${srtStart}, até ${strEnd}, com situação ${strStatus}, incluindo apenas produções ${strAtivo}`,
      style: {
        fontSize: 10,
      }
    }

    //Inserindo os dados nas linhas
    let linhas = []
    console.log(result)


    result.forEach((valor, i) => {
      let values = Object.values(valor)
      linhas[i] = values
    });

    linhas.unshift(cows)

    const printer = new PdfPrinter(fonts)

    //Definição descritiva do relatório
    const docDefiniton = {
      content: [
        {
          image: path.resolve('public/img/logo.png'),
          fit: [100, 100],
        },
        { text: title },
        { text: descricao },

        {
          table: {
            widths: [30, 100, '*', '*', '*', '*', '*'],
            body: linhas
          }
        }
      ],
      styles: {
        header: {
          fontSize: 14,
        }
      },
      footer: (page, pages) => {
        return {
          columns: [
            'Relatório com dados do sistema Radar 4.0',
            {
              alignment: 'right',
              text: [
                { text: page.toString(), italics: true },
                ' de ',
                { text: pages.toString(), italics: true },
              ]
            }
          ],
          margin: [40, 0]
        }
      }
    }

    let dataAgora = new Date()
    let carimbo = datefns.getTime(dataAgora)

    const pdf = printer.createPdfKitDocument(docDefiniton)
    pdf.pipe(fs.createWriteStream(path.resolve(`public/relatorios/Relatório de Producao - ${carimbo}.pdf`)))
    pdf.end()

    /*
    const pdf = await printer.createPdfKitDocument(
      { content: "Olá Teste pdf" }
      )
    res.header('Content-disposition', 'inline; filename=Relatório.pdf')
    res.header('Content-type', 'aplication/pdf')
    await pdf.pipe(res)
    pdf.end*/

    res.redirect('/producao/relatorios')
  },

}

