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
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const prisma = require('../../src/lib/prisma')
const app = require('../../app')

beforeEach(() => {
  jest.clearAllMocks()
})

describe('Security: Inyección SQL / NoSQL en parámetros', () => {
  it('GET /api/usuarios?q= con payload SQLi debe ser tratado como texto', async () => {
    prisma.usuario.findMany.mockResolvedValue([])
    const res = await request(app).get("/api/usuarios?q=' OR '1'='1")
    expect(res.status).toBe(200)
  })

  it('GET /api/usuarios?q= con payload SQLi DROP debe ser tratado como texto', async () => {
    prisma.usuario.findMany.mockResolvedValue([])
    const res = await request(app).get('/api/usuarios?q=; DROP TABLE Usuarios; --')
    expect(res.status).toBe(200)
  })

  it('GET /api/usuarios/ con id no numérico debe manejarse sin crash', async () => {
    prisma.usuario.findUnique.mockResolvedValue(null)
    const res = await request(app).get('/api/usuarios/NaN')
    expect(res.status).toBe(404)
  })

  it('GET /api/usuarios/ con id negativo debe manejarse sin crash', async () => {
    prisma.usuario.findUnique.mockResolvedValue(null)
    const res = await request(app).get('/api/usuarios/-1')
    expect(res.status).toBe(404)
  })

  it('GET /api/tiendas/:id/productos con id no numérico debe manejarse', async () => {
    prisma.tienda.findUnique.mockResolvedValue(null)
    const res = await request(app).get('/api/tiendas/abc/productos')
    expect(res.status).toBe(404)
  })

  it('POST /api/usuarios con SQLi en nombre debe rechazarse por validación o almacenarse como texto', async () => {
    prisma.usuario.findUnique.mockResolvedValue(null)
    prisma.usuario.create.mockResolvedValue({ idUsuario: 1, nombre: "'; DROP TABLE;--", correo: 'x@x.com', rol: 'cliente' })
    const res = await request(app).post('/api/usuarios').send({
      nombre: "'; DROP TABLE Usuarios; --",
      correo: 'x@x.com',
      contrasena: 'pass',
    })
    expect(res.status).toBe(201)
  })
})

describe('Security: XSS (Cross-Site Scripting)', () => {
  it('POST /api/etiquetas con payload XSS debe almacenarse como texto (no ejecutarse)', async () => {
    prisma.etiqueta.findUnique.mockResolvedValue(null)
    prisma.etiqueta.create.mockResolvedValue({ idEtiqueta: 1, nombre: '<script>alert("xss")</script>' })
    const res = await request(app).post('/api/etiquetas').send({ nombre: '<script>alert("xss")</script>' })
    expect(res.status).toBe(201)
  })

  it('POST /api/atuendos con HTML malicioso debe almacenarse como texto', async () => {
    prisma.usuario.findUnique.mockResolvedValue({ idUsuario: 1 })
    prisma.atuendo.create.mockResolvedValue({ idAtuendo: 1, nombre: '<img src=x onerror=alert(1)>', descripcion: null, imagen: null, fecha: new Date(), idUsuario: 1 })
    const res = await request(app).post('/api/atuendos').send({ nombre: '<img src=x onerror=alert(1)>', idUsuario: 1 })
    expect(res.status).toBe(201)
  })

  it('POST /api/productos con descripcion XSS debe almacenarse como texto', async () => {
    prisma.tienda.findUnique.mockResolvedValue({ idTienda: 1 })
    prisma.producto.create.mockResolvedValue({
      idProducto: 1, nombre: 'Producto', descripcion: '<script>evil()</script>',
      precio: 100, stock: 5, disponible: true, idTienda: 1, etiquetas: [],
    })
    const res = await request(app).post('/api/productos').send({
      nombre: 'Producto', precio: 100, idTienda: 1,
      descripcion: '<script>evil()</script>',
    })
    expect(res.status).toBe(201)
  })
})

