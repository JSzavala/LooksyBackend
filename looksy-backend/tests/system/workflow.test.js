jest.mock('../../src/lib/prisma', () => {
  function buildMock () {
    const store = {}
    const handler = {
      findUnique: jest.fn((args) => {
        const entries = Object.values(store)
        if (!args?.where) return Promise.resolve(null)
        const key = Object.keys(args.where)[0]
        const val = Object.values(args.where)[0]
        return Promise.resolve(entries.find(e => e[key] === val) || null)
      }),
      findMany: jest.fn(() => Promise.resolve(Object.values(store))),
      create: jest.fn((args) => {
        const idKey = Object.keys(store).length === 0 ? 1 : Math.max(...Object.keys(store).map(Number)) + 1
        const idField = `id${Object.keys(store).length === 0 ? 'Usuario' : Object.keys(store)[0].replace(/^id/, '')}`
        const entry = { ...args.data, [Object.keys(store).length === 0 ? 'idUsuario' : idField]: idKey }
        store[idKey] = entry
        return Promise.resolve(entry)
      }),
    }
    return handler
  }

  return {
    usuario: buildMock(),
    tienda: buildMock(),
    producto: buildMock(),
    atuendo: buildMock(),
    venta: buildMock(),
    etiqueta: buildMock(),
    cliente: { findUnique: jest.fn() },
  }
})

const bcrypt = require('bcryptjs')
const request = require('supertest')
const app = require('../../app')

describe('System: Flujo completo de registro y autenticación', () => {
  const prisma = require('../../src/lib/prisma')

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('registra usuario, inicia sesión y obtiene datos', async () => {
    prisma.usuario.findUnique.mockResolvedValue(null)
    prisma.usuario.create.mockImplementation(async (args) => ({
      idUsuario: 1,
      nombre: args.data.nombre,
      correo: args.data.correo,
      rol: args.data.rol || 'cliente',
    }))

    const registerRes = await request(app)
      .post('/api/auth/register')
      .send({ nombre: 'Sistema Test', correo: 'sistema@test.com', contrasena: 'pass123' })

    expect(registerRes.status).toBe(201)
    expect(registerRes.body.usuario.nombre).toBe('Sistema Test')
    expect(registerRes.body.token).toBeDefined()

    const token = registerRes.body.token

    prisma.usuario.findUnique.mockResolvedValue({
      idUsuario: 1,
      nombre: 'Sistema Test',
      correo: 'sistema@test.com',
      contrasena: bcrypt.hashSync('pass123', 10),
      rol: 'cliente',
    })

    const loginRes = await request(app)
      .post('/api/auth/login')
      .send({ correo: 'sistema@test.com', contrasena: 'pass123' })

    expect(loginRes.status).toBe(200)
    expect(loginRes.body.usuario.nombre).toBe('Sistema Test')
    expect(loginRes.body.token).toBeDefined()

    prisma.usuario.findMany.mockResolvedValue([
      { idUsuario: 1, nombre: 'Sistema Test', correo: 'sistema@test.com', rol: 'cliente' },
    ])

    const usuariosRes = await request(app).get('/api/usuarios?q=Sistema')

    expect(usuariosRes.status).toBe(200)
    expect(usuariosRes.body.usuarios.length).toBe(1)
    expect(usuariosRes.body.usuarios[0].nombre).toBe('Sistema Test')
  })
})

describe('System: Flujo completo de tienda y producto', () => {
  const prisma = require('../../src/lib/prisma')

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('crea tienda, crea producto y lista productos', async () => {
    prisma.usuario.findUnique.mockResolvedValue({ idUsuario: 1, nombre: 'Admin' })

    prisma.tienda.create.mockResolvedValue({
      idTienda: 1, nombreTienda: 'Mi Tienda', direccion: 'Calle 123', contacto: '555-0000', idAdministrador: 1,
    })
    prisma.tienda.findUnique.mockImplementation(async (args) => {
      if (args.where.idTienda === 1) return { idTienda: 1, nombreTienda: 'Mi Tienda', direccion: 'Calle 123', contacto: '555-0000', idAdministrador: 1 }
      return null
    })

    const tiendaRes = await request(app)
      .post('/api/tiendas')
      .send({ nombreTienda: 'Mi Tienda', direccion: 'Calle 123', contacto: '555-0000', idAdministrador: 1 })

    expect(tiendaRes.status).toBe(201)
    expect(tiendaRes.body.tienda.nombreTienda).toBe('Mi Tienda')

    prisma.producto.create.mockResolvedValue({
      idProducto: 1, nombre: 'Producto Test', descripcion: 'Test', precio: 100, stock: 5, disponible: true, idTienda: 1, etiquetas: [],
    })

    const productRes = await request(app)
      .post('/api/productos')
      .send({ nombre: 'Producto Test', descripcion: 'Test', precio: 100, stock: 5, idTienda: 1 })

    expect(productRes.status).toBe(201)
    expect(productRes.body.producto.nombre).toBe('Producto Test')

    prisma.producto.findMany.mockResolvedValue([
      { idProducto: 1, nombre: 'Producto Test', descripcion: 'Test', precio: 100, stock: 5, disponible: true, idTienda: 1, tienda: { nombreTienda: 'Mi Tienda' }, etiquetas: [] },
    ])

    const listRes = await request(app).get('/api/productos')
    expect(listRes.status).toBe(200)
    expect(listRes.body.productos).toHaveLength(1)
  })
})

describe('System: Flujo completo de etiquetas', () => {
  const prisma = require('../../src/lib/prisma')

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('crea etiqueta, verifica duplicados y lista', async () => {
    prisma.etiqueta.findUnique.mockResolvedValue(null)

    prisma.etiqueta.create.mockResolvedValue({ idEtiqueta: 1, nombre: 'Moda' })

    const createRes = await request(app)
      .post('/api/etiquetas')
      .send({ nombre: 'Moda' })

    expect(createRes.status).toBe(201)
    expect(createRes.body.etiqueta.nombre).toBe('Moda')

    prisma.etiqueta.findUnique.mockResolvedValue({ idEtiqueta: 1, nombre: 'Moda' })

    const dupRes = await request(app)
      .post('/api/etiquetas')
      .send({ nombre: 'Moda' })

    expect(dupRes.status).toBe(409)
    expect(dupRes.body.error).toBe('Conflicto')

    prisma.etiqueta.findMany.mockResolvedValue([
      { idEtiqueta: 1, nombre: 'Moda', _count: { productos: 0 } },
    ])

    const listRes = await request(app).get('/api/etiquetas')
    expect(listRes.status).toBe(200)
    expect(listRes.body.etiquetas).toHaveLength(1)
  })
})
