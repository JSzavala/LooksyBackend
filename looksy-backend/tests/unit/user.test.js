jest.mock('../../src/lib/prisma', () => ({
  usuario: {
    findMany: jest.fn(),
    findUnique: jest.fn(),
    create: jest.fn(),
  },
}))

const request = require('supertest')
const express = require('express')
const prisma = require('../../src/lib/prisma')
const userRoutes = require('../../src/routes/user.routes')

const app = express()
app.use(express.json())
app.use(userRoutes)

describe('User - Unit Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('GET /api/usuarios', () => {
    it('debe buscar usuarios por nombre', async () => {
      prisma.usuario.findMany.mockResolvedValue([
        { idUsuario: 1, nombre: 'Juan Pérez', correo: 'juan@test.com', rol: 'cliente' },
      ])

      const res = await request(app).get('/api/usuarios?q=Juan')

      expect(res.status).toBe(200)
      expect(res.body.usuarios).toHaveLength(1)
      expect(res.body.total).toBe(1)
    })

    it('debe rechazar búsqueda sin query', async () => {
      const res = await request(app).get('/api/usuarios')

      expect(res.status).toBe(400)
      expect(res.body.error).toBe('Parámetro requerido')
    })
  })

  describe('GET /api/usuarios/:id', () => {
    it('debe obtener un usuario por id', async () => {
      prisma.usuario.findUnique.mockResolvedValue({ idUsuario: 1, nombre: 'Test', correo: 'test@test.com', rol: 'cliente' })

      const res = await request(app).get('/api/usuarios/1')

      expect(res.status).toBe(200)
      expect(res.body.usuario.idUsuario).toBe(1)
    })

    it('debe devolver 404 si no existe', async () => {
      prisma.usuario.findUnique.mockResolvedValue(null)

      const res = await request(app).get('/api/usuarios/999')

      expect(res.status).toBe(404)
    })
  })

  describe('POST /api/usuarios', () => {
    it('debe crear un usuario', async () => {
      prisma.usuario.findUnique.mockResolvedValue(null)
      prisma.usuario.create.mockResolvedValue({ idUsuario: 1, nombre: 'Test', correo: 'test@test.com', rol: 'cliente' })

      const res = await request(app).post('/api/usuarios').send({ nombre: 'Test', correo: 'test@test.com', contrasena: '123456' })

      expect(res.status).toBe(201)
      expect(res.body.usuario).toBeDefined()
    })

    it('debe rechazar creación sin campos', async () => {
      const res = await request(app).post('/api/usuarios').send({})

      expect(res.status).toBe(400)
    })

    it('debe rechazar si el correo ya existe', async () => {
      prisma.usuario.findUnique.mockResolvedValue({ idUsuario: 99 })

      const res = await request(app).post('/api/usuarios').send({ nombre: 'Test', correo: 'existente@test.com', contrasena: '123' })

      expect(res.status).toBe(409)
    })
  })
})
