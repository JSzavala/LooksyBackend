const express = require('express')
const app = express()
const port = 3000

app.get('/', (req, res) => {
  res.send('Servidor respondió correctamente')
})

app.listen(port, () => {
  console.log(`Andamos en el port ${port}`)
})
