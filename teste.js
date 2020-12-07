produtos = [
  {
    id: 38,
    qtd_planejada: 30,
    lote: '1',
    data: '03-12-2020 10:10',
    qtd_produzida: 20,
    qtd_defeito: 10,
    usuario_id: 1,
    produto_id: 'Produto 04',
    status: 'finalizada'
  },
  {
    id: 39,
    qtd_planejada: 30,
    lote: '5050',
    data: '03-12-2020 10:10',
    qtd_produzida: 20,
    qtd_defeito: 10,
    usuario_id: 1,
    produto_id: 'Produto 04',
    status: 'finalizada'
  },
  {
    id: 40,
    qtd_planejada: 30,
    lote: '05',
    data: '02-12-2020 22:20',
    qtd_produzida: 55,
    qtd_defeito: 10,
    usuario_id: 1,
    produto_id: 'Produto 04',
    status: 'finalizada'
  }
]

let rows = []

produtos.forEach((valor, i) => {
  let values = Object.values(valor)
  rows[i] = values
});

let str = []

rows.forEach((arr, i) => {
  str[i] = arr.map(valor => { return valor.toString() })
})

console.log(str)
