

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


14 10 2020
  - criado migrate para add campo 'ativo' na tabela produto
  
