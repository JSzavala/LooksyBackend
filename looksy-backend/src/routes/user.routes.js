const express = require('express')
const router = express.Router()
const bcrypt = require('bcryptjs')
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

router.post('/api/usuarios', async (req, res) => {
  try {
    const { nombre, correo, contrasena, rol } = req.body

    if (!nombre || !correo || !contrasena) {
      return res.status(400).json({
        error: 'Parámetros requeridos',
        mensaje: 'Los campos nombre, correo y contrasena son obligatorios',
      })
    }

    const existe = await prisma.usuario.findUnique({ where: { correo } })
    if (existe) {
      return res.status(409).json({
        error: 'Conflicto',
        mensaje: 'Ya existe un usuario con ese correo electrónico',
      })
    }

    const salt = await bcrypt.genSalt(10)
    const hash = await bcrypt.hash(contrasena, salt)

    const usuario = await prisma.usuario.create({
      data: {
        nombre,
        correo,
        contrasena: hash,
        rol: rol || 'cliente',
      },
      select: {
        idUsuario: true,
        nombre: true,
        correo: true,
        rol: true,
      },
    })

    res.status(201).json({ usuario })
  } catch (error) {
    console.error('Error al crear usuario:', error)
    res.status(500).json({
      error: 'Error interno del servidor',
      mensaje: 'No se pudo crear el usuario',
    })
  }
})

router.get('/api/usuarios/:id', async (req, res) => {
  try {
    const { id } = req.params

    const usuario = await prisma.usuario.findUnique({
      where: { idUsuario: Number(id) },
      select: {
        idUsuario: true,
        nombre: true,
        correo: true,
        rol: true,
      },
    })

    if (!usuario) {
      return res.status(404).json({
        error: 'Usuario no encontrado',
        mensaje: `No existe un usuario con el id ${id}`,
      })
    }

    res.json({ usuario })
  } catch (error) {
    console.error('Error al obtener usuario:', error)
    res.status(500).json({
      error: 'Error interno del servidor',
      mensaje: 'No se pudo obtener el usuario',
    })
  }
})

module.exports = router
