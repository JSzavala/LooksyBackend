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
const prisma = require('../../src/lib/prisma')
const app = require('../../app')

const TIEMPO_MAXIMO_MS = 500

beforeEach(() => {
  jest.clearAllMocks()
  prisma.producto.findMany.mockResolvedValue(
    Array.from({ length: 50 }, (_, i) => ({
      idProducto: i + 1, nombre: `Producto ${i + 1}`, descripcion: 'Test',
      precio: 100 + i, stock: 10, disponible: true, idTienda: 1,
      tienda: { nombreTienda: 'Tienda A' },
      etiquetas: [],
    }))
  )
  prisma.tienda.findMany.mockResolvedValue(
    Array.from({ length: 20 }, (_, i) => ({
      idTienda: i + 1, nombreTienda: `Tienda ${i + 1}`, direccion: 'Dir', contacto: 'Tel', idAdministrador: 1,
      _count: { Productos: 5 },
    }))
  )
  prisma.atuendo.findMany.mockResolvedValue(
    Array.from({ length: 30 }, (_, i) => ({
      idAtuendo: i + 1, nombre: `Atuendo ${i + 1}`, descripcion: 'Desc', imagen: null,
      fecha: new Date(), idUsuario: 1,
      usuario: { idUsuario: 1, nombre: 'User' },
    }))
  )
  prisma.venta.findMany.mockResolvedValue(
    Array.from({ length: 25 }, (_, i) => ({
      idVenta: i + 1, estado: 'completado', fecha: new Date(), idTienda: 1, idCliente: 1,
      tienda: { nombreTienda: 'T' },
      cliente: { idCliente: 1, usuario: { nombre: 'U' } },
      detalles: [],
    }))
  )
  prisma.etiqueta.findMany.mockResolvedValue(
    Array.from({ length: 15 }, (_, i) => ({
      idEtiqueta: i + 1, nombre: `Etiqueta ${i + 1}`, _count: { productos: 3 },
    }))
  )
  prisma.usuario.findMany.mockResolvedValue(
    Array.from({ length: 10 }, (_, i) => ({
      idUsuario: i + 1, nombre: `Usuario ${i + 1}`, correo: `u${i + 1}@test.com`, rol: 'cliente',
    }))
  )
})

describe('Performance: Tiempo de respuesta individual', () => {
  const endpoints = [
    ['GET', '/api/productos'],
    ['GET', '/api/tiendas'],
    ['GET', '/api/atuendos'],
    ['GET', '/api/pedidos'],
    ['GET', '/api/etiquetas'],
    ['GET', '/api/usuarios?q=test'],
  ]

  it.each(endpoints)('%s %s debe responder en menos de %dms', async (method, path) => {
    const start = Date.now()
    const res = await request(app)[method.toLowerCase()](path)
    const duration = Date.now() - start

    expect(res.status).toBe(200)
    expect(duration).toBeLessThan(TIEMPO_MAXIMO_MS)
  })
})

describe('Performance: POST endpoints', () => {
  const bcrypt = require('bcryptjs')

  it('POST /api/auth/register debe responder rápido', async () => {
    prisma.usuario.findUnique.mockResolvedValue(null)
    prisma.usuario.create.mockResolvedValue({ idUsuario: 1, nombre: 'Test', correo: 't@t.com', rol: 'cliente' })

    const start = Date.now()
    const res = await request(app).post('/api/auth/register').send({ nombre: 'Test', correo: 't@t.com', contrasena: 'pass123' })
    const duration = Date.now() - start

    expect(res.status).toBe(201)
    expect(duration).toBeLessThan(TIEMPO_MAXIMO_MS)
  })

  it('POST /api/auth/login debe responder rápido', async () => {
    const hash = bcrypt.hashSync('pass123', 10)
    prisma.usuario.findUnique.mockResolvedValue({ idUsuario: 1, nombre: 'Test', correo: 't@t.com', contrasena: hash, rol: 'cliente' })

    const start = Date.now()
    const res = await request(app).post('/api/auth/login').send({ correo: 't@t.com', contrasena: 'pass123' })
    const duration = Date.now() - start

    expect(res.status).toBe(200)
    expect(duration).toBeLessThan(TIEMPO_MAXIMO_MS)
  })

  it('POST /api/productos debe responder rápido', async () => {
    prisma.tienda.findUnique.mockResolvedValue({ idTienda: 1 })
    prisma.producto.create.mockResolvedValue({ idProducto: 1, nombre: 'P', precio: 100, stock: 5, disponible: true, idTienda: 1, etiquetas: [] })

    const start = Date.now()
    const res = await request(app).post('/api/productos').send({ nombre: 'Producto', precio: 100, idTienda: 1 })
    const duration = Date.now() - start

    expect(res.status).toBe(201)
    expect(duration).toBeLessThan(TIEMPO_MAXIMO_MS)
  })

  it('POST /api/etiquetas debe responder rápido', async () => {
    prisma.etiqueta.findUnique.mockResolvedValue(null)
    prisma.etiqueta.create.mockResolvedValue({ idEtiqueta: 1, nombre: 'Tag' })

    const start = Date.now()
    const res = await request(app).post('/api/etiquetas').send({ nombre: 'Tag' })
    const duration = Date.now() - start

    expect(res.status).toBe(201)
    expect(duration).toBeLessThan(TIEMPO_MAXIMO_MS)
  })

  it('POST /api/tiendas debe responder rápido', async () => {
    prisma.usuario.findUnique.mockResolvedValue({ idUsuario: 1 })
    prisma.tienda.create.mockResolvedValue({ idTienda: 1, nombreTienda: 'T', direccion: 'D', contacto: 'C', idAdministrador: 1 })

    const start = Date.now()
    const res = await request(app).post('/api/tiendas').send({ nombreTienda: 'T', direccion: 'D', contacto: 'C', idAdministrador: 1 })
    const duration = Date.now() - start

    expect(res.status).toBe(201)
    expect(duration).toBeLessThan(TIEMPO_MAXIMO_MS)
  })
})

