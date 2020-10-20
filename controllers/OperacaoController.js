const Producao = require('../models/Producao');
const datefns = require('date-fns');
const { sequelize } = require('../models/Producao');

module.exports = {
  async busca(req, res) {
    //const inicios = await Producao.findAll({attributes: ['data']})
    /*const inicios = await Producao.findAll({
      where: {
        data: { $eq: new Date() },
      },
      limit: 1,
    })
    */
    return res.render('operacao/operacao')


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