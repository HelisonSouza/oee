const Producao = require('../models/Producao');
const datefns = require('date-fns');
const { Op } = require('sequelize');

module.exports = {
  async busca(req, res) {
    //buscar as ultimas produções 

    const dados = await Producao.findAll({
      where: {
        data: {
          [Op.gte]: new Date()
        }
      }

    })

    res.render('operacao/operacao', { operacao: dados })

    /*const datas = inicios.map(valor => {
      const corrigido = datefns.format(valor.data, 'dd-MM-yyyy')
      return corrigido
    })
    console.log(datas)
    return res.json(datas)*/
  },
  async start(req, res) {
    return res.render('operacao/start')
  }
}