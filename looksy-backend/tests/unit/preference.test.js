jest.mock('../../src/lib/prisma', () => ({
  cliente: {
    findUnique: jest.fn(),
  },
  producto: {
    findMany: jest.fn(),
  },
}))

const request = require('supertest')
const express = require('express')
const prisma = require('../../src/lib/prisma')
const preferenceRoutes = require('../../src/routes/preference.routes')

const app = express()
app.use(express.json())
app.use(preferenceRoutes)

describe('Preference - Unit Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('GET /api/productos/por-preferencia/:idCliente', () => {
    it('debe retornar productos según preferencia del cliente', async () => {
      prisma.cliente.findUnique.mockResolvedValue({ idCliente: 1, preferencia: 'ropa, zapatos' })
      prisma.producto.findMany.mockResolvedValue([
        { idProducto: 1, nombre: 'Camisa', descripcion: 'Ropa formal', precio: 299, stock: 10, disponible: true, idTienda: 1, tienda: { nombreTienda: 'T' } },
      ])

      const res = await request(app).get('/api/productos/por-preferencia/1')

      expect(res.status).toBe(200)
      expect(res.body.productos).toHaveLength(1)
      expect(res.body.cliente.preferencia).toBe('ropa, zapatos')
    })

    it('debe retornar vacío si el cliente no tiene preferencia', async () => {
      prisma.cliente.findUnique.mockResolvedValue({ idCliente: 1, preferencia: null })

      const res = await request(app).get('/api/productos/por-preferencia/1')

      expect(res.status).toBe(200)
      expect(res.body.productos).toEqual([])
      expect(res.body.total).toBe(0)
    })

    it('debe devolver 404 si el cliente no existe', async () => {
      prisma.cliente.findUnique.mockResolvedValue(null)

      const res = await request(app).get('/api/productos/por-preferencia/999')

      expect(res.status).toBe(404)
    })

    it('debe manejar errores internos', async () => {
      prisma.cliente.findUnique.mockRejectedValue(new Error('DB error'))

      const res = await request(app).get('/api/productos/por-preferencia/1')

      expect(res.status).toBe(500)
    })

    it('debe manejar preferencia con palabras vacías', async () => {
      prisma.cliente.findUnique.mockResolvedValue({ idCliente: 1, preferencia: '  ,  ,  ' })
      prisma.producto.findMany.mockResolvedValue([])

      const res = await request(app).get('/api/productos/por-preferencia/1')

      expect(res.status).toBe(200)
      expect(res.body.productos).toEqual([])
    })
  })
})
