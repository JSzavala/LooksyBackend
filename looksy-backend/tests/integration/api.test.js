jest.mock('../../src/lib/prisma', () => ({
  usuario: { findUnique: jest.fn(), findMany: jest.fn(), create: jest.fn(), update: jest.fn() },
  tienda: { findUnique: jest.fn(), findMany: jest.fn(), create: jest.fn(), update: jest.fn() },
  producto: { findUnique: jest.fn(), findMany: jest.fn(), create: jest.fn(), update: jest.fn(), delete: jest.fn() },
  atuendo: { findMany: jest.fn(), create: jest.fn() },
  venta: { findMany: jest.fn(), create: jest.fn() },
  etiqueta: { findMany: jest.fn(), create: jest.fn(), findUnique: jest.fn() },
  cliente: { findUnique: jest.fn() },
}))

const request = require('supertest')
const app = require('../../app')
const bcrypt = require('bcryptjs')

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
      prisma.producto.findMany.mockResolvedValue([{ idProducto: 1, nombre: 'P', descripcion: 'D', precio: 100, stock: 5, disponible: true, idTienda: 1, tienda: { nombreTienda: 'T' }, etiquetas: [] }])
      const res = await request(app).get('/api/productos')
      expect(res.status).toBe(200)
      expect(res.body.productos).toHaveLength(1)
    })

    it('maneja error de base de datos', async () => {
      prisma.producto.findMany.mockRejectedValue(new Error('DB error'))
      const res = await request(app).get('/api/productos')
      expect(res.status).toBe(500)
    })
  })

  describe('GET /api/tiendas', () => {
    it('devuelve lista de tiendas', async () => {
      prisma.tienda.findMany.mockResolvedValue([{ idTienda: 1, nombreTienda: 'T', direccion: 'D', contacto: 'C', idAdministrador: 1, _count: { Productos: 0 } }])
      const res = await request(app).get('/api/tiendas')
      expect(res.status).toBe(200)
      expect(res.body).toHaveProperty('tiendas')
    })

    it('maneja error de base de datos', async () => {
      prisma.tienda.findMany.mockRejectedValue(new Error('DB error'))
      const res = await request(app).get('/api/tiendas')
      expect(res.status).toBe(500)
    })
  })

  describe('GET /api/tiendas/:id', () => {
    it('devuelve una tienda por id', async () => {
      prisma.tienda.findUnique.mockResolvedValue({ idTienda: 1, nombreTienda: 'T', direccion: 'D', contacto: 'C', idAdministrador: 1 })
      const res = await request(app).get('/api/tiendas/1')
      expect(res.status).toBe(200)
      expect(res.body.tienda).toBeDefined()
    })

    it('devuelve 404 si no existe', async () => {
      prisma.tienda.findUnique.mockResolvedValue(null)
      const res = await request(app).get('/api/tiendas/999')
      expect(res.status).toBe(404)
    })
  })

  describe('GET /api/usuarios', () => {
    it('busca usuarios por nombre', async () => {
      prisma.usuario.findMany.mockResolvedValue([{ idUsuario: 1, nombre: 'Test', correo: 't@t.com', rol: 'cliente' }])
      const res = await request(app).get('/api/usuarios?q=test')
      expect(res.status).toBe(200)
      expect(res.body.usuarios).toHaveLength(1)
    })

    it('rechaza búsqueda sin parámetro q', async () => {
      const res = await request(app).get('/api/usuarios')
      expect(res.status).toBe(400)
    })

    it('maneja error de base de datos', async () => {
      prisma.usuario.findMany.mockRejectedValue(new Error('DB error'))
      const res = await request(app).get('/api/usuarios?q=test')
      expect(res.status).toBe(500)
    })
  })

  describe('GET /api/usuarios/:id', () => {
    it('devuelve un usuario por id', async () => {
      prisma.usuario.findUnique.mockResolvedValue({ idUsuario: 1, nombre: 'Test', correo: 't@t.com', rol: 'cliente' })
      const res = await request(app).get('/api/usuarios/1')
      expect(res.status).toBe(200)
      expect(res.body.usuario).toBeDefined()
    })

    it('devuelve 404 si no existe', async () => {
      prisma.usuario.findUnique.mockResolvedValue(null)
      const res = await request(app).get('/api/usuarios/999')
      expect(res.status).toBe(404)
    })
  })

  describe('GET /api/atuendos', () => {
    it('devuelve lista de atuendos', async () => {
      prisma.atuendo.findMany.mockResolvedValue([{ idAtuendo: 1, nombre: 'A', descripcion: 'D', imagen: null, fecha: new Date(), idUsuario: 1, usuario: { idUsuario: 1, nombre: 'U' } }])
      const res = await request(app).get('/api/atuendos')
      expect(res.status).toBe(200)
      expect(res.body).toHaveProperty('atuendos')
    })

    it('maneja error de base de datos', async () => {
      prisma.atuendo.findMany.mockRejectedValue(new Error('DB error'))
      const res = await request(app).get('/api/atuendos')
      expect(res.status).toBe(500)
    })
  })

  describe('GET /api/pedidos', () => {
    it('devuelve lista de pedidos', async () => {
      prisma.venta.findMany.mockResolvedValue([{ idVenta: 1, estado: 'pendiente', fecha: new Date(), idTienda: 1, idCliente: 1, tienda: { nombreTienda: 'T' }, cliente: { idCliente: 1, usuario: { nombre: 'U' } }, detalles: [] }])
      const res = await request(app).get('/api/pedidos')
      expect(res.status).toBe(200)
      expect(res.body).toHaveProperty('pedidos')
    })

    it('maneja error de base de datos', async () => {
      prisma.venta.findMany.mockRejectedValue(new Error('DB error'))
      const res = await request(app).get('/api/pedidos')
      expect(res.status).toBe(500)
    })
  })

  describe('GET /api/etiquetas', () => {
    it('devuelve lista de etiquetas', async () => {
      prisma.etiqueta.findMany.mockResolvedValue([{ idEtiqueta: 1, nombre: 'E', _count: { productos: 0 } }])
      const res = await request(app).get('/api/etiquetas')
      expect(res.status).toBe(200)
      expect(res.body).toHaveProperty('etiquetas')
    })

    it('maneja error de base de datos', async () => {
      prisma.etiqueta.findMany.mockRejectedValue(new Error('DB error'))
      const res = await request(app).get('/api/etiquetas')
      expect(res.status).toBe(500)
    })
  })

  describe('GET /api/productos/por-preferencia/:idCliente', () => {
    it('devuelve productos por preferencia', async () => {
      prisma.cliente.findUnique.mockResolvedValue({ idCliente: 1, preferencia: 'ropa' })
      prisma.producto.findMany.mockResolvedValue([{ idProducto: 1, nombre: 'Camisa', descripcion: 'Ropa', precio: 100, stock: 5, disponible: true, idTienda: 1, tienda: { nombreTienda: 'T' } }])
      const res = await request(app).get('/api/productos/por-preferencia/1')
      expect(res.status).toBe(200)
      expect(res.body.productos).toHaveLength(1)
    })

    it('devuelve 404 si cliente no existe', async () => {
      prisma.cliente.findUnique.mockResolvedValue(null)
      const res = await request(app).get('/api/productos/por-preferencia/999')
      expect(res.status).toBe(404)
    })
  })

  describe('POST /api/auth/register', () => {
    it('registra un usuario exitosamente', async () => {
      prisma.usuario.findUnique.mockResolvedValue(null)
      prisma.usuario.create.mockResolvedValue({ idUsuario: 1, nombre: 'Test', correo: 't@t.com', rol: 'cliente' })
      const res = await request(app).post('/api/auth/register').send({ nombre: 'Test', correo: 't@t.com', contrasena: '123456' })
      expect(res.status).toBe(201)
      expect(res.body.token).toBeDefined()
    })

    it('valida campos obligatorios en registro', async () => {
      const res = await request(app).post('/api/auth/register').send({})
      expect(res.status).toBe(400)
      expect(res.body.error).toBe('Parámetros requeridos')
    })
  })

  describe('POST /api/auth/login', () => {
    it('inicia sesión exitosamente', async () => {
      prisma.usuario.findUnique.mockResolvedValue({ idUsuario: 1, nombre: 'Test', correo: 't@t.com', contrasena: bcrypt.hashSync('123456', 10), rol: 'cliente' })
      const res = await request(app).post('/api/auth/login').send({ correo: 't@t.com', contrasena: '123456' })
      expect(res.status).toBe(200)
      expect(res.body.token).toBeDefined()
    })

    it('rechaza credenciales inválidas', async () => {
      prisma.usuario.findUnique.mockResolvedValue(null)
      const res = await request(app).post('/api/auth/login').send({ correo: 'no@existe.com', contrasena: 'x' })
      expect(res.status).toBe(401)
    })
  })

  describe('POST /api/productos', () => {
    it('crea un producto exitosamente', async () => {
      prisma.tienda.findUnique.mockResolvedValue({ idTienda: 1, nombreTienda: 'T' })
      prisma.producto.create.mockResolvedValue({ idProducto: 1, nombre: 'Camisa', descripcion: null, precio: 299, stock: 0, disponible: true, idTienda: 1, etiquetas: [] })
      const res = await request(app).post('/api/productos').send({ nombre: 'Camisa', precio: 299, idTienda: 1 })
      expect(res.status).toBe(201)
    })

    it('valida campos obligatorios en producto', async () => {
      const res = await request(app).post('/api/productos').send({})
      expect(res.status).toBe(400)
    })
  })

  describe('POST /api/tiendas', () => {
    it('crea una tienda exitosamente', async () => {
      prisma.usuario.findUnique.mockResolvedValue({ idUsuario: 1 })
      prisma.tienda.create.mockResolvedValue({ idTienda: 1, nombreTienda: 'T', direccion: 'D', contacto: 'C', idAdministrador: 1 })
      const res = await request(app).post('/api/tiendas').send({ nombreTienda: 'T', direccion: 'D', contacto: 'C', idAdministrador: 1 })
      expect(res.status).toBe(201)
    })

    it('valida campos obligatorios en tienda', async () => {
      const res = await request(app).post('/api/tiendas').send({})
      expect(res.status).toBe(400)
    })
  })

  describe('POST /api/etiquetas', () => {
    it('crea una etiqueta exitosamente', async () => {
      prisma.etiqueta.findUnique.mockResolvedValue(null)
      prisma.etiqueta.create.mockResolvedValue({ idEtiqueta: 1, nombre: 'Nueva' })
      const res = await request(app).post('/api/etiquetas').send({ nombre: 'Nueva' })
      expect(res.status).toBe(201)
    })

    it('valida campo nombre en etiqueta', async () => {
      const res = await request(app).post('/api/etiquetas').send({})
      expect(res.status).toBe(400)
    })
  })

  describe('POST /api/atuendos', () => {
    it('crea un atuendo exitosamente', async () => {
      prisma.usuario.findUnique.mockResolvedValue({ idUsuario: 1 })
      prisma.atuendo.create.mockResolvedValue({ idAtuendo: 1, nombre: 'Look', descripcion: 'D', imagen: null, fecha: new Date(), idUsuario: 1 })
      const res = await request(app).post('/api/atuendos').send({ nombre: 'Look', idUsuario: 1 })
      expect(res.status).toBe(201)
    })

    it('valida campos obligatorios en atuendo', async () => {
      const res = await request(app).post('/api/atuendos').send({})
      expect(res.status).toBe(400)
    })
  })

  describe('POST /api/pedidos', () => {
    it('crea un pedido exitosamente', async () => {
      prisma.tienda.findUnique.mockResolvedValue({ idTienda: 1 })
      prisma.cliente.findUnique.mockResolvedValue({ idCliente: 1 })
      prisma.venta.create.mockResolvedValue({ idVenta: 1, estado: 'pendiente', fecha: new Date(), idTienda: 1, idCliente: 1, detalles: [{ idArticulo: 1, cantidad: 1, total: 100 }] })
      const res = await request(app).post('/api/pedidos').send({ idTienda: 1, idCliente: 1, articulos: [{ idArticulo: 1, cantidad: 1, total: 100 }] })
      expect(res.status).toBe(201)
    })

    it('valida campos obligatorios en pedido', async () => {
      const res = await request(app).post('/api/pedidos').send({})
      expect(res.status).toBe(400)
    })
  })

  describe('PUT /api/productos/:idProducto', () => {
    it('actualiza un producto exitosamente', async () => {
      prisma.producto.findUnique.mockResolvedValue({ idProducto: 1, nombre: 'P', idTienda: 1 })
      prisma.producto.update.mockResolvedValue({ idProducto: 1, nombre: 'P Editado', descripcion: null, precio: 399, stock: 5, disponible: true, idTienda: 1, etiquetas: [] })
      const res = await request(app).put('/api/productos/1').send({ nombre: 'P Editado', precio: 399 })
      expect(res.status).toBe(200)
    })

    it('devuelve 404 si no existe', async () => {
      prisma.producto.findUnique.mockResolvedValue(null)
      const res = await request(app).put('/api/productos/999').send({ nombre: 'Test' })
      expect(res.status).toBe(404)
    })
  })

  describe('DELETE /api/productos/:idProducto', () => {
    it('elimina un producto exitosamente', async () => {
      prisma.producto.findUnique.mockResolvedValue({ idProducto: 1, nombre: 'P' })
      prisma.producto.delete.mockResolvedValue({ idProducto: 1 })
      const res = await request(app).delete('/api/productos/1')
      expect(res.status).toBe(200)
    })

    it('devuelve 404 si no existe', async () => {
      prisma.producto.findUnique.mockResolvedValue(null)
      const res = await request(app).delete('/api/productos/999')
      expect(res.status).toBe(404)
    })
  })

  describe('PUT /api/tiendas/:id', () => {
    it('actualiza una tienda exitosamente', async () => {
      prisma.tienda.findUnique.mockResolvedValue({ idTienda: 1 })
      prisma.tienda.update.mockResolvedValue({ idTienda: 1, nombreTienda: 'T Editada', direccion: 'D', contacto: 'C', idAdministrador: 1 })
      const res = await request(app).put('/api/tiendas/1').send({ nombreTienda: 'T Editada' })
      expect(res.status).toBe(200)
    })

    it('devuelve 404 si no existe', async () => {
      prisma.tienda.findUnique.mockResolvedValue(null)
      const res = await request(app).put('/api/tiendas/999').send({ nombreTienda: 'Test' })
      expect(res.status).toBe(404)
    })
  })

  describe('PUT /api/usuarios/:id', () => {
    it('actualiza un usuario exitosamente', async () => {
      prisma.usuario.findUnique.mockResolvedValue({ idUsuario: 1, nombre: 'Test', correo: 't@t.com', rol: 'cliente' })
      prisma.usuario.update.mockResolvedValue({ idUsuario: 1, nombre: 'Editado', correo: 't@t.com', rol: 'cliente' })
      const res = await request(app).put('/api/usuarios/1').send({ nombre: 'Editado', correo: 't@t.com' })
      expect(res.status).toBe(200)
    })

    it('devuelve 404 si no existe', async () => {
      prisma.usuario.findUnique.mockResolvedValue(null)
      const res = await request(app).put('/api/usuarios/999').send({ nombre: 'Test', correo: 't@t.com' })
      expect(res.status).toBe(404)
    })
  })

  describe('PUT /api/usuarios/:id/contrasena', () => {
    it('cambia la contraseña exitosamente', async () => {
      const hash = bcrypt.hashSync('actual', 10)
      prisma.usuario.findUnique.mockResolvedValue({ idUsuario: 1, contrasena: hash })
      prisma.usuario.update.mockResolvedValue({ idUsuario: 1, contrasena: 'newhash' })
      const res = await request(app).put('/api/usuarios/1/contrasena').send({ contrasenaActual: 'actual', nuevaContrasena: 'nuevaLarga123' })
      expect(res.status).toBe(200)
    })

    it('rechaza si la contraseña actual es incorrecta', async () => {
      const hash = bcrypt.hashSync('actual', 10)
      prisma.usuario.findUnique.mockResolvedValue({ idUsuario: 1, contrasena: hash })
      const res = await request(app).put('/api/usuarios/1/contrasena').send({ contrasenaActual: 'wrong', nuevaContrasena: 'nuevaLarga123' })
      expect(res.status).toBe(401)
    })
  })
})
