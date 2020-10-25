const jwt = require('jsonwebtoken')
const configAutenticacao = require('../config/chave.json')

//middleware para verificar se a autenticação está válida
module.exports = (req, res, next) => {
    //pega o header de autorização da requisição 
    const authHeader = req.header.authorization

    //verifica se o token foi informado
    if (!authHeader) {
        req.flash('msgErro', 'Token de autorização não informado')
        res.redirect('/')
    }

    //Executa verificações leves para ver se o token está no formato esperado ( "Bearer" + hash)
    //1° separa as partes do token para verificar
    const partes = authHeader.split(' ');

    //2° verifica se realmente o token tem duas partes, se não tiver retorna uma msg de erro
    if (!partes.length === 2) {
        req.flash('msgErro', 'Token de autorização com formado inválido')
        res.redirect('/')
    }

    //3° se tiver duas partes, desestrutura as partes para valiar separadamente
    const [bearer, token] = partes;

    //verifica com uma rejecks que na parte bearer veio a palavra "Bearer"
    if (!/^Bearer$/i.test(bearer)) {
        req.flash('msgErro', 'Token de autorização com formato inválido')
        res.redirect('/')
    }

    //verificação pesada do token
    const payload = jwt.verify(token, configAutenticacao.segredo, (err, decoded) => {
        if (err) {
            req.flash('msgErro', 'Precisa de autorização')
            res.redirect('/')
        }
        //se não teve erro, inclui o Id do usuário nas próximas requisições
        res.locals.user = payload
        //req.userId = decoded.id; //acho que ta errado!!!
        return next();
    })

}