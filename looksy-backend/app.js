const express = require('express')
const app = express()
const port = 3000

app.use(express.json())

const productoRuta = require('./src/routes/product.routes')
const usuarioRuta = require('./src/routes/user.routes')
const preferenciaRuta = require('./src/routes/preference.routes')

app.use(productoRuta)
app.use(usuarioRuta)
app.use(preferenciaRuta)

app.get('/', (req, res) => {
  res.send('Servidor respondió correctamente')
})

app.listen(port, () => {
  console.log(`Andamos en el port ${port}`)
})

module.exports = app
