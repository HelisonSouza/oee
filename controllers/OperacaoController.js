const Producao = require('../models/Producao');
const Pausa = require('../models/Pausa');
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
        },
        status: {
          [Op.or]: [
            'planejada', 'executando'
          ]
        }
      },
      include: {
        association: 'produto',
      }
    })
    //console.log(producao)
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
  async painel(req, res) {
    return res.render('operacao/start')
  },

  // Inicializa uma produção pasando o ID
  async start(req, res) {
    const { id } = req.params                     //pega o ID
    await Producao.update(                        //altera o status da produção inicializada
      { status: "executando" },
      { where: { id: id } }
    )
    const producao = await Producao.findByPk(id, {
      include: [
        {
          association: 'produto',
          attributes: ['nome', 'velocidade']
        },
        {
          association: 'pausas',
          attributes: ['nome', 'inicio', 'fim'],
          through: {
            attributes: []
          }
        }
      ]
    })  //pega os dados

    req.session.producao = producao               //grava na sessão PRODUÇÃO
    res.render('operacao/start')                  //rederiza a view do painel 
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
        },
        include: {
          association: 'produto',
        }
      })
      console.log(executadas)
      //Trata os campos de data
      var retorno = []
      executadas.forEach((valor, index) => {
        const inicioFormatado = datefns.formatDistanceToNow(valor.data, { locale: ptBR })
        const fimFormatado = datefns.formatDistanceToNow(datefns.parseISO(valor.finalizadaEm), { locale: ptBR })

        //let intervaloFormatado = datefns.formatDuration(intervalo, { locale: ptBR })

        retorno[index] = {
          id: valor.id,
          data: inicioFormatado,
          finalizadaEm: fimFormatado,
          lote: valor.lote,
          produto_id: valor.produto.nome,
          qtd_produzida: valor.qtd_produzida,
          qtd_defeito: valor.qtd_defeito
        }
      })
      console.log(retorno)
      res.render('operacao/executadas', { executadas: retorno })
    } catch (error) {
      req.flash('msgErro', 'Erro de processamento da requisição!' + error)
      res.redirect('/')
    }
  }

}
