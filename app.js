//Modulos
const express = require('express');
const http = require('http')
const exphbs = require('express-handlebars')
const Handlebars = require('handlebars')
const { allowInsecurePrototypeAccess } = require('@handlebars/allow-prototype-access')
const session = require('express-session')({
  secret: 'definir o segreeeedo',
  cookie: { maxAge: 1000 * 60 * 60 },
  resave: true,
  saveUninitialized: true
})
const sharedSession = require('express-socket.io-session')
const flash = require('connect-flash')
const path = require('path');
const bodyParser = require('body-parser')
const morgan = require('morgan')
const datefns = require('date-fns')

// Rotas
const usuario = require('./routes/usuario')
const motivo = require('./routes/motivo')
const parada = require('./routes/parada')
const pausa = require('./routes/pausa')
const produto = require('./routes/produto')
const producao = require('./routes/producao')
const operacao = require('./routes/operacao')
const index = require('./routes/index')
require('./database/index')

//models
const Producao = require('./models/Producao');

//instancias do Express, Server e Socket.io
const app = express();
const server = http.createServer(app)
const io = require('socket.io')(server)

// Midlewares
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }))
app.use(session)
app.use(flash())
io.use(sharedSession(session, { autoSave: true }))

//Variáveis Globais
app.use((req, res, next) => {
  res.locals.msgSucesso = req.flash('msgSucesso')
  res.locals.msgErro = req.flash('msgErro')
  next()
})

// Midlewares de rotas
app.use(usuario);
app.use(motivo)
app.use(parada)
app.use(pausa)
app.use(produto)
app.use(producao)
app.use(operacao)
app.use('/', index)

//Log
app.use(morgan('dev'))

// Templete Engine
const hbs = exphbs.create({
  defaultLayout: 'main',
  extname: 'hbs',
  handlebars: allowInsecurePrototypeAccess(Handlebars)
});
app.engine('hbs', hbs.engine);
app.set('view engine', 'hbs');
app.set('views', 'views');

//Arquivos estáticos
app.use(express.static(path.resolve(__dirname, 'public')));

//Serviço
server.listen(3000)

//---------------------------------------------------------------------------------------
//   Socket.io
//---------------------------------------------------------------------------------------
io.on('connection', socket => {
  console.log(`Conectado: ${socket.id}`)


  atualizarProducacao = async (id, qtd) => {
    //Atualiza Quantidade Produzida
    await Producao.update({ qtd_produzida: qtd }, {
      where: { id: id }
    })
    atualizaSession(await getDados(id))
  }

  getDados = async (id) => {
    //Pega os dados atualizadados
    const dadosAtualizados = await Producao.findByPk(id)
    return dadosAtualizados.dataValues
  }

  atualizaSession = async (dados) => {
    socket.handshake.session.producao = dados
    socket.handshake.session.save()
    var atualizado = await socket.handshake.session.producao
    console.log('Sessão Atualizada :' + JSON.stringify(dados))
    enviaDados(atualizado)
  }

  //envia os dados para socket da view start
  enviaDados = (atualizado) => {
    socket.emit('producaoDados', atualizado)
    console.log('socket enviou :' + JSON.stringify(atualizado))
  }

  //pega os dados da session
  var producao = socket.handshake.session.producao

  if (producao) {
    //chama função para enviar os dados para view
    //enviaDados(producao)
    const id = socket.handshake.session.producao.id

    //Recebe os evendos do Server Socket-io
    socket.on('evento', (dados) => {
      console.log('veio ->' + dados)

      //Evento PRODUTO OK
      if (dados === 'Produto OK') {
        atualizarProducacao(id, 54);
      }

      if (dados === 'Produto com Defeito') {
        console.log('recebido ->' + dados)
      }

    })
  }

  socket.on('onload', () => {
    console.log('Onload view')
    atualizaSession(producao)
  })

})
