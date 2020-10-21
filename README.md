----------  TASKS ----------------
[] Como atribuir pausas p/ produções cadastradas?
[] Mascara para campos de data e hora
[] Não pode ter produções cadastrada com horários sobrepostos
[] Como agendar o start das prouções cadastradas?
[] Contador de tempo para iniciar a produção  


[] Desenvolver o serviço para simular os dados da produção enviando para a aplicação "socket-io"
  20/10 -> criado serviço para rodar a aplicação da simulação e configurado a comunicação socket-io cliente servidor, https://github.com/HelisonSouza/server-socket-io testado OK --> próximo passo é criar as funções para transmitir os dados, recuperar os dados e tratar. 



----------  ANOTAÇÕES ----------------


Fluxo de trabalho com SEQUELIZE

1º --> Criar uma tabela

  ->crie uma migration
    npx sequelize migration:create --name=aqui-vai-o-nome-da-migration


--> Disfaz a ultima migration criada
  npx sequelize migrate:undo


--> Adicionar um campo em uma tabela
    cria uma nova migrate
    ->no método up:
      retur queryInterface.addColumn(
        'NomeDoModel',
        'NomeNovaColuna',
        {
          type: Sequelize.INTEGER,
        }
      )

    ->no método down:
      retur queryInterface.removeColumn(
          'NomeDoModel',
          'NomeNovaColuna',
        )

2º --> Cria um Model
  -> em database/indes.js 
      importa o Model criado,
      inicializa a conexão com o método .init

3º --> Cria uma Rota


    const Sequelize = require('sequelize');

// Override timezone formatting for MSSQL
Sequelize.DATE.prototype._stringify = function _stringify(date, options) {
  return this._applyTimezone(date, options).format('YYYY-MM-DD HH:mm:ss.SSS');
};

video aulas 
https://www.youtube.com/watch?v=FwWGLgT-_jg
Node Cron -> https://www.youtube.com/watch?v=XmJMYAV4ZSY

Referências documentação Sequelize
https://sequelize.readthedocs.io/en/latest/docs/migrations/

