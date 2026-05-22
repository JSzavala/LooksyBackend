jest.mock('../../src/lib/prisma', () => ({
  atuendo: {
    findMany: jest.fn(),
    create: jest.fn(),
  },
  usuario: {
    findUnique: jest.fn(),
  },
}))

const request = require('supertest')
const express = require('express')
const prisma = require('../../src/lib/prisma')
const atuendoRoutes = require('../../src/routes/atuendo.routes')

const app = express()
app.use(express.json())
app.use(atuendoRoutes)

describe('Atuendo - Unit Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('GET /api/atuendos', () => {
    it('debe listar atuendos', async () => {
      prisma.atuendo.findMany.mockResolvedValue([
        { idAtuendo: 1, nombre: 'Look 1', descripcion: 'Desc', imagen: null, fecha: new Date(), idUsuario: 1, usuario: { idUsuario: 1, nombre: 'User' } },
      ])

      const res = await request(app).get('/api/atuendos')

      expect(res.status).toBe(200)
      expect(res.body.atuendos).toHaveLength(1)
    })

    it('debe devolver lista vacía', async () => {
      prisma.atuendo.findMany.mockResolvedValue([])

      const res = await request(app).get('/api/atuendos')

      expect(res.status).toBe(200)
      expect(res.body.atuendos).toEqual([])
    })

    it('debe manejar errores internos', async () => {
      prisma.atuendo.findMany.mockRejectedValue(new Error('DB error'))

      const res = await request(app).get('/api/atuendos')

      expect(res.status).toBe(500)
    })
  })

  describe('POST /api/atuendos', () => {
    const atuendoValido = { nombre: 'Look Nuevo', descripcion: 'Desc', idUsuario: 1 }

    it('debe crear un atuendo', async () => {
      prisma.usuario.findUnique.mockResolvedValue({ idUsuario: 1, nombre: 'User' })
      prisma.atuendo.create.mockResolvedValue({ idAtuendo: 1, nombre: 'Look Nuevo', descripcion: 'Desc', imagen: null, fecha: new Date(), idUsuario: 1 })

      const res = await request(app).post('/api/atuendos').send(atuendoValido)

      expect(res.status).toBe(201)
      expect(res.body.atuendo).toBeDefined()
    })

    it('debe rechazar sin campos obligatorios', async () => {
      const res = await request(app).post('/api/atuendos').send({ nombre: 'Solo nombre' })

      expect(res.status).toBe(400)
    })

    it('debe devolver 404 si el usuario no existe', async () => {
      prisma.usuario.findUnique.mockResolvedValue(null)

      const res = await request(app).post('/api/atuendos').send(atuendoValido)

      expect(res.status).toBe(404)
    })

    it('debe manejar errores internos', async () => {
      prisma.usuario.findUnique.mockRejectedValue(new Error('DB error'))

      const res = await request(app).post('/api/atuendos').send(atuendoValido)

      expect(res.status).toBe(500)
    })
  })
})
