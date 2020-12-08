const jwt = require('jsonwebtoken')
const configAutenticacao = require('../config/chave.json')

//middleware para verificar se a autenticação está válida
module.exports = {
    isAdm: (req, res, next) => {
        try {
            //pega o o token da sessão 
            const token = req.session.token.token
            //verifica se o token foi informado
            if (!token) {
                req.flash('msgErro', 'Token de autorização não informado')
                res.redirect('/login')
            }

            //verificação pesada do token
            const payload = jwt.verify(token, configAutenticacao.segredo, (err, decoded) => {
                if (err) {
                    req.flash('msgErro', 'Precisa de autorização')
                    res.redirect('/login')
                }
                if (decoded.usuario.tipo === 'Administrador') {
                    return next();
                } else {
                    req.flash('msgErro', 'Usuário logado não tem permissão para acessar esta parte do sistema!')
                    res.redirect('/index')
                }

            })
        } catch (error) {
            req.flash('msgErro', 'Token de autorização não informado, execute o login! ')
            res.redirect('/login')
        }
    },
    isPcp: (req, res, next) => {
        try {
            //pega o o token da sessão 
            const token = req.session.token.token || null
            //verifica se o token foi informado
            if (!token) {
                req.flash('msgErro', 'Token de autorização não informado')
                res.redirect('/login')
            }

            //verificação pesada do token
            const payload = jwt.verify(token, configAutenticacao.segredo, (err, decoded) => {
                if (err) {
                    req.flash('msgErro', 'Precisa de autorização')
                    res.redirect('/login')
                }
                if (decoded.usuario.tipo === 'PCP') {
                    return next();
                } else {
                    req.flash('msgErro', 'Usuário logado não tem permissão para acessar esta parte do sistema!')
                    res.redirect('/index')
                }

            })
        } catch (error) {
            req.flash('msgErro', 'Token de autorização não informado, execute o login! ')
            res.redirect('/login')
        }
    },
    isGestor: (req, res, next) => {
        try {
            //pega o o token da sessão 
            const token = req.session.token.token || null
            //verifica se o token foi informado
            if (!token) {
                req.flash('msgErro', 'Token de autorização não informado')
                res.redirect('/login')
            }

            //verificação pesada do token
            const payload = jwt.verify(token, configAutenticacao.segredo, (err, decoded) => {
                if (err) {
                    req.flash('msgErro', 'Precisa de autorização')
                    res.redirect('/login')
                }
                if (decoded.usuario.tipo === 'Gestor') {
                    return next();
                } else {
                    req.flash('msgErro', 'Usuário logado não tem permissão para acessar esta parte do sistema!')
                    res.redirect('/index')
                }

            })
        } catch (error) {
            req.flash('msgErro', 'Token de autorização não informado, execute o login! ')
            res.redirect('/login')
        }
    },
    isOperador: (req, res, next) => {
        try {
            //pega o o token da sessão 
            const token = req.session.token.token || null
            //verifica se o token foi informado
            if (!token) {
                req.flash('msgErro', 'Token de autorização não informado')
                res.redirect('/login')
            }

            //verificação pesada do token
            const payload = jwt.verify(token, configAutenticacao.segredo, (err, decoded) => {
                if (err) {
                    req.flash('msgErro', 'Precisa de autorização')
                    res.redirect('/login')
                }
                if (decoded.usuario.tipo === 'Operador') {
                    return next();
                } else {
                    req.flash('msgErro', 'Usuário logado não tem permissão para acessar esta parte do sistema!')
                    res.redirect('/index')
                }

            })
        } catch (error) {
            req.flash('msgErro', 'Token de autorização não informado, execute o login! ')
            res.redirect('/login')
        }
    },

}