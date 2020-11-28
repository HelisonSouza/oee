const datefns = require('date-fns');
const { ptBR } = require('date-fns/locale');
/*
let falta = 1800
let velocidadeMedia = 15

calculaTempoEstimadoEnceramento = () => {
  let milisegundosTotais = ((falta / velocidadeMedia) * 60) * 1000
  encerramentoEm = datefns.format(milisegundosTotais, "HH:mm")
  return encerramentoEm
}

console.log(calculaTempoEstimadoEnceramento())

*/
teste = (segundos) => {
  let h = parseInt(segundos / 3600)
  let m = parseInt((segundos % 3600) / 60)
  let s = parseInt((segundos % 3600) % 60)

  h = ((h < 10) ? "0" : "") + h
  m = ((m < 10) ? ":0" : ":") + m
  s = ((s < 10) ? ":0" : ":") + s

  strData = `${h}${m}${s}`
  return strData
}

console.log(teste(120))
