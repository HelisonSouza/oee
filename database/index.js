const Sequelize = require('sequelize');
const dbConfig = require('../config/database');

//Importações dos Models
const Usuario = require('../models/Usuario')
const Motivo = require('../models/Motivo')
const Parada = require('../models/Parada')
const Pausa = require('../models/Pausa')
const Producao = require('../models/Producao')
const Produto = require('../models/Produto');
const Producao_Pausa = require('../models/Producao_Pausa');
const Producao_PausaController = require('../controllers/Producao_PausaController');

const connection = new Sequelize(dbConfig);

//Inicializado a conexão com o Model
Usuario.init(connection)
Motivo.init(connection)
Parada.init(connection)
Pausa.init(connection)
Producao.init(connection)
Produto.init(connection)
Producao_Pausa.init(connection)

//Chamando as associações e passando os models pela conexão
Pausa.associate(connection.models)
Producao.associate(connection.models)
Parada.associate(connection.models)
Producao_Pausa.associate(connection.models)



module.exports = connection; 