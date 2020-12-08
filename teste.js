const producoes = [
  {
    id: 66,
    data: 2020 - 12 - 06T02: 00: 00.000Z,
    qtd_planejada: 60,
    qtd_produzida: 53,
    qtd_defeito: 7,
    velocidade_media: 363,
    produto_id: 1,
    paradas: [
      [
        inicio: 2020 - 12 - 05T22: 34: 42.000Z,
        fim: 2020 - 12 - 05T22: 34: 45.000Z,
      ]
    ]
  },
  {
    id: 67,
    data: 2020 - 12 - 06T02: 00: 00.000Z,
    qtd_planejada: 50,
    qtd_produzida: 42,
    qtd_defeito: 8,
    velocidade_media: 538,
    produto_id: 1,
    paradas: []
  },
  {
    id: 68,
    data: 2020 - 12 - 06T02: 00: 00.000Z,
    qtd_planejada: 30,
    qtd_produzida: 26,
    qtd_defeito: 4,
    velocidade_media: 508,
    produto_id: 1,
    paradas: []
  }
]








let oee = []
let performance = []
let disponibilidade = []
let qualidade = []
let kpi = {
  oee,
  performance,
  disponibilidade,
  qualidade
}
let vn = 120

producoes.forEach((producao, i) => {
  // Disponibilidade = B/A
  let tempoTotalDeParadas = paradas.forEach((parada, i) => {
    let tempoDaParada = datefns.differenceInMinutes(fim, inicio)
  })
  let tempoProgramado = vn * qtd_planejada //em minutos
  let tempoProduzindo = tempoProgramado - tempoTotalDeParadas

  // Performance = D/C
})