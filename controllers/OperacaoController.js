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
    //grava em uma sessão 
    req.session.sessProducoes = dados
    //com os dados da sessão -> função para contagem regressiva = 0

    //passar os dados da contagem zerada para o dashboard

    //res.render('operacao/operacao', { operacao: dados })

    if (req.session.sessProducoes) {
      const producao = req.session.sessProducoes
    }

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
  }

}
