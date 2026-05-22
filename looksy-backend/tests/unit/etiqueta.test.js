jest.mock('../../src/lib/prisma', () => ({
  etiqueta: {
    findMany: jest.fn(),
    findUnique: jest.fn(),
    create: jest.fn(),
  },
}))

const request = require('supertest')
const express = require('express')
const prisma = require('../../src/lib/prisma')
const etiquetaRoutes = require('../../src/routes/etiqueta.routes')

const app = express()
app.use(express.json())
app.use(etiquetaRoutes)

describe('Etiqueta - Unit Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('GET /api/etiquetas', () => {
    it('debe listar etiquetas', async () => {
      prisma.etiqueta.findMany.mockResolvedValue([
        { idEtiqueta: 1, nombre: 'Moda', _count: { productos: 3 } },
      ])

      const res = await request(app).get('/api/etiquetas')

      expect(res.status).toBe(200)
      expect(res.body.etiquetas).toHaveLength(1)
    })

    it('debe devolver lista vacía', async () => {
      prisma.etiqueta.findMany.mockResolvedValue([])

      const res = await request(app).get('/api/etiquetas')

      expect(res.status).toBe(200)
      expect(res.body.etiquetas).toEqual([])
    })

    it('debe manejar errores internos', async () => {
      prisma.etiqueta.findMany.mockRejectedValue(new Error('DB error'))

      const res = await request(app).get('/api/etiquetas')

      expect(res.status).toBe(500)
    })
  })

  describe('POST /api/etiquetas', () => {
    it('debe crear una etiqueta', async () => {
      prisma.etiqueta.findUnique.mockResolvedValue(null)
      prisma.etiqueta.create.mockResolvedValue({ idEtiqueta: 1, nombre: 'Nueva Etiqueta' })

      const res = await request(app).post('/api/etiquetas').send({ nombre: 'Nueva Etiqueta' })

      expect(res.status).toBe(201)
      expect(res.body.etiqueta).toBeDefined()
    })

    it('debe rechazar sin nombre', async () => {
      const res = await request(app).post('/api/etiquetas').send({})

      expect(res.status).toBe(400)
    })

    it('debe rechazar nombre duplicado', async () => {
      prisma.etiqueta.findUnique.mockResolvedValue({ idEtiqueta: 1, nombre: 'Existente' })

      const res = await request(app).post('/api/etiquetas').send({ nombre: 'Existente' })

      expect(res.status).toBe(409)
    })

    it('debe manejar errores internos', async () => {
      prisma.etiqueta.findUnique.mockRejectedValue(new Error('DB error'))

      const res = await request(app).post('/api/etiquetas').send({ nombre: 'Test' })

      expect(res.status).toBe(500)
    })
  })
})
