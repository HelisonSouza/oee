const Usuario = require('../models/Usuario');
const Validacoes = require('../validators/validacoes')
const validar = new Validacoes()
const { Op } = require('sequelize');
const jwt = require('jsonwebtoken')
const secret = require('../config/chave.json')
const bcrypt = require('bcryptjs')


module.exports = {
  /*
  --------------------------------------------------------------------------------------------------------------------------
  RENDER FORM LOGIN
  --------------------------------------------------------------------------------------------------------------------------
  */
  async renderLogin(req, res) {
    try {
      return res.render('login/login')
    } catch (error) {
      req.flash('msgErro', 'Página não incontrada' + error)
      res.redirect('home/pag404')
    }
  },
  /*
  --------------------------------------------------------------------------------------------------------------------------
  EXECUTA O LOGIN
  --------------------------------------------------------------------------------------------------------------------------
  */
  async login(req, res) {
    //pegas os dados da requisição
    const { email, senha } = req.body
    try {
      //verificações de Autenticação

      //Usuário com email cadastrado
      const usuario = await Usuario.findOne({
        where: {
          email: email,
          ativo: true
        }
      })

      if (!usuario) {
        req.flash('msgErro', 'Dados inválidos!')
        res.redirect('/login')
      } else if (bcrypt.compareSync(senha, usuario.senha) === false) {
        console.log('Senha não passou')
        req.flash('msgErro', 'Dados inválidos SENHA!')
        res.redirect('/login')
      } else {
        //Cria o token de autorização passando os dados para o payload
        const token = jwt.sign({
          usuario: {
            id: usuario.id,
            nome: usuario.nome,
            email: usuario.email,
            tipo: usuario.tipo
          }
        }, secret.segredo, { expiresIn: '24h' })
        //grava o tokem na sessão e retorna a home
        req.session.token = { 'token': token }
        res.render('home/index', { token: token })
      }
    } catch (error) {
      req.flash('msgErro', 'Dados inválidos' + error)
      res.redirect('/login')
    }
  },
  /*
  --------------------------------------------------------------------------------------------------------------------------
  CADASTRAR 
  --------------------------------------------------------------------------------------------------------------------------
  */
  async criar(req, res) {
    //pega os dados do corpo da requisição
    const { nome, email, senha, tipo } = req.body

    //Validações
    validar.isRequired(nome, '   Nome não informado')
    validar.isValid(nome, '   Nome inválido ')
    validar.hasMinLen(nome, 2, '   Nome muito curto ')
    validar.isEmail(email, '   E-mail inválido')
    validar.isRequired(senha, '   Senha inválido ')
    validar.hasMinLen(senha, 4, '   Senha muito curta ')
    validar.isRequired(tipo, '   Tipo de permisão não informada ')

    if (!validar.isValid()) {
      const erros = validar.errors()
      erros.forEach((value) => {
        req.flash('msgErro', `${value.message}`)
      })
      res.redirect('/usuarios')
    } else {
      if (tipo === 'Operador' || tipo === 'Administrador' || tipo === 'Gestor' || tipo === 'PCP') {

        try {
          //Verifica se o usuário já está cadastrado
          const usuario = await Usuario.count({
            where: {
              email: {
                [Op.eq]: email
              }
            }
          })
          if (usuario !== 0) {
            req.flash('msgErro', 'Usuário já cadastrado')
            res.redirect('/usuarios')
          } else {
            //criptografa a senha
            const salt = bcrypt.genSaltSync(10)
            const hash = bcrypt.hashSync(senha, salt)
            console.log(hash)
            //Criar novo usuário
            const usuario = await Usuario.create({
              nome,
              email,
              senha: hash,
              tipo
            })
            req.flash('msgSucesso', 'Usuário cadastrado!')
            return res.redirect('/usuarios')
          }
        } catch (err) {
          req.flash('msgErro', 'Erro no processamento da requisição, tente novamente!' + err)
          res.redirect('/usuarios')
        }
      } else {
        req.flash('msgErro', 'Tipo de permissão inválida!')
        res.redirect('/usuarios')
      }
    }

  },
  /*
   --------------------------------------------------------------------------------------------------------------------------
    LISTAR
   --------------------------------------------------------------------------------------------------------------------------
  */
  async listar(req, res) {
    try {
      const usuarios = await Usuario.findAll({ where: { ativo: true } })
      return res.render('usuario/usuarios', { usuarios: usuarios })
    } catch (error) {
      req.flash('msgErro', 'Erro no processamento da requisição, tente novamente!' + error)
      res.redirect('/usuarios')
    }
  },
  /*
   --------------------------------------------------------------------------------------------------------------------------
    RENDER FORM EDITAR
   --------------------------------------------------------------------------------------------------------------------------
  */
  async render(req, res) {
    const id = req.params.id
    try {
      const usuario = await Usuario.findByPk(id)
      if (usuario === null) {
        req.flash('msgErro', 'Usuário inválido')
        res.redirect('/usuarios')
      } else {
        res.render('usuario/editar', { usuario: usuario })
      }
    } catch (error) {
      req.flash('msgErro', 'Página não incontrada' + error)
      res.redirect('home/pag404')
    }
  },
  /*
   --------------------------------------------------------------------------------------------------------------------------
    EDITAR
   --------------------------------------------------------------------------------------------------------------------------
  */
  async editar(req, res) {
    //pega os dados do corpo da requisição
    const { nome, email, senha, tipo } = req.body
    const { id } = req.params

    //Validações
    validar.isRequired(nome, '   Nome não informado')
    validar.isValid(nome, '   Nome inválido ')
    validar.hasMinLen(nome, 2, '   Nome muito curto ')
    validar.isEmail(email, '   E-mail inválido')
    validar.isRequired(senha, '   Senha inválido ')
    validar.hasMinLen(senha, 4, '   Senha muito curta ')
    validar.isRequired(tipo, '   Tipo de permisão não informada ')

    if (!validar.isValid()) {
      const erros = validar.errors()
      erros.forEach((value) => {
        console.log(value.message)
        req.flash('msgErro', `${value.message}`)
      })
      res.redirect('/usuarios')
    } else {
      if (tipo === 'Operador' || tipo === 'Administrador' || tipo === 'Gestor' || tipo === 'PCP') {

        try {
          //Verifica se o usuário existe
          const usuario = await Usuario.count({
            where: {
              id: {
                [Op.eq]: id
              }
            }
          })
          console.log(usuario)
          if (usuario !== 1) {
            req.flash('msgErro', 'Usuário inválido')
            res.redirect('/usuarios')
          } else {
            //Edita usuário
            const usuario = await Usuario.update({
              nome,
              email,
              senha,
              tipo
            }, { where: { id: id } })
            req.flash('msgSucesso', 'Usuário editado com sucesso')
            res.redirect('/usuarios')
          }
        } catch (err) {

          req.flash('msgErro', 'Erro no processamento da requisição, tente novamente!' + err)
          res.redirect('/usuarios')
        }

      } else {

        req.flash('msgErro', 'Tipo de permissão inválida!')
        res.redirect('/usuarios')
      }
    }

  },
  /*
   --------------------------------------------------------------------------------------------------------------------------
    DESATIVAR
   --------------------------------------------------------------------------------------------------------------------------
  */
  async desativar(req, res) {
    const id = req.params.id

    // validações 
    validar.isRequired(id, 'Usuário inválido ')
    // Se os dados forem inválidos, retorna com a mensagem do erro
    if (!validar.isValid()) {
      const erros = validar.errors()
      erros.forEach((value) => {

        req.flash('msgErro', `${value.message}`)
      })
      res.redirect('/usuarios')

    } else {
      // Passou nas validações
      try {
        //busca dados pelo id
        const usuario = await Usuario.count({
          where: {
            id: {
              [Op.eq]: id
            }
          }
        })

        if (usuario !== 1) {
          req.flash('msgErro', 'Usuário inválido')
          res.redirect('/usuarios')
        } else {
          //Edita usuário
          await Usuario.update({
            ativo: false
          }, { where: { id: id } })
          req.flash('msgSucesso', 'O usuário foi desativado')
          res.redirect('/usuarios')
        }
      } catch {
        req.flash('msgErro', 'Falha no processamento da requisição')
        res.redirect('/usuarios')
      }
    }
  }

}