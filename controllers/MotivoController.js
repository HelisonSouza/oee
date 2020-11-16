const Motivo = require('../models/Motivo');
const { Op } = require('sequelize');
const Validacoes = require('../validators/validacoes')
const validar = new Validacoes()
const datefns = require('date-fns');

module.exports = {
  async criar(req, res) {
    try {
      //pega os dados da requisição
      const { descricao } = req.body

      //Validações
      validar.isRequired(descricao, '   Descrição não informada')
      validar.isValid(descricao, '   Descrição inválida ')
      validar.hasMinLen(descricao, 4, '   Descrição muito curta ')

      if (!validar.isValid()) {
        const erros = validar.errors()
        erros.forEach((value) => {
          req.flash('msgErro', `${value.message}`)
        })
        res.redirect('/motivos')
      } else {
        //cadastra um novo motivo
        const motivos = await Motivo.create({ descricao: descricao })
        return res.redirect('/motivos')
      }
    } catch (error) {
      req.flash('msgErro', 'Erro de processamento da requisição!' + error)
      res.redirect('/')
    }
  },

  async listar(req, res) {
    try {
      const motivos = await Motivo.findAll({ where: { ativo: true } })
      res.render('motivos/motivo', { motivos })
    } catch (error) {
      req.flash('msgErro', 'Erro de processamento da requisição!' + error)
      res.redirect('/')
    }
  },

  async renderEditar(req, res) {
    //pega os dados
    const { id } = req.params
    try {
      let motivo = await Motivo.findByPk(id, { where: { ativo: true } })
      //console.log(motivo)
      res.render('motivos/editaMotivo', { motivo })

    } catch (error) {
      req.flash('msgErro', 'Erro ao editar motivo de parada!' + error)
      res.redirect('/')
    }
  },

  async editar(req, res) {
    try {
      //pega os dados da requisição
      const { descricao } = req.body
      const { id } = req.params

      //Validações
      validar.isRequired(descricao, '   Descrição não informada')
      validar.isRequired(id, '   Descrição invalida')
      validar.isValid(descricao, '   Descrição inválida ')
      validar.hasMinLen(descricao, 4, '   Descrição muito curta ')

      if (!validar.isValid()) {
        const erros = validar.errors()
        erros.forEach((value) => {
          req.flash('msgErro', `${value.message}`)
        })
        res.redirect('/motivos')
      } else {
        //edita o motivo
        const motivos = await Motivo.update({ descricao: descricao }, { where: { id: id } })
        req.flash('msgSucesso', 'Dados editados com sucesso')
        return res.redirect('/motivos')
      }
    } catch (error) {
      req.flash('msgErro', 'Erro de processamento da requisição!' + error)
      res.redirect('/')
    }
  },

  async desativar(req, res) {
    //pega os dados
    const { id } = req.params
    try {
      await Motivo.update({ ativo: false }, { where: { id: id } })
      req.flash('msgSucesso', 'Desativado com sucesso')
      res.redirect('/motivos')
    } catch (error) {
      req.flash('msgErro', 'Erro ao editar motivo de parada!   ' + error)
      res.redirect('/')
    }
  },
  async renderRelatorios(req, res) {
    try {
      var result = []
      const motivos = await Motivo.findAll({
        where: {
          descricao: {
            [Op.like]: '%Falta%'
          }
        }
      }).then((dados) => {
        //console.log('Dados---->   ' + dados)
        dados.forEach((valor, index) => {
          const cadastro = datefns.format(valor.createdAt, "dd-MM-yyyy' 'HH:mm")
          let status = "Ativo"
          if (valor.ativo === false) {
            status = "Desativado"
          }
          result[index] = {
            id: valor.id,
            descricao: valor.descricao,
            cadastradoEm: cadastro,
            ativo: status
          }
        })
      })
      //console.log("Result  --->  " + result)
      res.render('motivos/relatorios', { motivos: result })
    } catch (erro) {
      req.flash('msgErro', 'Falha no processamento da requisição' + erro)
      res.redirect('/motivos')
    }

  },
  async relatorioPrincipaisMotivos(req, res) {
    try {
      var result = []
      const motivos = await Motivo.findAll().then((dados) => {
        dados.forEach((valor, index) => {
          const cadastro = datefns.format(valor.createdAt, "dd-MM-yyyy' 'HH:mm")
          let status = "Ativo"
          if (valor.ativo === false) {
            status = "Desativado"
          }
          result[index] = {
            id: valor.id,
            descricao: valor.descricao,
            cadastradoEm: cadastro,
            ativo: status
          }
        })
      })
      console.log(result)
      res.render('motivos/principais', { motivos: result })
    } catch (erro) {
      req.flash('msgErro', 'Falha no processamento da requisição' + erro)
      res.redirect('/motivos')
    }

  },
}


