const express = require('express')
const router = express.Router()
const prisma = require('../lib/prisma')

router.get('/api/usuarios', async (req, res) => {
  try {
    const { q } = req.query

    if (!q || q.trim().length === 0) {
      return res.status(400).json({
        error: 'Parámetro requerido',
        mensaje: 'Debes proporcionar un término de búsqueda con el parámetro "q"',
      })
    }

    const usuarios = await prisma.usuario.findMany({
      where: {
        nombre: {
          contains: q.trim(),
        },
      },
      select: {
        idUsuario: true,
        nombre: true,
        correo: true,
        rol: true,
      },
      orderBy: { nombre: 'asc' },
    })

    res.json({
      usuarios,
      total: usuarios.length,
    })
  } catch (error) {
    console.error('Error al buscar usuarios:', error)
    res.status(500).json({
      error: 'Error interno del servidor',
      mensaje: 'No se pudieron buscar los usuarios',
    })
  }
})

module.exports = router
