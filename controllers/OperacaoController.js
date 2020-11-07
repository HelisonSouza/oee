const Producao = require('../models/Producao');
const { Op } = require('sequelize');

const datefns = require('date-fns');
const { endOfDecadeWithOptions } = require('date-fns/fp');
const { ptBR } = require('date-fns/locale');


module.exports = {
  async busca(req, res) {
    //buscar as ultimas produções 
    const producao = await Producao.findAll({
      where: {
        data: {
          [Op.gte]: new Date()
        }
      },
      include: {
        association: 'produto',
      }
    })
    console.log(producao)
    //Trata os campos de data
    var retorno = []
    producao.forEach((valor, index) => {
      const inicioFormatado = datefns.formatDistanceToNow(valor.data, { locale: ptBR })

      //let intervaloFormatado = datefns.formatDuration(intervalo, { locale: ptBR })

      retorno[index] = {
        id: valor.id,
        lote: valor.lote,
        qtd_planejada: valor.qtd_planejada,
        produto: valor.produto.nome,
        data: inicioFormatado
      }
    })

    res.render('operacao/operacao', { operacao: retorno })

    /*const datas = inicios.map(valor => {
      const corrigido = datefns.format(valor.data, 'dd-MM-yyyy')
      return corrigido
    })
    console.log(datas)
    return res.json(datas)*/
  },

  /*
  --------------------------------------------------------------------------------------------------------------------------
  RENDERIZA VIEW START
  --------------------------------------------------------------------------------------------------------------------------
  */
  async start(req, res) {
    return res.render('operacao/start')
  },
  async startId(req, res) {
    const { id } = req.params
    const producao = await Producao.findByPk(id)

    req.session.producao = producao
    res.render('operacao/start')
  },

  /*
  --------------------------------------------------------------------------------------------------------------------------
  RETORNA AS PRODUÇÕES EXECUTADAS
  --------------------------------------------------------------------------------------------------------------------------
  */
  async getProducoesExecutadas(req, res) {
    try {
      const executadas = await Producao.findAll({
        where: {
          status: { [Op.eq]: 'finalizada' }
        }
      })
      //console.log(executadas)
      res.render('operacao/executadas', { executadas })
    } catch (error) {
      req.flash('msgErro', 'Erro de processamento da requisição!' + error)
      res.redirect('/')
    }
  }

}
