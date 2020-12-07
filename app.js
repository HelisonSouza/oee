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

const PdfPrinter = require('pdfmake')
const fonts = {
  Roboto: {
    normal: '../public/fonts/Roboto-Regular.ttf',
    bold: '../public/fonts/Roboto-Bold.ttf',
    italics: '../public/fonts/Roboto-Italic.ttf',
    bolditalics: '../public/font/Roboto-BoldItalic.ttf'
  }
}

module.exports = fonts

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
const Parada = require('./models/Parada');
const { resolve } = require('path');
const { da } = require('date-fns/locale');

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

module.exports = app

//---------------------------------------------------------------------------------------
//   Socket.io
//---------------------------------------------------------------------------------------

let finalizada = 0

io.on('connection', socket => {

  //Inicializa as variáveis para utilização nos eventos do escopo da conexão
  let id = 1
  let qtd_defeito = 0
  let qtd_produzida = 0
  let status = "Rodando"

  const outrosDados = {
    status: status
  }

  let intervaloEventos = 0
  let startCronometro
  const registroVelocidadeMedia = []
  let mediaGeralVelocidade = 0

  let horarioRegistroInicioUltimaParada = Date.now()

  // Clientes conectados
  console.log(`Conectado a: ${socket.id}`)

  // Recebe o aviso de onload do PAINEL
  socket.on('onload', () => {
    let dadosDaProducao = getDadosSessao()                 //Carrega os dados da SESSÃO
    console.log(dadosDaProducao)
    if (dadosDaProducao) {
      enviaDadosAdicionais()
      enviaCargaDeDadosAtualizados(dadosDaProducao)          //Envia carga de dados para os clientes
      registroVelocidadeMedia.push(dadosDaProducao.velocidade_media)
      calculaIntervalo()
      finalizada = 0
      listaParadas()
    }
  })

  // Recebe o evento que indica o fim da produção
  socket.on('finalizarProducao', () => {
    finalizarProducao()
    console.log("PRODUÇÃO FINALIZADA")
  })

  //Recebe os evendos do Server Socket-io__________________________________________________________
  socket.on('evento', (dados) => {
    console.log('VEIO ->' + dados.nome)

    //Evento PRODUTO OK
    if (dados.nome === 'Produto OK' & finalizada == 0) {
      alteraStatus("Rodando")
      enviaDadosAdicionais()
      atualizaQuantidadeProduzida();
      calculaIntervalo()
    }
    //Evento PRODUTO COM DEFEITO
    if (dados.nome === 'Produto com Defeito' & finalizada == 0) {
      alteraStatus("Rodando")
      enviaDadosAdicionais()
      atualizarQuantidadeDefeito()
      calculaIntervalo()
    }

    //Evento PARADA
    if (dados.nome === 'Inicio Parada' & finalizada == 0) {
      alteraStatus("Parada")
      enviaDadosAdicionais()
      registraInicioParada()
      gravaHorario()
    }
    if (dados.nome === 'Fim Parada' & finalizada === 0) {
      registraFimParada()
      alteraStatus("Rodando")
      enviaDadosAdicionais()
    }

  })

  //  FUNÇÕES_______________________________________________________________________________ 

  let getDadosSessao = () => {
    return socket.handshake.session.producao                     //Retorna os dados da seção
  }

  atualizaSessao = (dados) => {
    socket.handshake.session.producao = dados                    //Sobrescreve os dados
    socket.handshake.session.save()                              //Salva alterações
  }

  enviaCargaDeDadosAtualizados = (dadosDaProducao) => {
    //Passa os valores as variáveis inicializadas zeradas
    id = dadosDaProducao.id
    qtd_defeito = dadosDaProducao.qtd_defeito
    qtd_produzida = dadosDaProducao.qtd_produzida

    io.emit('dadosDaProducao', dadosDaProducao)    //Envia para os dados para os clientes
  }

  enviaDadosAdicionais = () => {
    socket.emit('dadosAdicionais', outrosDados)
  }

  atualizaQuantidadeProduzida = async () => {                   //Atualiza Quantidade Produzida
    let novoValor = qtd_produzida + 1
    await Producao.update({                                     //Executa o update no banco
      qtd_produzida: novoValor,
      velocidade_media: mediaGeralVelocidade
    }, {
      where: { id: id }
    })
    let producaoPercistida = await Producao.findByPk(id, {       //Busca os dados atualizados
      include: {
        association: 'produto',
        attributes: ['nome', 'velocidade']
      }
    })
    await atualizaSessao(producaoPercistida)                          //Atualiza a sessão
    //Carrega os dados da SESSÃO
    let dadosDaProducao = getDadosSessao()
    await enviaCargaDeDadosAtualizados(dadosDaProducao)               //Envia carga de dados para os clientes
  }

  atualizarQuantidadeDefeito = async () => {
    let novoValorDefeito = qtd_defeito + 1
    await Producao.update({                                           //Executa o update no banco
      qtd_defeito: novoValorDefeito,
      velocidade_media: mediaGeralVelocidade
    }, {
      where: { id: id }
    })
    let producaoPercistidaDefeito = await Producao.findByPk(id, {     //Busca os dados atualizados
      include: {
        association: 'produto',
        attributes: ['nome', 'velocidade']
      }
    })
    await atualizaSessao(producaoPercistidaDefeito)                    //Atualiza a sessão
    let dadosDaProducaoDefeito = getDadosSessao()                      //Carrega os dados da SESSÃO
    await enviaCargaDeDadosAtualizados(dadosDaProducaoDefeito)         //Envia carga de dados para os clientes
  }

  finalizarProducao = async () => {
    await Producao.update({                                           //Executa o update no banco
      status: "finalizada",
      finalizadaEm: new Date()
    }, {
      where: { id: id }
    })
    alteraStatus("Finalizada")
    enviaDadosAdicionais()
    finalizada = 1
    console.log(finalizada)
  }

  gravaHorario = () => {
    horarioRegistroInicioUltimaParada = Date.now()
  }

  // TRATA EVENTO DE PARADA_____________________________________________________________

  listaParadas = async () => {          //Lista paradas e emit evento para view
    await Parada.findAll({
      include: {
        association: 'motivo',
        attributes: ['descricao'],
      },
      attributes: ['id', 'inicio', 'fim'],
      where: { producao_id: id },
      order: [
        ['id', 'DESC']
      ]
    }).then((paradas) => {
      socket.emit('dadosParada', paradas)
    })
  }

  registraInicioParada = async () => {          //Guarda o inicio da parada para o where do registro de fim
    await Parada.create({
      inicio: Date.now(),
      producao_id: id,
    })
  }

  registraFimParada = async () => {     //registra o fim e chama a listagem
    await Parada.update({
      fim: Date.now()
    }, {
      where: { inicio: horarioRegistroInicioUltimaParada }
    }).then(() => {
      listaParadas()
    })
  }

  // VELOCIDADE MÉDIA DE PRODUÇÃO_____________________________________________________________

  calculaIntervalo = () => {
    if (intervaloEventos > 0) {                                       //Se intervalo maior que 0
      let mediaVelociadeEvento = (60 / intervaloEventos)              //Converte em peças/minuto
      registroVelocidadeMedia.push(parseFloat(mediaVelociadeEvento))  //Registra
    }
    mediaGeralVelocidade = calculaMediaGeralVelocidade()              //Guarda média geral atual
    //Prepara para o próximo evento
    zerarIntervalo()                                                  //Zera o valor
    clearInterval(startCronometro)                                    //Zera o cronometro
    cronometro()                                                      //Inicializa o cronometro
  }

  cronometro = () => {                                          //cronometro registrando 10 ms
    startCronometro = setInterval(function () {
      intervaloEventos += 0.1
    }, 100)
  }

  zerarIntervalo = () => {
    intervaloEventos = 0
  }

  calculaMediaGeralVelocidade = () => {
    let soma = 0
    let avg = 0
    for (let i = 0; i < registroVelocidadeMedia.length; i++) {
      soma += registroVelocidadeMedia[i]
    }
    if (soma == 0) {
      avg = 0
    } else {
      avg = soma / registroVelocidadeMedia.length
    }
    return avg
  }

  //  STATUS DA PRODUÇÃO ________________________________________________________________________

  alteraStatus = (valor) => {
    outrosDados.status = valor
  }


})
