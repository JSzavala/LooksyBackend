const express = require('express')
const router = express.Router()
const prisma = require('../lib/prisma')

router.get('/api/tiendas/:idTienda/productos', async (req, res) => {
  try {
    const { idTienda } = req.params

    const tienda = await prisma.tienda.findUnique({
      where: { idTienda: Number(idTienda) },
    })

    if (!tienda) {
      return res.status(404).json({
        error: 'Tienda no encontrada',
        mensaje: `No existe una tienda con el id ${idTienda}`,
      })
    }

    const productos = await prisma.producto.findMany({
      where: {
        idTienda: Number(idTienda),
        disponible: true,
      },
      select: {
        idProducto: true,
        nombre: true,
        descripcion: true,
        precio: true,
        stock: true,
        disponible: true,
      },
      orderBy: { nombre: 'asc' },
    })

    res.json({
      tienda: {
        idTienda: tienda.idTienda,
        nombreTienda: tienda.nombreTienda,
      },
      productos,
      total: productos.length,
    })
  } catch (error) {
    console.error('Error al obtener productos de la tienda:', error)
    res.status(500).json({
      error: 'Error interno del servidor',
      mensaje: 'No se pudieron obtener los productos de la tienda',
    })
  }
})

module.exports = router
