const express = require('express')
const router = express.Router()
const prisma = require('../lib/prisma')

router.get('/api/pedidos', async (req, res) => {
  try {
    const pedidos = await prisma.venta.findMany({
      select: {
        idVenta: true,
        estado: true,
        fecha: true,
        idTienda: true,
        idCliente: true,
        tienda: {
          select: { nombreTienda: true },
        },
        cliente: {
          select: {
            idCliente: true,
            usuario: { select: { nombre: true } },
          },
        },
        detalles: {
          select: {
            idArticulo: true,
            cantidad: true,
            total: true,
            articulo: { select: { nombre: true } },
          },
        },
      },
      orderBy: { fecha: 'desc' },
    })

    res.json({ pedidos, total: pedidos.length })
  } catch (error) {
    console.error('Error al obtener pedidos:', error)
    res.status(500).json({
      error: 'Error interno del servidor',
      mensaje: 'No se pudieron obtener los pedidos',
    })
  }
})

router.post('/api/pedidos', async (req, res) => {
  try {
    const { idTienda, idCliente, articulos, estado } = req.body

    if (!idTienda || !idCliente || !articulos || !articulos.length) {
      return res.status(400).json({
        error: 'Parámetros requeridos',
        mensaje: 'Los campos idTienda, idCliente y articulos son obligatorios',
      })
    }

    const tienda = await prisma.tienda.findUnique({
      where: { idTienda: Number(idTienda) },
    })
    if (!tienda) {
      return res.status(404).json({
        error: 'Tienda no encontrada',
        mensaje: `No existe una tienda con el id ${idTienda}`,
      })
    }

    const cliente = await prisma.cliente.findUnique({
      where: { idCliente: Number(idCliente) },
    })
    if (!cliente) {
      return res.status(404).json({
        error: 'Cliente no encontrado',
        mensaje: `No existe un cliente con el id ${idCliente}`,
      })
    }

    const pedido = await prisma.venta.create({
      data: {
        estado: estado || 'pendiente',
        fecha: new Date(),
        idTienda: Number(idTienda),
        idCliente: Number(idCliente),
        detalles: {
          create: articulos.map(a => ({
            idArticulo: Number(a.idArticulo),
            cantidad: a.cantidad || 1,
            total: a.total || 0,
          })),
        },
      },
      select: {
        idVenta: true,
        estado: true,
        fecha: true,
        idTienda: true,
        idCliente: true,
        detalles: {
          select: {
            idArticulo: true,
            cantidad: true,
            total: true,
          },
        },
      },
    })

    res.status(201).json({ pedido })
  } catch (error) {
    console.error('Error al crear pedido:', error)
    res.status(500).json({
      error: 'Error interno del servidor',
      mensaje: 'No se pudo crear el pedido',
    })
  }
})

module.exports = router
