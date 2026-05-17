const express = require('express')
const router = express.Router()
const prisma = require('../lib/prisma')

router.get('/api/atuendos', async (req, res) => {
  try {
    const atuendos = await prisma.atuendo.findMany({
      select: {
        idAtuendo: true,
        nombre: true,
        descripcion: true,
        imagen: true,
        fecha: true,
        idUsuario: true,
        usuario: {
          select: { idUsuario: true, nombre: true },
        },
      },
      orderBy: { fecha: 'desc' },
    })

    res.json({ atuendos, total: atuendos.length })
  } catch (error) {
    console.error('Error al obtener atuendos:', error)
    res.status(500).json({
      error: 'Error interno del servidor',
      mensaje: 'No se pudieron obtener los atuendos',
    })
  }
})

router.post('/api/atuendos', async (req, res) => {
  try {
    const { nombre, descripcion, imagen, idUsuario } = req.body

    if (!nombre || !idUsuario) {
      return res.status(400).json({
        error: 'Parámetros requeridos',
        mensaje: 'Los campos nombre e idUsuario son obligatorios',
      })
    }

    const usuario = await prisma.usuario.findUnique({
      where: { idUsuario: Number(idUsuario) },
    })
    if (!usuario) {
      return res.status(404).json({
        error: 'Usuario no encontrado',
        mensaje: `No existe un usuario con el id ${idUsuario}`,
      })
    }

    const atuendo = await prisma.atuendo.create({
      data: {
        nombre,
        descripcion,
        imagen,
        idUsuario: Number(idUsuario),
      },
      select: {
        idAtuendo: true,
        nombre: true,
        descripcion: true,
        imagen: true,
        fecha: true,
        idUsuario: true,
      },
    })

    res.status(201).json({ atuendo })
  } catch (error) {
    console.error('Error al crear atuendo:', error)
    res.status(500).json({
      error: 'Error interno del servidor',
      mensaje: 'No se pudo crear el atuendo',
    })
  }
})

module.exports = router
