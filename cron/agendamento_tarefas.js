const CronJob = require('cron').CronJob
const { format, formatDistance, isDate } = require('date-fns')
const modelProducao = require('../models/Producao');
const { Op } = require('sequelize');
var { varGlobal } = require('../helpers/global')

module.exports = {
  agendar: async (socket) => {
    //busca as produções cadastradas com data maior que agora....
    const producoes = await modelProducao.findAll({
      where: {
        data: {
          [Op.gte]: new Date()
        }
      }
    })

    let lista = []
    producoes.forEach((producao) => {
      let data = producao.dataValues.data
      //console.log(id, data)
      var job = new CronJob(data, () => {
        //função que o cron vai executar...
        socket.broadcast.emit('agendado', producao.dataValues)
        console.log("Agendado! ")
      })
      job.start()
      lista.push({
        producao: producao.dataValues,
        cron: job
      })
    })
    return lista
  }
}
