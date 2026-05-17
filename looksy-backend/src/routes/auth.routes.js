const express = require('express')
const router = express.Router()
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const prisma = require('../lib/prisma')

const JWT_SECRET = process.env.JWT_SECRET || 'looksy_secret_key_dev'
const JWT_EXPIRES = '7d'

router.post('/api/auth/register', async (req, res) => {
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

    const token = jwt.sign(
      { idUsuario: usuario.idUsuario, correo: usuario.correo, rol: usuario.rol },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES }
    )

    res.status(201).json({ usuario, token })
  } catch (error) {
    console.error('Error al registrar usuario:', error)
    res.status(500).json({
      error: 'Error interno del servidor',
      mensaje: 'No se pudo registrar el usuario',
    })
  }
})

router.post('/api/auth/login', async (req, res) => {
  try {
    const { correo, contrasena } = req.body

    if (!correo || !contrasena) {
      return res.status(400).json({
        error: 'Parámetros requeridos',
        mensaje: 'Los campos correo y contrasena son obligatorios',
      })
    }

    const usuario = await prisma.usuario.findUnique({
      where: { correo },
      select: {
        idUsuario: true,
        nombre: true,
        correo: true,
        contrasena: true,
        rol: true,
      },
    })

    if (!usuario) {
      return res.status(401).json({
        error: 'Autenticación fallida',
        mensaje: 'Correo o contraseña incorrectos',
      })
    }

    const valida = await bcrypt.compare(contrasena, usuario.contrasena)
    if (!valida) {
      return res.status(401).json({
        error: 'Autenticación fallida',
        mensaje: 'Correo o contraseña incorrectos',
      })
    }

    const token = jwt.sign(
      { idUsuario: usuario.idUsuario, correo: usuario.correo, rol: usuario.rol },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES }
    )

    res.json({
      usuario: {
        idUsuario: usuario.idUsuario,
        nombre: usuario.nombre,
        correo: usuario.correo,
        rol: usuario.rol,
      },
      token,
    })
  } catch (error) {
    console.error('Error al iniciar sesión:', error)
    res.status(500).json({
      error: 'Error interno del servidor',
      mensaje: 'No se pudo iniciar sesión',
    })
  }
})

module.exports = router
