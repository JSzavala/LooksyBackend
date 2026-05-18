jest.mock('../../src/lib/prisma', () => {
  function buildMock () {
    const store = {}
    let idSeq = 1
    return {
      findUnique: jest.fn((args) => {
        const entries = Object.values(store)
        if (!args?.where) return Promise.resolve(null)
        const key = Object.keys(args.where)[0]
        const val = Object.values(args.where)[0]
        return Promise.resolve(entries.find(e => e[key] === val) || null)
      }),
      findMany: jest.fn(() => Promise.resolve(Object.values(store))),
      create: jest.fn((args) => {
        const entry = { ...args.data, id: idSeq++ }
        store[entry.id] = entry
        return Promise.resolve(entry)
      }),
    }
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
const prisma = require('../../src/lib/prisma')
const app = require('../../app')

beforeEach(() => {
  jest.clearAllMocks()
})

describe('Regression: Auth', () => {
  const creds = { nombre: 'Reg Test', correo: 'reg@test.com', contrasena: 'pass123' }
  const hash = bcrypt.hashSync('pass123', 10)

  it('GET / no debe romperse tras cambios', async () => {
    const res = await request(app).get('/')
    expect(res.status).toBe(200)
    expect(res.text).toContain('correctamente')
  })

  it('registro con datos válidos debe funcionar', async () => {
    prisma.usuario.findUnique.mockResolvedValue(null)
    prisma.usuario.create.mockResolvedValue({ idUsuario: 1, nombre: creds.nombre, correo: creds.correo, rol: 'cliente' })
    const res = await request(app).post('/api/auth/register').send(creds)
    expect(res.status).toBe(201)
    expect(res.body.usuario.nombre).toBe(creds.nombre)
    expect(res.body.token).toBeDefined()
  })

  it('login con credenciales correctas debe funcionar', async () => {
    prisma.usuario.findUnique.mockResolvedValue({ idUsuario: 1, nombre: creds.nombre, correo: creds.correo, contrasena: hash, rol: 'cliente' })
    const res = await request(app).post('/api/auth/login').send({ correo: creds.correo, contrasena: creds.contrasena })
    expect(res.status).toBe(200)
    expect(res.body.token).toBeDefined()
  })

  it('login con contraseña incorrecta debe fallar', async () => {
    prisma.usuario.findUnique.mockResolvedValue({ idUsuario: 1, nombre: creds.nombre, correo: creds.correo, contrasena: hash, rol: 'cliente' })
    const res = await request(app).post('/api/auth/login').send({ correo: creds.correo, contrasena: 'wrong' })
    expect(res.status).toBe(401)
  })

  it('login con correo inexistente debe fallar', async () => {
    prisma.usuario.findUnique.mockResolvedValue(null)
    const res = await request(app).post('/api/auth/login').send({ correo: 'noexiste@test.com', contrasena: 'pass' })
    expect(res.status).toBe(401)
  })

  it('registro con datos vacíos debe fallar', async () => {
    const res = await request(app).post('/api/auth/register').send({})
    expect(res.status).toBe(400)
  })

  it('registro con correo duplicado debe fallar', async () => {
    prisma.usuario.findUnique.mockResolvedValue({ idUsuario: 1 })
    const res = await request(app).post('/api/auth/register').send(creds)
    expect(res.status).toBe(409)
  })
})

describe('Regression: Usuarios', () => {
  it('GET /api/usuarios sin query debe fallar con 400', async () => {
    const res = await request(app).get('/api/usuarios')
    expect(res.status).toBe(400)
  })

  it('GET /api/usuarios?q= debe fallar (query vacío)', async () => {
    const res = await request(app).get('/api/usuarios?q=')
    expect(res.status).toBe(400)
  })

  it('GET /api/usuarios?q=test con resultados debe funcionar', async () => {
    prisma.usuario.findMany.mockResolvedValue([{ idUsuario: 1, nombre: 'test', correo: 't@t.com', rol: 'cliente' }])
    const res = await request(app).get('/api/usuarios?q=test')
    expect(res.status).toBe(200)
    expect(res.body.usuarios.length).toBe(1)
  })

  it('GET /api/usuarios?q=zzz sin resultados debe devolver array vacío', async () => {
    prisma.usuario.findMany.mockResolvedValue([])
    const res = await request(app).get('/api/usuarios?q=zzz')
    expect(res.status).toBe(200)
    expect(res.body.usuarios).toEqual([])
    expect(res.body.total).toBe(0)
  })

  it('GET /api/usuarios/:id existente debe funcionar', async () => {
    prisma.usuario.findUnique.mockResolvedValue({ idUsuario: 1, nombre: 'Test', correo: 't@t.com', rol: 'cliente' })
    const res = await request(app).get('/api/usuarios/1')
    expect(res.status).toBe(200)
    expect(res.body.usuario.idUsuario).toBe(1)
  })

  it('GET /api/usuarios/:id inexistente debe dar 404', async () => {
    prisma.usuario.findUnique.mockResolvedValue(null)
    const res = await request(app).get('/api/usuarios/999')
    expect(res.status).toBe(404)
    expect(res.body.error).toBe('Usuario no encontrado')
  })

  it('POST /api/usuarios con datos válidos debe crear', async () => {
    prisma.usuario.findUnique.mockResolvedValue(null)
    prisma.usuario.create.mockResolvedValue({ idUsuario: 2, nombre: 'Nuevo', correo: 'nuevo@test.com', rol: 'cliente' })
    const res = await request(app).post('/api/usuarios').send({ nombre: 'Nuevo', correo: 'nuevo@test.com', contrasena: 'pass' })
    expect(res.status).toBe(201)
  })
})

describe('Regression: Productos', () => {
  it('GET /api/productos debe listar', async () => {
    prisma.producto.findMany.mockResolvedValue([])
    const res = await request(app).get('/api/productos')
    expect(res.status).toBe(200)
    expect(res.body).toHaveProperty('productos')
    expect(res.body).toHaveProperty('total')
  })

  it('GET /api/tiendas/:id/productos con tienda existente debe listar', async () => {
    prisma.tienda.findUnique.mockResolvedValue({ idTienda: 1, nombreTienda: 'T' })
    prisma.producto.findMany.mockResolvedValue([{ idProducto: 1, nombre: 'P', disponible: true }])
    const res = await request(app).get('/api/tiendas/1/productos')
    expect(res.status).toBe(200)
    expect(res.body.tienda.nombreTienda).toBe('T')
  })

  it('GET /api/tiendas/:id/productos con tienda inexistente debe dar 404', async () => {
    prisma.tienda.findUnique.mockResolvedValue(null)
    const res = await request(app).get('/api/tiendas/999/productos')
    expect(res.status).toBe(404)
  })

  it('POST /api/productos con datos válidos debe crear', async () => {
    prisma.tienda.findUnique.mockResolvedValue({ idTienda: 1, nombreTienda: 'T' })
    prisma.producto.create.mockResolvedValue({ idProducto: 1, nombre: 'Camisa', precio: 100, stock: 5, disponible: true, idTienda: 1, etiquetas: [] })
    const res = await request(app).post('/api/productos').send({ nombre: 'Camisa', precio: 100, idTienda: 1 })
    expect(res.status).toBe(201)
  })

  it('GET /api/productos/por-preferencia/:id con cliente sin preferencia debe devolver vacío', async () => {
    prisma.cliente.findUnique.mockResolvedValue({ idCliente: 1, preferencia: null })
    const res = await request(app).get('/api/productos/por-preferencia/1')
    expect(res.status).toBe(200)
    expect(res.body.productos).toEqual([])
  })

  it('GET /api/productos/por-preferencia/:id con cliente inexistente debe dar 404', async () => {
    prisma.cliente.findUnique.mockResolvedValue(null)
    const res = await request(app).get('/api/productos/por-preferencia/999')
    expect(res.status).toBe(404)
  })
})

describe('Regression: Tiendas', () => {
  it('GET /api/tiendas debe listar', async () => {
    prisma.tienda.findMany.mockResolvedValue([])
    const res = await request(app).get('/api/tiendas')
    expect(res.status).toBe(200)
    expect(res.body).toHaveProperty('tiendas')
  })

  it('POST /api/tiendas con datos válidos debe crear', async () => {
    prisma.usuario.findUnique.mockResolvedValue({ idUsuario: 1 })
    prisma.tienda.create.mockResolvedValue({ idTienda: 1, nombreTienda: 'Tienda', direccion: 'Calle', contacto: '555', idAdministrador: 1 })
    const res = await request(app).post('/api/tiendas').send({ nombreTienda: 'Tienda', direccion: 'Calle', contacto: '555', idAdministrador: 1 })
    expect(res.status).toBe(201)
  })

  it('POST /api/tiendas con admin inexistente debe dar 404', async () => {
    prisma.usuario.findUnique.mockResolvedValue(null)
    const res = await request(app).post('/api/tiendas').send({ nombreTienda: 'T', direccion: 'D', contacto: 'C', idAdministrador: 999 })
    expect(res.status).toBe(404)
  })
})

describe('Regression: Atuendos', () => {
  it('GET /api/atuendos debe listar', async () => {
    prisma.atuendo.findMany.mockResolvedValue([])
    const res = await request(app).get('/api/atuendos')
    expect(res.status).toBe(200)
    expect(res.body).toHaveProperty('atuendos')
  })

  it('POST /api/atuendos con datos válidos debe crear', async () => {
    prisma.usuario.findUnique.mockResolvedValue({ idUsuario: 1 })
    prisma.atuendo.create.mockResolvedValue({ idAtuendo: 1, nombre: 'Outfit', descripcion: 'Cool', imagen: 'url', fecha: new Date(), idUsuario: 1 })
    const res = await request(app).post('/api/atuendos').send({ nombre: 'Outfit', idUsuario: 1 })
    expect(res.status).toBe(201)
  })

  it('POST /api/atuendos con usuario inexistente debe dar 404', async () => {
    prisma.usuario.findUnique.mockResolvedValue(null)
    const res = await request(app).post('/api/atuendos').send({ nombre: 'Outfit', idUsuario: 999 })
    expect(res.status).toBe(404)
  })
})

describe('Regression: Pedidos', () => {
  it('GET /api/pedidos debe listar', async () => {
    prisma.venta.findMany.mockResolvedValue([])
    const res = await request(app).get('/api/pedidos')
    expect(res.status).toBe(200)
    expect(res.body).toHaveProperty('pedidos')
  })

  it('POST /api/pedidos con datos válidos debe crear', async () => {
    prisma.tienda.findUnique.mockResolvedValue({ idTienda: 1 })
    prisma.cliente.findUnique.mockResolvedValue({ idCliente: 1 })
    prisma.venta.create.mockResolvedValue({ idVenta: 1, estado: 'pendiente', fecha: new Date(), idTienda: 1, idCliente: 1, detalles: [] })
    const res = await request(app).post('/api/pedidos').send({ idTienda: 1, idCliente: 1, articulos: [{ idArticulo: 1, cantidad: 2, total: 100 }] })
    expect(res.status).toBe(201)
  })

  it('POST /api/pedidos sin artículos debe fallar', async () => {
    const res = await request(app).post('/api/pedidos').send({ idTienda: 1, idCliente: 1, articulos: [] })
    expect(res.status).toBe(400)
  })

  it('POST /api/pedidos con tienda inexistente debe dar 404', async () => {
    prisma.tienda.findUnique.mockResolvedValue(null)
    const res = await request(app).post('/api/pedidos').send({ idTienda: 999, idCliente: 1, articulos: [{ idArticulo: 1 }] })
    expect(res.status).toBe(404)
  })
})

describe('Regression: Etiquetas', () => {
  it('GET /api/etiquetas debe listar', async () => {
    prisma.etiqueta.findMany.mockResolvedValue([])
    const res = await request(app).get('/api/etiquetas')
    expect(res.status).toBe(200)
    expect(res.body).toHaveProperty('etiquetas')
  })

  it('POST /api/etiquetas con nombre válido debe crear', async () => {
    prisma.etiqueta.findUnique.mockResolvedValue(null)
    prisma.etiqueta.create.mockResolvedValue({ idEtiqueta: 1, nombre: 'Moda' })
    const res = await request(app).post('/api/etiquetas').send({ nombre: 'Moda' })
    expect(res.status).toBe(201)
  })

  it('POST /api/etiquetas con nombre duplicado debe dar 409', async () => {
    prisma.etiqueta.findUnique.mockResolvedValue({ idEtiqueta: 1, nombre: 'Moda' })
    const res = await request(app).post('/api/etiquetas').send({ nombre: 'Moda' })
    expect(res.status).toBe(409)
  })
})

describe('Regression: Errores 500 en todos los endpoints', () => {
  it('GET /api/productos con error DB debe dar 500', async () => {
    prisma.producto.findMany.mockRejectedValue(new Error('DB crash'))
    const res = await request(app).get('/api/productos')
    expect(res.status).toBe(500)
  })

  it('POST /api/productos con error DB debe dar 500', async () => {
    prisma.tienda.findUnique.mockRejectedValue(new Error('DB crash'))
    const res = await request(app).post('/api/productos').send({ nombre: 'X', precio: 1, idTienda: 1 })
    expect(res.status).toBe(500)
  })

  it('GET /api/usuarios con error DB debe dar 500', async () => {
    prisma.usuario.findMany.mockRejectedValue(new Error('DB crash'))
    const res = await request(app).get('/api/usuarios?q=test')
    expect(res.status).toBe(500)
  })

  it('POST /api/auth/register con error DB debe dar 500', async () => {
    prisma.usuario.findUnique.mockRejectedValue(new Error('DB crash'))
    const res = await request(app).post('/api/auth/register').send({ nombre: 'X', correo: 'x@x.com', contrasena: 'pass' })
    expect(res.status).toBe(500)
  })
})
