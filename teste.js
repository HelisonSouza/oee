const registroVelocidadeMedia = [12.5, 10.3, 15.8]


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


console.log(calculaMediaGeralVelocidade())
