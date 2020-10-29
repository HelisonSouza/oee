//Modulos
const express = require('express');
const http = require('http')
const exphbs = require('express-handlebars')
const Handlebars = require('handlebars')
const { allowInsecurePrototypeAccess } = require('@handlebars/allow-prototype-access')
const session = require('express-session')
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
const { agendar } = require('./socket/index')

require('./database/index')

const app = express();

// Midlewares
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }))

//Configuração da Sessão
const sess = {
  secret: 'definir o segreeeedo',
  cookie: { maxAge: 1000 * 60 * 60 },
  resave: true,
  saveUninitialized: true
}
app.use(session(sess))
app.use(flash())

//Variáveis Globais
app.use((req, res, next) => {
  res.locals.msgSucesso = req.flash('msgSucesso')
  res.locals.msgErro = req.flash('msgErro')
  next()
})
global.producaoRodando = {}


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

//Eventos de produção
const lista = agendar()


//Serviço
const server = http.createServer(app)
server.listen(3000)


//Configurando socket.io

const io = require('socket.io')(server)
io.on('connection', socket => {
  console.log(`Conectado: ${socket.id}`)
  socket.on('evento', (dados) => {

    if (dados === 'Produto OK') {
      console.log('tudo é ->' + global.producaoRodando)
      console.log('recebido ->' + global.producaoRodando['qtd_produzida'])

      producaoRodando['qtd_produzida'] = producaoRodando.qtd_produzida + 1
    }

  })

  //função do cronometro do inicio da produção

  //renderizar na view 

})