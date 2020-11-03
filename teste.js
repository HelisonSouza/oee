
const valorInicial = 10

var results = []

var result = soma = (num1) => {
  return num1++
}

setInterval(() => {
  soma(valorInicial)
  results.push(result)
  console.log(results.length)
}, 1000)

/*

10 + 1 = 11
11 + 1 = 12
12 + 1 = 13

*/