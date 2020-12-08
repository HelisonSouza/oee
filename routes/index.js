const express = require('express')
const routes = express.Router()
const Producao = require('../models/Producao');
const Parada = require('../models/Parada');
const datefns = require('date-fns');
const { ptBR } = require('date-fns/locale');
const { Op } = require('sequelize');

routes.get('/', async (req, res) => {
  try {

    let data = new Date()

    let mesAtual = data.getMonth() + 1
    let anoAtual = data.getFullYear()

    const { mes = mesAtual } = req.query
    const { ano = anoAtual } = req.query

    if (req.query.mes)
      data.setMonth(mes - 1)

    if (req.query.ano)
      data.setFullYear(ano)

    let inicioDoMes = datefns.startOfMonth(data)
    let fimDoMes = datefns.addDays(inicioDoMes, 31)

    const producoes = await Producao.findAll({
      where: {
        data: { [Op.between]: [inicioDoMes, fimDoMes] },
        status: "finalizada"
      },
      attributes: [
        'id',
        'data',
        'qtd_planejada',
        'qtd_produzida',
        'qtd_defeito',
        'velocidade_media',
        'produto_id'
      ],
      include: {
        association: 'paradas',
        attributes: ['id', 'inicio', 'fim'],
      },
    })

    //console.log(producoes)

    let oee = []
    let performance = 0
    let performanceDasProducoes = []
    let disponibilidade = []
    let qualidade = []
    let kpi = {
      oee,
      performance,
      disponibilidade,
      qualidade
    }
    let vn = 120



    producoes.forEach((producao, i) => {

      // CALCULA  Disponibilidade = B/A
      let duracaoDasParadas = [0] //recebe o valor em segundos da duração das paradas
      let tempoTotalDeParadas = 0
      if (producao.paradas) {
        producao.paradas.forEach((parada, i) => {
          if (parada.inicio & parada.fim)
            duracaoDasParadas[i] = datefns.differenceInSeconds(parada.fim, parada.inicio) //retorna nº da diferênça em segundos 
        })

        tempoTotalDeParadas = duracaoDasParadas.reduce( //retorna a soma os valores do array
          (tempoTotalDeParadas, duracao) => {
            return tempoTotalDeParadas + duracao
          }, 0
        )
      }

      let tempoProgramado = (producao.qtd_planejada / vn) * 60      // A em segundos  
      let tempoProduzindo = tempoProgramado - tempoTotalDeParadas   // B em segundos

      performanceDasProducoes[i] = parseInt((tempoProduzindo / tempoProgramado) * 100) //ex 98

    })

    performance = performanceDasProducoes.reduce(
      (performance, valores) => {
        return (performance + valores) / performanceDasProducoes.lenght
      }, 0
    )

    console.log(performanceDasProducoes)
    console.log(kpi)

    res.render('home/index', { kpi })
  } catch (error) {
    console.log(error)
  }
})

module.exports = routes;