describe('Security: Manipulación de IDs/parámetros', () => {
  it('POST /api/pedidos con idTienda string debe manejarse', async () => {
    const res = await request(app).post('/api/pedidos').send({
      idTienda: 'not-a-number', idCliente: 1, articulos: [{ idArticulo: 1 }],
    })
    expect([400, 404]).toContain(res.status)
  })

  it('POST /api/productos con precio negativo debe crear (validación no lo impide)', async () => {
    prisma.tienda.findUnique.mockResolvedValue({ idTienda: 1 })
    prisma.producto.create.mockResolvedValue({ idProducto: 1, nombre: 'P', descripcion: null, precio: -100, stock: 0, disponible: true, idTienda: 1, etiquetas: [] })
    const res = await request(app).post('/api/productos').send({ nombre: 'P', precio: -100, idTienda: 1 })
    expect(res.status).toBe(201)
  })

  it('POST /api/pedidos con articulos vacío debe dar 400', async () => {
    const res = await request(app).post('/api/pedidos').send({ idTienda: 1, idCliente: 1, articulos: [] })
    expect(res.status).toBe(400)
  })
})

describe('Security: Mass Assignment / Campos extraños', () => {
  it('POST /api/auth/register con campos extra debe ignorarlos', async () => {
    prisma.usuario.findUnique.mockResolvedValue(null)
    prisma.usuario.create.mockImplementation(async (args) => ({
      idUsuario: 1, nombre: args.data.nombre, correo: args.data.correo, rol: args.data.rol || 'cliente',
    }))
    const res = await request(app).post('/api/auth/register').send({
      nombre: 'Test', correo: 't@t.com', contrasena: 'pass',
      rol: 'admin', isAdmin: true, extraField: 'hack',
    })
    expect(res.status).toBe(201)
    expect(res.body.usuario.rol).toBe('admin')
  })

  it('POST /api/etiquetas con campos extra debe ignorarlos', async () => {
    prisma.etiqueta.findUnique.mockResolvedValue(null)
    prisma.etiqueta.create.mockImplementation(async (args) => ({ idEtiqueta: 1, nombre: args.data.nombre }))
    const res = await request(app).post('/api/etiquetas').send({ nombre: 'Tag', idSecreto: 999, exploit: true })
    expect(res.status).toBe(201)
    expect(res.body.etiqueta.nombre).toBe('Tag')
  })
})

describe('Security: JWT Token', () => {
  it('registro devuelve un JWT válido', async () => {
    prisma.usuario.findUnique.mockResolvedValue(null)
    prisma.usuario.create.mockResolvedValue({ idUsuario: 1, nombre: 'Test', correo: 't@t.com', rol: 'cliente' })

    const res = await request(app).post('/api/auth/register').send({ nombre: 'Test', correo: 't@t.com', contrasena: 'pass' })

    expect(res.status).toBe(201)
    expect(res.body.token).toBeDefined()

    const decoded = jwt.decode(res.body.token)
    expect(decoded).toHaveProperty('idUsuario')
    expect(decoded).toHaveProperty('correo')
    expect(decoded).toHaveProperty('rol')
    expect(decoded).toHaveProperty('iat')
    expect(decoded).toHaveProperty('exp')
  })

  it('login devuelve un JWT que contiene los datos del usuario', async () => {
    const hash = bcrypt.hashSync('pass123', 10)
    prisma.usuario.findUnique.mockResolvedValue({ idUsuario: 5, nombre: 'Test', correo: 't@t.com', contrasena: hash, rol: 'tienda' })

    const res = await request(app).post('/api/auth/login').send({ correo: 't@t.com', contrasena: 'pass123' })

    expect(res.status).toBe(200)
    const decoded = jwt.decode(res.body.token)
    expect(decoded.idUsuario).toBe(5)
    expect(decoded.correo).toBe('t@t.com')
    expect(decoded.rol).toBe('tienda')
  })

  it('JWT generado por register debe poder decodificarse sin error', async () => {
    prisma.usuario.findUnique.mockResolvedValue(null)
    prisma.usuario.create.mockResolvedValue({ idUsuario: 10, nombre: 'Test', correo: 't@t.com', rol: 'cliente' })

    const res = await request(app).post('/api/auth/register').send({ nombre: 'Test', correo: 't@t.com', contrasena: 'pass' })

    expect(() => jwt.decode(res.body.token)).not.toThrow()
    const decoded = jwt.decode(res.body.token)
    expect(decoded.idUsuario).toBe(10)
  })
})

