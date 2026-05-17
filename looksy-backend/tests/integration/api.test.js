jest.mock('../../src/lib/prisma', () => ({
  usuario: { findUnique: jest.fn(), findMany: jest.fn(), create: jest.fn() },
  tienda: { findUnique: jest.fn(), findMany: jest.fn(), create: jest.fn() },
  producto: { findUnique: jest.fn(), findMany: jest.fn(), create: jest.fn() },
  atuendo: { findMany: jest.fn(), create: jest.fn() },
  venta: { findMany: jest.fn(), create: jest.fn() },
  etiqueta: { findMany: jest.fn(), create: jest.fn(), findUnique: jest.fn() },
  cliente: { findUnique: jest.fn() },
}))

const request = require('supertest')
const app = require('../../app')

describe('API Integration Tests', () => {
  const prisma = require('../../src/lib/prisma')

  beforeEach(() => {
    jest.clearAllMocks()
    prisma.producto.findMany.mockResolvedValue([])
    prisma.tienda.findMany.mockResolvedValue([])
    prisma.atuendo.findMany.mockResolvedValue([])
    prisma.venta.findMany.mockResolvedValue([])
    prisma.etiqueta.findMany.mockResolvedValue([])
  })

  describe('GET /', () => {
    it('health-check debe responder correctamente', async () => {
      const res = await request(app).get('/')
      expect(res.status).toBe(200)
      expect(res.text).toContain('correctamente')
    })
  })

  describe('GET /api/productos', () => {
    it('devuelve lista de productos', async () => {
      const res = await request(app).get('/api/productos')
      expect(res.status).toBe(200)
      expect(res.body).toHaveProperty('productos')
      expect(res.body).toHaveProperty('total')
    })
  })

  describe('GET /api/tiendas', () => {
    it('devuelve lista de tiendas', async () => {
      const res = await request(app).get('/api/tiendas')
      expect(res.status).toBe(200)
      expect(res.body).toHaveProperty('tiendas')
    })
  })

  describe('GET /api/usuarios?q=test', () => {
    it('busca usuarios por nombre', async () => {
      prisma.usuario.findMany.mockResolvedValue([{ idUsuario: 1, nombre: 'Test', correo: 't@t.com', rol: 'cliente' }])
      const res = await request(app).get('/api/usuarios?q=test')
      expect(res.status).toBe(200)
      expect(res.body.usuarios).toHaveLength(1)
    })
  })

  describe('GET /api/usuarios (sin query)', () => {
    it('rechaza búsqueda sin parámetro q', async () => {
      const res = await request(app).get('/api/usuarios')
      expect(res.status).toBe(400)
    })
  })

  describe('GET /api/atuendos', () => {
    it('devuelve lista de atuendos', async () => {
      const res = await request(app).get('/api/atuendos')
      expect(res.status).toBe(200)
      expect(res.body).toHaveProperty('atuendos')
    })
  })

  describe('GET /api/pedidos', () => {
    it('devuelve lista de pedidos', async () => {
      const res = await request(app).get('/api/pedidos')
      expect(res.status).toBe(200)
      expect(res.body).toHaveProperty('pedidos')
    })
  })

  describe('GET /api/etiquetas', () => {
    it('devuelve lista de etiquetas', async () => {
      const res = await request(app).get('/api/etiquetas')
      expect(res.status).toBe(200)
      expect(res.body).toHaveProperty('etiquetas')
    })
  })

  describe('POST /api/auth/register', () => {
    it('valida campos obligatorios en registro', async () => {
      const res = await request(app).post('/api/auth/register').send({})
      expect(res.status).toBe(400)
      expect(res.body.error).toBe('Parámetros requeridos')
    })
  })

  describe('POST /api/productos', () => {
    it('valida campos obligatorios en producto', async () => {
      const res = await request(app).post('/api/productos').send({})
      expect(res.status).toBe(400)
      expect(res.body.error).toBe('Parámetros requeridos')
    })
  })

  describe('POST /api/tiendas', () => {
    it('valida campos obligatorios en tienda', async () => {
      const res = await request(app).post('/api/tiendas').send({})
      expect(res.status).toBe(400)
      expect(res.body.error).toBe('Parámetros requeridos')
    })
  })

  describe('POST /api/etiquetas', () => {
    it('valida campo nombre en etiqueta', async () => {
      const res = await request(app).post('/api/etiquetas').send({})
      expect(res.status).toBe(400)
      expect(res.body.error).toBe('Parámetros requeridos')
    })
  })

  describe('POST /api/atuendos', () => {
    it('valida campos obligatorios en atuendo', async () => {
      const res = await request(app).post('/api/atuendos').send({})
      expect(res.status).toBe(400)
      expect(res.body.error).toBe('Parámetros requeridos')
    })
  })

  describe('POST /api/pedidos', () => {
    it('valida campos obligatorios en pedido', async () => {
      const res = await request(app).post('/api/pedidos').send({})
      expect(res.status).toBe(400)
      expect(res.body.error).toBe('Parámetros requeridos')
    })
  })
})
