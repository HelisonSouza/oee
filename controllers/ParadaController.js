const Parada = require('../models/Parada');
const Motivo = require('../models/Motivo');
const { Op } = require('sequelize');
const datefns = require('date-fns');
const { endOfDecadeWithOptions } = require('date-fns/fp');
const { ptBR } = require('date-fns/locale');

module.exports = {
  async criar(req, res) {
    const { inicio } = req.body
    const fim = inicio
    const usuario_id = 1
    const motivo_id = 1

    const parada = await Parada.create({
      inicio,
      fim,
      usuario: usuario_id,
      motivo: motivo_id
    })

    return res.json(parada)
  },

  async listar(req, res) {
    const paradas = await Parada.findAll({ where: { identificada: false } })
    var retorno = []
    paradas.forEach((valor, index) => {
      const newInicio = datefns.format(valor.inicio, "dd/MM/yyyy' 'HH:mm:ss", { locale: ptBR })
      const newFim = datefns.format(valor.fim, "dd/MM/yyyy' 'HH:mm:ss", { locale: ptBR })
      const intervalo = datefns.intervalToDuration({ start: valor.inicio, end: valor.fim })
      let intervaloFormatado = datefns.formatDuration(intervalo, { locale: ptBR })

      if (intervaloFormatado === "") intervaloFormatado = "00:00"

      retorno[index] = {
        id: valor.id,
        inicio: newInicio,
        fim: newFim,
        duracao: intervaloFormatado
      }
    })
    const motivos = await Motivo.findAll({ where: { ativo: true } })
    res.render('paradas/listar', { paradas: retorno, motivos })
  },

  async atribuirMotivo(req, res) {
    const { parada } = req.body
    const descricaoMotivo = req.body.motivo
    try {
      //busca o motivo que tem a descrição recebida
      const motivo = await Motivo.findOne({ where: { descricao: descricaoMotivo } })

      await Parada.update({ motivo_id: motivo.id, identificada: true }, { where: { id: parada } })
      //console.log(motivo)
      req.flash('msgSucesso', `A parada com Id ${parada} recebeu o motivo = ${descricaoMotivo}`)
      res.redirect('/paradas')

    } catch (error) {
      req.flash('msgErro', 'Erro ao atribuir motivo a parada!' + error)
      res.redirect('/paradas')
    }

  },

  async relatorios(req, res) {
    try {
      const paradas = await Parada.findAll({
        where: {
          motivo_id: {
            [Op.eq]: 4
          }
        },
        include: [
          { association: 'motivo' },
          { association: 'usuario' }
        ]
      })
      console.log(paradas)
      let results = []
      paradas.forEach((valor, index) => {
        const inicioFormat = datefns.format(valor.inicio, "dd/MM/yyyy'  'HH:mm")
        const fimFormat = datefns.format(valor.fim, "dd/MM/yyyy'  'HH:mm")
        const duracao = datefns.formatDistanceStrict(valor.inicio, valor.fim, { locale: ptBR })

        results[index] = {
          id: valor.id,
          inicio: inicioFormat,
          fim: fimFormat,
          duracao: duracao,
          usuario: valor.usuario.nome,
          motivo: valor.motivo.descricao,

        }
        //console.log(results)
      })
      return res.render('paradas/relatorios', { paradas: results })
    } catch (erro) {
      req.flash('msgErro', 'Falha no processamento da requisição' + erro)
      res.redirect('/paradas')
    }
  },
}