describe('Performance: Validación (debe ser más rápida que DB)', () => {
  it('POST /api/productos sin campos debe responder en < 100ms', async () => {
    const start = Date.now()
    const res = await request(app).post('/api/productos').send({})
    const duration = Date.now() - start

    expect(res.status).toBe(400)
    expect(duration).toBeLessThan(100)
  })

  it('GET /api/usuarios sin query debe responder en < 100ms', async () => {
    const start = Date.now()
    const res = await request(app).get('/api/usuarios')
    const duration = Date.now() - start

    expect(res.status).toBe(400)
    expect(duration).toBeLessThan(100)
  })

  it('POST /api/etiquetas vacío debe responder en < 100ms', async () => {
    const start = Date.now()
    const res = await request(app).post('/api/etiquetas').send({})
    const duration = Date.now() - start

    expect(res.status).toBe(400)
    expect(duration).toBeLessThan(100)
  })
})

describe('Performance: Carga concurrente (10 requests simultáneas)', () => {
  it('GET /api/productos con 10 requests concurrentes debe responder todas', async () => {
    const requests = Array.from({ length: 10 }, () =>
      request(app).get('/api/productos')
    )

    const start = Date.now()
    const results = await Promise.all(requests)
    const totalTime = Date.now() - start

    results.forEach(r => expect(r.status).toBe(200))
    expect(results.length).toBe(10)
    expect(totalTime).toBeLessThan(2000)
  })

  it('GET /api/tiendas con 10 requests concurrentes debe responder todas', async () => {
    const requests = Array.from({ length: 10 }, () =>
      request(app).get('/api/tiendas')
    )

    const start = Date.now()
    const results = await Promise.all(requests)
    const totalTime = Date.now() - start

    results.forEach(r => expect(r.status).toBe(200))
    expect(results.length).toBe(10)
    expect(totalTime).toBeLessThan(2000)
  })

  it('Mezcla de 5 GET + 5 POST concurrentes debe responder todas', async () => {
    prisma.usuario.findUnique.mockResolvedValue(null)
    prisma.usuario.create.mockResolvedValue({ idUsuario: 1, nombre: 'C', correo: 'c@c.com', rol: 'cliente' })

    const mix = [
      ...Array.from({ length: 5 }, () => request(app).get('/api/productos')),
      ...Array.from({ length: 5 }, () =>
        request(app).post('/api/auth/register').send({ nombre: 'C', correo: 'c@c.com', contrasena: 'pass' })
      ),
    ]

    const start = Date.now()
    const results = await Promise.all(mix)
    const totalTime = Date.now() - start

    expect(results.length).toBe(10)
    expect(totalTime).toBeLessThan(3000)
  })
})

describe('Performance: Gran volumen de datos simulados', () => {
  it('GET /api/productos con 500 productos debe responder rápido', async () => {
    prisma.producto.findMany.mockResolvedValue(
      Array.from({ length: 500 }, (_, i) => ({
        idProducto: i + 1, nombre: `P${i}`, descripcion: 'X'.repeat(100),
        precio: Math.random() * 1000, stock: 100, disponible: true, idTienda: 1,
        tienda: { nombreTienda: 'T' },
        etiquetas: [{ etiqueta: { idEtiqueta: 1, nombre: 'Tag' } }],
      }))
    )

    const start = Date.now()
    const res = await request(app).get('/api/productos')
    const duration = Date.now() - start

    expect(res.status).toBe(200)
    expect(res.body.productos.length).toBe(500)
    expect(duration).toBeLessThan(1000)
  })

  it('GET /api/usuarios?q=test con 200 resultados debe responder rápido', async () => {
    prisma.usuario.findMany.mockResolvedValue(
      Array.from({ length: 200 }, (_, i) => ({
        idUsuario: i + 1, nombre: `Test User ${i}`, correo: `test${i}@test.com`, rol: 'cliente',
      }))
    )

    const start = Date.now()
    const res = await request(app).get('/api/usuarios?q=test')
    const duration = Date.now() - start

    expect(res.status).toBe(200)
    expect(res.body.usuarios.length).toBe(200)
    expect(duration).toBeLessThan(1000)
  })
})
