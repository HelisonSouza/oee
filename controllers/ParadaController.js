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
    const paradas = await Parada.findAll({
      where: { identificada: false }
    })

    var results = []
    let fimFormat
    let duracao

    if (paradas) {
      console.log(paradas)
      paradas.forEach((valor, index) => {
        const inicioFormat = datefns.format(valor.inicio, "HH:mm")
        if (valor.fim) {
          fimFormat = datefns.format(valor.fim, "HH:mm")
          duracao = datefns.formatDistanceStrict(valor.inicio, valor.fim, { locale: ptBR })
        } else {
          fimFormat = "--:--"
          duracao = "--:--"
        }

        if (duracao === "") duracao = "00:00"

        results[index] = {
          id: valor.id,
          inicio: inicioFormat,
          fim: fimFormat,
          duracao: duracao
        }
      })

    }
    const motivos = await Motivo.findAll({ where: { ativo: true } })
    res.render('paradas/listar', { paradas: results, motivos: motivos })
  },

  async atribuirMotivo(req, res) {
    try {
      const id_parada = req.params.id
      const id_motivo = req.query.motivo
      if (id_motivo == 1) {
        req.flash('msgErro', 'Selecione um motivo para atribuir a parada')
        res.redirect('/paradas')
      } else {
        await Parada.update({
          motivo_id: id_motivo,
          identificada: true
        }, {
          where: { id: id_parada }
        })
        //console.log(motivo)
        req.flash('msgSucesso', `A parada com Id ${id_parada} identificada com sucesso.`)
        res.redirect('/paradas')
      }
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