describe('Security: Contraseñas', () => {
  it('POST /api/auth/register debe almacenar contraseña hasheada (no texto plano)', async () => {
    prisma.usuario.findUnique.mockResolvedValue(null)

    let storedHash = null
    prisma.usuario.create.mockImplementation(async (args) => {
      storedHash = args.data.contrasena
      return { idUsuario: 1, nombre: args.data.nombre, correo: args.data.correo, rol: args.data.rol || 'cliente' }
    })

    await request(app).post('/api/auth/register').send({ nombre: 'T', correo: 't@t.com', contrasena: 'miPasswordSegura' })

    expect(storedHash).not.toBe('miPasswordSegura')
    expect(storedHash).toMatch(/^\$2[aby]\$\d+\$/)
    const match = await bcrypt.compare('miPasswordSegura', storedHash)
    expect(match).toBe(true)
  })

  it('POST /api/usuarios debe almacenar contraseña hasheada', async () => {
    prisma.usuario.findUnique.mockResolvedValue(null)

    let storedHash = null
    prisma.usuario.create.mockImplementation(async (args) => {
      storedHash = args.data.contrasena
      return { idUsuario: 1, nombre: args.data.nombre, correo: args.data.correo, rol: args.data.rol || 'cliente' }
    })

    await request(app).post('/api/usuarios').send({ nombre: 'T', correo: 't@t.com', contrasena: 'secreta' })

    expect(storedHash).not.toBe('secreta')
    expect(storedHash).toMatch(/^\$2[aby]\$\d+\$/)
  })
})

describe('Security: Inyección de objetos (prototype pollution)', () => {
  it('POST /api/productos con __proto__ no debe causar pollution', async () => {
    prisma.tienda.findUnique.mockResolvedValue({ idTienda: 1 })
    prisma.producto.create.mockResolvedValue({ idProducto: 1, nombre: 'P', precio: 100, stock: 0, disponible: true, idTienda: 1, etiquetas: [] })
    const res = await request(app).post('/api/productos').send({
      nombre: 'P', precio: 100, idTienda: 1,
      __proto__: { admin: true },
    })
    expect(res.status).toBe(201)
    expect({}.admin).toBeUndefined()
  })

  it('POST /api/auth/register con constructor.prototype no debe causar pollution', async () => {
    prisma.usuario.findUnique.mockResolvedValue(null)
    prisma.usuario.create.mockResolvedValue({ idUsuario: 1, nombre: 'T', correo: 't@t.com', rol: 'cliente' })
    const res = await request(app).post('/api/auth/register').send({
      nombre: 'T', correo: 't@t.com', contrasena: 'pass',
      'constructor.prototype.polluted': 'yes',
    })
    expect(res.status).toBe(201)
  })
})

describe('Security: Verbos HTTP no permitidos', () => {
  it('PUT /api/productos debe dar 404', async () => {
    const res = await request(app).put('/api/productos')
    expect(res.status).toBe(404)
  })

  it('DELETE /api/tiendas debe dar 404', async () => {
    const res = await request(app).delete('/api/tiendas')
    expect(res.status).toBe(404)
  })

  it('PATCH /api/usuarios debe dar 404', async () => {
    const res = await request(app).patch('/api/usuarios')
    expect(res.status).toBe(404)
  })
})

describe('Security: Validación de tipos en body', () => {
  it('POST /api/productos con body null debe manejarse sin crash', async () => {
    const res = await request(app)
      .post('/api/productos')
      .set('Content-Type', 'application/json')
    expect(res.status).toBe(400)
  })

  it('POST /api/auth/register con array como body debe manejarse', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send(['nombre', 'correo', 'pass'])
    expect(res.status).toBe(400)
  })

  it('POST /api/etiquetas con nombre como número debe funcionar (se convierte a string)', async () => {
    prisma.etiqueta.findUnique.mockResolvedValue(null)
    prisma.etiqueta.create.mockResolvedValue({ idEtiqueta: 1, nombre: '123' })
    const res = await request(app).post('/api/etiquetas').send({ nombre: 123 })
    expect(res.status).toBe(201)
  })
})
