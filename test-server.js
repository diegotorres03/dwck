
const express = require('express')
const cors = require('cors')
const app = express()
const port = 3000

app.use(cors())
app.use(express.json())

const itemStore = new Map()
itemStore.set('1', { id: '1', name: 'initial' })

app.get('/items.json', (req, res) => {
  const items = [...itemStore.values()]
  console.log(items)
  res.json(items)
})

app.get('/items.html', (req, res) => {
  const items = [...itemStore.values()]
  const html = items.reduce((acc, item) => acc + `<header-card id="${item.id}" name="${item.name}">${item.name}</header-card>`, '')
  console.log(html)
  res.header()
  res.send(`<div id="items">${html}</div>`)
})

app.post('/items.html', async (req, res) => {
  console.log('post items')
  console.log(req.body, req.headers, req.method)
  // console.log(req)
  const data = req.body
  itemStore.set(data.id, data)
  console.log('data', data)
  res.json({ id: data.id })
})

let orders = [
  {id: '1', publisher: 'carras', amount: '$1.000.000', tasa: '$3.800.000', medio: 'Nequi, Bancolombia'},
  {id: '2', publisher: 'carras', amount: '$2.000.000', tasa: '$3.870.000', medio: 'Nequi, Bancolombia'},
  {id: '3', publisher: 'carras', amount: '$3.000.000', tasa: '$3.790.000', medio: 'Nequi, Bancolombia'},
]

app.get('/open-orders', async (req, res) => {

  const html = orders.reduce((acc, order) => acc + `<header-card id="${order.id}" name="${order.name}">${order.name}</header-card>`, '')

  res.send(html)
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})