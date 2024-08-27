const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const { readFile } = require('fs/promises')


const lancedb = require('vectordb')
const { getTitanEmbeddings } = require('./bedrock-tools.js')

const app = express()
app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

app.get('/query-vector', async (req, res) => {
  try {
    const uri = 'data/products'
    const db = await lancedb.connect(uri)
    const table = await db.openTable('products')

    const query = req.query.prompt

    console.log("QUERY:", query)

    const searchVector = await getTitanEmbeddings(query)
    const responses = await table.search(searchVector)
      .limit(10)
      .execute()


    const products = await Promise.all(responses.map(async item => {
      const product = await readFile(filePath, 'utf-8')
      return JSON.parse(product)
    }))
      

    res.json(products)

  } catch (err) {

  }
})


const port = process.env.CHAT_PORT || 3000
app.listen(port, () => console.log('running on port:',port))