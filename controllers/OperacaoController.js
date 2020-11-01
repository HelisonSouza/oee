const Producao = require('../models/Producao');
const datefns = require('date-fns');
const { Op } = require('sequelize');
const { io } = require('../app')

module.exports = {
  async busca(req, res) {
    //buscar as ultimas produções 
    const producao = await Producao.findAll({
      where: {
        data: {
          [Op.gte]: new Date()
        }
      }

    })
    //grava em uma sessão 

    res.render('operacao/operacao', { operacao: producao })

    /*const datas = inicios.map(valor => {
      const corrigido = datefns.format(valor.data, 'dd-MM-yyyy')
      return corrigido
    })
    console.log(datas)
    return res.json(datas)*/
  },
  async start(req, res) {
    return res.render('operacao/start')
  },
  async startId(req, res) {
    const { id } = req.params
    const producao = await Producao.findByPk(id)

    req.session.producao = producao
    res.render('operacao/start', { producao, producao })
  }

}
