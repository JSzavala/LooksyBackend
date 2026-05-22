jest.mock('../../src/lib/prisma', () => ({
  venta: {
    findMany: jest.fn(),
    create: jest.fn(),
  },
  tienda: {
    findUnique: jest.fn(),
  },
  cliente: {
    findUnique: jest.fn(),
  },
}))

const request = require('supertest')
const express = require('express')
const prisma = require('../../src/lib/prisma')
const pedidoRoutes = require('../../src/routes/pedido.routes')

const app = express()
app.use(express.json())
app.use(pedidoRoutes)

describe('Pedido - Unit Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('GET /api/pedidos', () => {
    it('debe listar pedidos', async () => {
      prisma.venta.findMany.mockResolvedValue([
        { idVenta: 1, estado: 'pendiente', fecha: new Date(), idTienda: 1, idCliente: 1, tienda: { nombreTienda: 'T' }, cliente: { idCliente: 1, usuario: { nombre: 'U' } }, detalles: [] },
      ])

      const res = await request(app).get('/api/pedidos')

      expect(res.status).toBe(200)
      expect(res.body.pedidos).toHaveLength(1)
    })

    it('debe devolver lista vacía', async () => {
      prisma.venta.findMany.mockResolvedValue([])

      const res = await request(app).get('/api/pedidos')

      expect(res.status).toBe(200)
      expect(res.body.pedidos).toEqual([])
    })

    it('debe manejar errores internos', async () => {
      prisma.venta.findMany.mockRejectedValue(new Error('DB error'))

      const res = await request(app).get('/api/pedidos')

      expect(res.status).toBe(500)
    })
  })

  describe('POST /api/pedidos', () => {
    const pedidoValido = { idTienda: 1, idCliente: 1, articulos: [{ idArticulo: 1, cantidad: 2, total: 500 }] }

    it('debe crear un pedido', async () => {
      prisma.tienda.findUnique.mockResolvedValue({ idTienda: 1 })
      prisma.cliente.findUnique.mockResolvedValue({ idCliente: 1 })
      prisma.venta.create.mockResolvedValue({
        idVenta: 1, estado: 'pendiente', fecha: new Date(), idTienda: 1, idCliente: 1,
        detalles: [{ idArticulo: 1, cantidad: 2, total: 500 }],
      })

      const res = await request(app).post('/api/pedidos').send(pedidoValido)

      expect(res.status).toBe(201)
      expect(res.body.pedido).toBeDefined()
    })

    it('debe rechazar sin campos obligatorios', async () => {
      const res = await request(app).post('/api/pedidos').send({})

      expect(res.status).toBe(400)
    })

    it('debe rechazar sin artículos', async () => {
      const res = await request(app).post('/api/pedidos').send({ idTienda: 1, idCliente: 1, articulos: [] })

      expect(res.status).toBe(400)
    })

    it('debe devolver 404 si la tienda no existe', async () => {
      prisma.tienda.findUnique.mockResolvedValue(null)

      const res = await request(app).post('/api/pedidos').send(pedidoValido)

      expect(res.status).toBe(404)
    })

    it('debe devolver 404 si el cliente no existe', async () => {
      prisma.tienda.findUnique.mockResolvedValue({ idTienda: 1 })
      prisma.cliente.findUnique.mockResolvedValue(null)

      const res = await request(app).post('/api/pedidos').send(pedidoValido)

      expect(res.status).toBe(404)
    })

    it('debe manejar errores internos', async () => {
      prisma.tienda.findUnique.mockRejectedValue(new Error('DB error'))

      const res = await request(app).post('/api/pedidos').send(pedidoValido)

      expect(res.status).toBe(500)
    })

    it('debe crear pedido con valores por defecto en cantidad y total', async () => {
      prisma.tienda.findUnique.mockResolvedValue({ idTienda: 1 })
      prisma.cliente.findUnique.mockResolvedValue({ idCliente: 1 })
      prisma.venta.create.mockResolvedValue({
        idVenta: 1, estado: 'pendiente', fecha: new Date(), idTienda: 1, idCliente: 1,
        detalles: [{ idArticulo: 1, cantidad: 1, total: 0 }],
      })

      const res = await request(app)
        .post('/api/pedidos')
        .send({ idTienda: 1, idCliente: 1, articulos: [{ idArticulo: 1 }] })

      expect(res.status).toBe(201)
    })
  })
})
