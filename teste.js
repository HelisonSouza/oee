var { varGlobal } = require('./helpers/global')

const dados = {
  teste: 04,
  nome: 'Hélison S'
}

console.log(varGlobal)
console.log(dados)

setTimeout(() => {
  varGlobal = dados
  console.log(varGlobal)
}, 2000)

setTimeout(() => {
  varGlobal.teste = varGlobal.teste + 1
  console.log(varGlobal)
}, 4000)

