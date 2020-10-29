const CronJob = require('cron').CronJob
const { format, formatDistance, isDate } = require('date-fns')
const modelProducao = require('../models/Producao');
const { Op } = require('sequelize');

module.exports = {
  agendar: async () => {
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
        global.producaoRodano = producao.dataValues
        console.log(producaoRodano)
      })
      job.start()
      lista.push(job)
    })
    return lista
  }
}
