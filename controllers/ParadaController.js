const Parada = require('../models/Parada');
const Motivo = require('../models/Motivo');
const { Op } = require('sequelize');
const datefns = require('date-fns');
const { endOfDecadeWithOptions } = require('date-fns/fp');
const { ptBR } = require('date-fns/locale');
const Usuario = require('../models/Usuario');
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

module.exports = {
  async criar(req, res) {
    const { inicio } = req.body
    const fim = inicio
    const usuario_id = 1
    const motivo_id = 1

    const parada = await Parada.create({
      inicio,
      fim,
      usuario: usuario_id,
      motivo: motivo_id
    })

    return res.json(parada)
  },

  async listar(req, res) {
    const paradas = await Parada.findAll({
      where: { identificada: false }
    })

    var results = []
    let fimFormat
    let duracao

    if (paradas) {
      console.log(paradas)
      paradas.forEach((valor, index) => {
        const inicioFormat = datefns.format(valor.inicio, "HH:mm")
        if (valor.fim) {
          fimFormat = datefns.format(valor.fim, "HH:mm")
          duracao = datefns.formatDistanceStrict(valor.inicio, valor.fim, { locale: ptBR })
        } else {
          fimFormat = "--:--"
          duracao = "--:--"
        }

        if (duracao === "") duracao = "00:00"

        results[index] = {
          id: valor.id,
          inicio: inicioFormat,
          fim: fimFormat,
          duracao: duracao
        }
      })

    }
    const motivos = await Motivo.findAll({ where: { ativo: true } })
    res.render('paradas/listar', { paradas: results, motivos: motivos })
  },

  async atribuirMotivo(req, res) {
    try {
      const id_parada = req.params.id
      const id_motivo = req.query.motivo
      if (id_motivo == 1) {
        req.flash('msgErro', 'Selecione um motivo para atribuir a parada')
        res.redirect('/paradas')
      } else {
        await Parada.update({
          motivo_id: id_motivo,
          identificada: true
        }, {
          where: { id: id_parada }
        })
        //console.log(motivo)
        req.flash('msgSucesso', `A parada com Id ${id_parada} identificada com sucesso.`)
        res.redirect('/paradas')
      }
    } catch (error) {
      req.flash('msgErro', 'Erro ao atribuir motivo a parada!' + error)
      res.redirect('/paradas')
    }

  },

  async relatorios(req, res) {
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
        motivo = '',
        producao = '',
        page = 1,
        limit = 10,
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

      queryConsulta = { start, end, motivo, producao, page, limit }

      const paradas = await Parada.findAll({
        where: {
          createdAt: { [Op.between]: [start, end] },
          producao_id: { [Op.like]: `%${producao}%` },
        },
        limit,
        offset: page * limit,
        include: {
          association: 'motivo',
        },
      })

      let results = []
      paradas.forEach((valor, index) => {
        let fimFormat
        let duracao
        const inicioFormat = datefns.format(valor.inicio, "dd/MM/yyyy'  'HH:mm")
        if (valor.fim) {
          fimFormat = datefns.format(valor.fim, "dd/MM/yyyy'  'HH:mm")
          duracao = datefns.formatDistanceStrict(valor.inicio, valor.fim, { locale: ptBR })
        }

        let fim = fimFormat ? fimFormat : '--:--'

        results[index] = {
          producao: valor.producao_id,
          id: valor.id,
          inicio: inicioFormat,
          fim: fim,
          duracao: duracao,
          motivo: valor.motivo.descricao,

        }
      })

      let queryString = {
        start: datefns.format(new Date(start), "dd/MM/yyyy", { locale: ptBR }),
        end: datefns.format(new Date(end), "dd/MM/yyyy", { locale: ptBR }),
        motivo: motivo,
        producao: producao
      }

      res.render('paradas/relatorios', { paradas: results, query: queryString })
    } catch (erro) {
      req.flash('msgErro', 'Falha no processamento da requisição' + erro)
      res.redirect('/paradas')
    }
  },



  //==================================================================================



  async relatorio(req, res) {
    console.log(queryConsulta)
    //incializa as variáveis de consulta
    let start = queryConsulta.start
    let end = queryConsulta.end
    let producao = queryConsulta.producao
    let results = []

    //Gera as strings de auxilio
    let srtStart = datefns.format(new Date(start), "dd/MM/yyyy", { locale: ptBR })
    let strEnd = datefns.format(new Date(end), "dd/MM/yyyy", { locale: ptBR })

    //Executa consulta
    const paradas = await Parada.findAll({
      where: {
        createdAt: { [Op.between]: [start, end] },
        producao_id: { [Op.like]: `%${producao}%` },
      },
      limit: 10,
      include: {
        association: 'motivo',
      },
    })

    paradas.forEach((valor, index) => {
      let fimFormat
      let duracao
      const inicioFormat = datefns.format(valor.inicio, "dd/MM/yyyy'  'HH:mm")
      if (valor.fim) {
        fimFormat = datefns.format(valor.fim, "dd/MM/yyyy'  'HH:mm")
        duracao = datefns.formatDistanceStrict(valor.inicio, valor.fim, { locale: ptBR })
      }

      let fim = fimFormat ? fimFormat : '--:--'

      //console.log(results)

      results[index] = {
        id: valor.id,
        producao: (valor.producao_id ? valor.producao_id : '--'),
        inicio: (inicioFormat ? inicioFormat : '--'),
        fim: (fim ? fim : '--'),
        duracao: (duracao ? duracao : '--'),
        motivo: (valor.motivo.descricao ? valor.motivo.descricao : '--'),
      }
    })

    //gerando linhas dinâmicas na tabela
    const cows = ['id', 'Producao', 'Inicio', 'Fim', 'Duração', 'Motivo']
    const title = {
      text: "Relatório de Produções",
      style: {
        fontSize: 14,
      }
    }

    const descricao = {
      text: `Praradas de ${srtStart}, até ${strEnd}`,
      style: {
        fontSize: 10,
      }
    }

    //Inserindo os dados nas linhas
    let linhas = []

    results.forEach((valor, i) => {
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
            widths: [25, 60, '*', '*', '*', 150],
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
    pdf.pipe(fs.createWriteStream(path.resolve(`public/relatorios/Relatório de Paradas - ${carimbo}.pdf`)))
    pdf.end()

    res.redirect('/paradas/relatorios')
  }
}