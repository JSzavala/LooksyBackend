const express = require('express')
const router = express.Router()
const prisma = require('../lib/prisma')

router.get('/api/etiquetas', async (req, res) => {
  try {
    const etiquetas = await prisma.etiqueta.findMany({
      select: {
        idEtiqueta: true,
        nombre: true,
        _count: {
          select: { productos: true },
        },
      },
      orderBy: { nombre: 'asc' },
    })

    res.json({ etiquetas, total: etiquetas.length })
  } catch (error) {
    console.error('Error al obtener etiquetas:', error)
    res.status(500).json({
      error: 'Error interno del servidor',
      mensaje: 'No se pudieron obtener las etiquetas',
    })
  }
})

router.post('/api/etiquetas', async (req, res) => {
  try {
    const { nombre } = req.body

    if (!nombre) {
      return res.status(400).json({
        error: 'Parámetros requeridos',
        mensaje: 'El campo nombre es obligatorio',
      })
    }

    const existe = await prisma.etiqueta.findUnique({ where: { nombre } })
    if (existe) {
      return res.status(409).json({
        error: 'Conflicto',
        mensaje: `Ya existe una etiqueta con el nombre "${nombre}"`,
      })
    }

    const etiqueta = await prisma.etiqueta.create({
      data: { nombre },
      select: { idEtiqueta: true, nombre: true },
    })

    res.status(201).json({ etiqueta })
  } catch (error) {
    console.error('Error al crear etiqueta:', error)
    res.status(500).json({
      error: 'Error interno del servidor',
      mensaje: 'No se pudo crear la etiqueta',
    })
  }
})

module.exports = router
