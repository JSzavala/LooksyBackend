jest.mock('../../src/lib/prisma', () => ({
  usuario: {
    findUnique: jest.fn(),
    create: jest.fn(),
  },
}))

const request = require('supertest')
const express = require('express')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const prisma = require('../../src/lib/prisma')
const authRoutes = require('../../src/routes/auth.routes')

const app = express()
app.use(express.json())
app.use(authRoutes)

describe('Auth - Unit Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('POST /api/auth/register', () => {
    const valido = { nombre: 'Test', correo: 'test@test.com', contrasena: '123456' }

    it('debe registrar un usuario y devolver token', async () => {
      prisma.usuario.findUnique.mockResolvedValue(null)
      prisma.usuario.create.mockResolvedValue({
        idUsuario: 1, nombre: 'Test', correo: 'test@test.com', rol: 'cliente',
      })

      const res = await request(app).post('/api/auth/register').send(valido)

      expect(res.status).toBe(201)
      expect(res.body.usuario).toBeDefined()
      expect(res.body.usuario.nombre).toBe('Test')
      expect(res.body.token).toBeDefined()
      expect(prisma.usuario.create).toHaveBeenCalledTimes(1)
    })

    it('debe rechazar registro sin campos obligatorios', async () => {
      const res = await request(app).post('/api/auth/register').send({})

      expect(res.status).toBe(400)
      expect(res.body.error).toBe('Parámetros requeridos')
    })

    it('debe rechazar si el correo ya existe', async () => {
      prisma.usuario.findUnique.mockResolvedValue({ idUsuario: 99 })

      const res = await request(app).post('/api/auth/register').send(valido)

      expect(res.status).toBe(409)
      expect(res.body.error).toBe('Conflicto')
    })

    it('debe manejar errores internos del servidor', async () => {
      prisma.usuario.findUnique.mockRejectedValue(new Error('DB error'))

      const res = await request(app).post('/api/auth/register').send(valido)

      expect(res.status).toBe(500)
      expect(res.body.error).toBe('Error interno del servidor')
    })
  })

  describe('POST /api/auth/login', () => {
    const creds = { correo: 'test@test.com', contrasena: '123456' }
    const hash = bcrypt.hashSync('123456', 10)

    it('debe iniciar sesión y devolver token', async () => {
      prisma.usuario.findUnique.mockResolvedValue({
        idUsuario: 1, nombre: 'Test', correo: 'test@test.com', contrasena: hash, rol: 'cliente',
      })

      const res = await request(app).post('/api/auth/login').send(creds)

      expect(res.status).toBe(200)
      expect(res.body.usuario).toBeDefined()
      expect(res.body.token).toBeDefined()
      expect(res.body.usuario.nombre).toBe('Test')
    })

    it('debe rechazar login sin credenciales', async () => {
      const res = await request(app).post('/api/auth/login').send({})

      expect(res.status).toBe(400)
      expect(res.body.error).toBe('Parámetros requeridos')
    })

    it('debe rechazar login con correo inexistente', async () => {
      prisma.usuario.findUnique.mockResolvedValue(null)

      const res = await request(app).post('/api/auth/login').send(creds)

      expect(res.status).toBe(401)
      expect(res.body.error).toBe('Autenticación fallida')
    })

    it('debe rechazar login con contraseña incorrecta', async () => {
      prisma.usuario.findUnique.mockResolvedValue({
        idUsuario: 1, nombre: 'Test', correo: 'test@test.com', contrasena: bcrypt.hashSync('wrong', 10), rol: 'cliente',
      })

      const res = await request(app).post('/api/auth/login').send(creds)

      expect(res.status).toBe(401)
    })
  })
})
