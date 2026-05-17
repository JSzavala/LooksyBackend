const express = require('express')
const app = express()
const port = 3000

app.use(express.json())

const authRuta = require('./src/routes/auth.routes')
const usuarioRuta = require('./src/routes/user.routes')
const productoRuta = require('./src/routes/product.routes')
const preferenciaRuta = require('./src/routes/preference.routes')
const atuendoRuta = require('./src/routes/atuendo.routes')
const tiendaRuta = require('./src/routes/tienda.routes')
const pedidoRuta = require('./src/routes/pedido.routes')
const etiquetaRuta = require('./src/routes/etiqueta.routes')

app.use(authRuta)
app.use(usuarioRuta)
app.use(productoRuta)
app.use(preferenciaRuta)
app.use(atuendoRuta)
app.use(tiendaRuta)
app.use(pedidoRuta)
app.use(etiquetaRuta)

app.get('/', (req, res) => {
  res.send('Servidor respondió correctamente')
})

app.listen(port, () => {
  console.log(`Andamos en el port ${port}`)
})

module.exports = app
