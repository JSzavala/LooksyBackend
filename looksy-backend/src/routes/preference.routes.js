const express = require('express')
const router = express.Router()
const prisma = require('../lib/prisma')

router.get('/api/productos/por-preferencia/:idCliente', async (req, res) => {
  try {
    const { idCliente } = req.params

    const cliente = await prisma.cliente.findUnique({
      where: { idCliente: Number(idCliente) },
    })

    if (!cliente) {
      return res.status(404).json({
        error: 'Cliente no encontrado',
        mensaje: `No existe un cliente con el id ${idCliente}`,
      })
    }

    if (!cliente.preferencia) {
      return res.json({
        cliente: { idCliente: cliente.idCliente },
        productos: [],
        total: 0,
        mensaje: 'El cliente no tiene preferencias registradas',
      })
    }

    const palabras = cliente.preferencia
      .split(',')
      .map(p => p.trim())
      .filter(Boolean)

    const condiciones = palabras.map(palabra => ({
      OR: [
        { nombre: { contains: palabra } },
        { descripcion: { contains: palabra } },
      ],
    }))

    const productos = await prisma.producto.findMany({
      where: {
        disponible: true,
        OR: condiciones,
      },
      select: {
        idProducto: true,
        nombre: true,
        descripcion: true,
        precio: true,
        stock: true,
        disponible: true,
        idTienda: true,
        tienda: {
          select: {
            nombreTienda: true,
          },
        },
      },
      orderBy: { nombre: 'asc' },
    })

    res.json({
      cliente: {
        idCliente: cliente.idCliente,
        preferencia: cliente.preferencia,
      },
      productos,
      total: productos.length,
    })
  } catch (error) {
    console.error('Error al obtener productos por preferencia:', error)
    res.status(500).json({
      error: 'Error interno del servidor',
      mensaje: 'No se pudieron obtener los productos recomendados',
    })
  }
})

module.exports = router
