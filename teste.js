var obj = {
  nome: 'Lary',
  idade: 25
}

function fazAniversário(data) {
  if (data === "27/10") {
    obj['idade'] = obj.idade + 1
  }
  console.log('--->' + JSON.stringify(obj))
}

fazAniversário('27/10')