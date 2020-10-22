const Producao = require('../models/Producao');
const datefns = require('date-fns');
const { sequelize } = require('../models/Producao');

module.exports = {
  async busca(req, res) {
    //buscar as ultimas produções 

    const inicios = await Producao.findAll({
      where: {
        data: { $gte: Date.now() },
      },
      limit: 1,
    })
    console.log(inicios)
    return res.json(inicios)
    //return res.render('operacao/operacao')

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