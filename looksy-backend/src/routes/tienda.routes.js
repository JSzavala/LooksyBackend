const express = require('express')
const router = express.Router()
const prisma = require('../lib/prisma')

router.get('/api/tiendas', async (req, res) => {
  try {
    const tiendas = await prisma.tienda.findMany({
      select: {
        idTienda: true,
        nombreTienda: true,
        direccion: true,
        contacto: true,
        idAdministrador: true,
        _count: {
          select: { Productos: true },
        },
      },
      orderBy: { nombreTienda: 'asc' },
    })

    res.json({ tiendas, total: tiendas.length })
  } catch (error) {
    console.error('Error al obtener tiendas:', error)
    res.status(500).json({
      error: 'Error interno del servidor',
      mensaje: 'No se pudieron obtener las tiendas',
    })
  }
})

router.post('/api/tiendas', async (req, res) => {
  try {
    const { nombreTienda, direccion, contacto, idAdministrador } = req.body

    if (!nombreTienda || !direccion || !contacto || !idAdministrador) {
      return res.status(400).json({
        error: 'Parámetros requeridos',
        mensaje: 'Los campos nombreTienda, direccion, contacto e idAdministrador son obligatorios',
      })
    }

    const admin = await prisma.usuario.findUnique({
      where: { idUsuario: Number(idAdministrador) },
    })
    if (!admin) {
      return res.status(404).json({
        error: 'Administrador no encontrado',
        mensaje: `No existe un usuario con el id ${idAdministrador}`,
      })
    }

    const tienda = await prisma.tienda.create({
      data: {
        nombreTienda,
        direccion,
        contacto,
        idAdministrador: Number(idAdministrador),
      },
      select: {
        idTienda: true,
        nombreTienda: true,
        direccion: true,
        contacto: true,
        idAdministrador: true,
      },
    })

    res.status(201).json({ tienda })
  } catch (error) {
    console.error('Error al crear tienda:', error)
    res.status(500).json({
      error: 'Error interno del servidor',
      mensaje: 'No se pudo crear la tienda',
    })
  }
})

module.exports = router
