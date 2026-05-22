jest.mock('../../src/lib/prisma', () => ({
  tienda: {
    findMany: jest.fn(),
    findUnique: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
  },
  usuario: {
    findUnique: jest.fn(),
  },
}))

const request = require('supertest')
const express = require('express')
const prisma = require('../../src/lib/prisma')
const tiendaRoutes = require('../../src/routes/tienda.routes')

const app = express()
app.use(express.json())
app.use(tiendaRoutes)

describe('Tienda - Unit Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('GET /api/tiendas', () => {
    it('debe listar tiendas', async () => {
      prisma.tienda.findMany.mockResolvedValue([
        { idTienda: 1, nombreTienda: 'Tienda A', direccion: 'Dir 1', contacto: '123', idAdministrador: 1, _count: { Productos: 5 } },
      ])

      const res = await request(app).get('/api/tiendas')

      expect(res.status).toBe(200)
      expect(res.body.tiendas).toHaveLength(1)
      expect(res.body.total).toBe(1)
    })

    it('debe devolver lista vacía', async () => {
      prisma.tienda.findMany.mockResolvedValue([])

      const res = await request(app).get('/api/tiendas')

      expect(res.status).toBe(200)
      expect(res.body.tiendas).toEqual([])
    })

    it('debe manejar errores internos', async () => {
      prisma.tienda.findMany.mockRejectedValue(new Error('DB error'))

      const res = await request(app).get('/api/tiendas')

      expect(res.status).toBe(500)
    })
  })

  describe('GET /api/tiendas/:id', () => {
    it('debe obtener una tienda por id', async () => {
      prisma.tienda.findUnique.mockResolvedValue({ idTienda: 1, nombreTienda: 'Tienda A', direccion: 'Dir 1', contacto: '123', idAdministrador: 1 })

      const res = await request(app).get('/api/tiendas/1')

      expect(res.status).toBe(200)
      expect(res.body.tienda.nombreTienda).toBe('Tienda A')
    })

    it('debe devolver 404 si no existe', async () => {
      prisma.tienda.findUnique.mockResolvedValue(null)

      const res = await request(app).get('/api/tiendas/999')

      expect(res.status).toBe(404)
    })

    it('debe manejar errores internos', async () => {
      prisma.tienda.findUnique.mockRejectedValue(new Error('DB error'))

      const res = await request(app).get('/api/tiendas/1')

      expect(res.status).toBe(500)
    })
  })

  describe('POST /api/tiendas', () => {
    const tiendaValida = { nombreTienda: 'Nueva Tienda', direccion: 'Dir', contacto: '555', idAdministrador: 1 }

    it('debe crear una tienda', async () => {
      prisma.usuario.findUnique.mockResolvedValue({ idUsuario: 1, nombre: 'Admin' })
      prisma.tienda.create.mockResolvedValue({ idTienda: 1, nombreTienda: 'Nueva Tienda', direccion: 'Dir', contacto: '555', idAdministrador: 1 })

      const res = await request(app).post('/api/tiendas').send(tiendaValida)

      expect(res.status).toBe(201)
      expect(res.body.tienda).toBeDefined()
    })

    it('debe rechazar sin campos obligatorios', async () => {
      const res = await request(app).post('/api/tiendas').send({ nombreTienda: 'Solo nombre' })

      expect(res.status).toBe(400)
    })

    it('debe rechazar con administrador inexistente', async () => {
      prisma.usuario.findUnique.mockResolvedValue(null)

      const res = await request(app).post('/api/tiendas').send(tiendaValida)

      expect(res.status).toBe(404)
    })

    it('debe manejar errores internos', async () => {
      prisma.usuario.findUnique.mockRejectedValue(new Error('DB error'))

      const res = await request(app).post('/api/tiendas').send(tiendaValida)

      expect(res.status).toBe(500)
    })
  })

  describe('PUT /api/tiendas/:id', () => {
    it('debe actualizar una tienda', async () => {
      prisma.tienda.findUnique.mockResolvedValue({ idTienda: 1 })
      prisma.tienda.update.mockResolvedValue({ idTienda: 1, nombreTienda: 'Editada', direccion: 'Nueva Dir', contacto: '999', idAdministrador: 1 })

      const res = await request(app).put('/api/tiendas/1').send({ nombreTienda: 'Editada', direccion: 'Nueva Dir' })

      expect(res.status).toBe(200)
      expect(res.body.tienda.nombreTienda).toBe('Editada')
    })

    it('debe devolver 404 si no existe', async () => {
      prisma.tienda.findUnique.mockResolvedValue(null)

      const res = await request(app).put('/api/tiendas/999').send({ nombreTienda: 'Test' })

      expect(res.status).toBe(404)
    })

    it('debe manejar errores internos', async () => {
      prisma.tienda.findUnique.mockRejectedValue(new Error('DB error'))

      const res = await request(app).put('/api/tiendas/1').send({ nombreTienda: 'Test' })

      expect(res.status).toBe(500)
    })

    it('debe actualizar con todos los campos incluyendo contacto', async () => {
      prisma.tienda.findUnique.mockResolvedValue({ idTienda: 1 })
      prisma.tienda.update.mockResolvedValue({ idTienda: 1, nombreTienda: 'T', direccion: 'D', contacto: '999', idAdministrador: 1 })

      const res = await request(app).put('/api/tiendas/1').send({ nombreTienda: 'T', direccion: 'D', contacto: '999' })

      expect(res.status).toBe(200)
    })
  })
})
