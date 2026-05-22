jest.mock('../../src/lib/prisma', () => ({
  producto: {
    findMany: jest.fn(),
    findUnique: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
  tienda: {
    findUnique: jest.fn(),
  },
}))

const request = require('supertest')
const express = require('express')
const prisma = require('../../src/lib/prisma')
const productRoutes = require('../../src/routes/product.routes')

const app = express()
app.use(express.json())
app.use(productRoutes)

describe('Product - Unit Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('GET /api/productos', () => {
    it('debe listar productos disponibles', async () => {
      const mockProductos = [
        { idProducto: 1, nombre: 'Camisa', descripcion: 'Azul', precio: 299, stock: 10, disponible: true, idTienda: 1, tienda: { nombreTienda: 'Tienda A' }, etiquetas: [] },
        { idProducto: 2, nombre: 'Pantalón', descripcion: 'Negro', precio: 499, stock: 5, disponible: true, idTienda: 1, tienda: { nombreTienda: 'Tienda A' }, etiquetas: [] },
      ]
      prisma.producto.findMany.mockResolvedValue(mockProductos)

      const res = await request(app).get('/api/productos')

      expect(res.status).toBe(200)
      expect(res.body.productos).toHaveLength(2)
      expect(res.body.total).toBe(2)
    })

    it('debe devolver lista vacía si no hay productos', async () => {
      prisma.producto.findMany.mockResolvedValue([])

      const res = await request(app).get('/api/productos')

      expect(res.status).toBe(200)
      expect(res.body.productos).toEqual([])
      expect(res.body.total).toBe(0)
    })

    it('debe manejar errores internos', async () => {
      prisma.producto.findMany.mockRejectedValue(new Error('DB error'))

      const res = await request(app).get('/api/productos')

      expect(res.status).toBe(500)
    })
  })

  describe('POST /api/productos', () => {
    const productoValido = { nombre: 'Camisa', precio: 299, idTienda: 1 }

    it('debe crear un producto', async () => {
      prisma.tienda.findUnique.mockResolvedValue({ idTienda: 1, nombreTienda: 'Tienda A' })
      prisma.producto.create.mockResolvedValue({
        idProducto: 1, nombre: 'Camisa', descripcion: null, precio: 299, stock: 0, disponible: true, idTienda: 1, etiquetas: [],
      })

      const res = await request(app).post('/api/productos').send(productoValido)

      expect(res.status).toBe(201)
      expect(res.body.producto).toBeDefined()
      expect(res.body.producto.nombre).toBe('Camisa')
    })

    it('debe rechazar producto sin campos obligatorios', async () => {
      const res = await request(app).post('/api/productos').send({ nombre: 'Solo nombre' })

      expect(res.status).toBe(400)
      expect(res.body.error).toBe('Parámetros requeridos')
    })

    it('debe rechazar producto con tienda inexistente', async () => {
      prisma.tienda.findUnique.mockResolvedValue(null)

      const res = await request(app).post('/api/productos').send(productoValido)

      expect(res.status).toBe(404)
      expect(res.body.error).toBe('Tienda no encontrada')
    })

    it('debe crear producto con etiquetas', async () => {
      prisma.tienda.findUnique.mockResolvedValue({ idTienda: 1, nombreTienda: 'T' })
      prisma.producto.create.mockResolvedValue({
        idProducto: 1, nombre: 'Camisa', descripcion: null, precio: 299, stock: 0, disponible: true, idTienda: 1,
        etiquetas: [{ etiqueta: { idEtiqueta: 1, nombre: 'Moda' } }],
      })

      const res = await request(app)
        .post('/api/productos')
        .send({ nombre: 'Camisa', precio: 299, idTienda: 1, etiquetas: [1] })

      expect(res.status).toBe(201)
      expect(res.body.producto.etiquetas).toHaveLength(1)
    })

    it('debe manejar errores internos en POST', async () => {
      prisma.tienda.findUnique.mockResolvedValue({ idTienda: 1 })
      prisma.producto.create.mockRejectedValue(new Error('DB error'))

      const res = await request(app).post('/api/productos').send({ nombre: 'Camisa', precio: 299, idTienda: 1 })

      expect(res.status).toBe(500)
    })

    it('debe crear producto con disponible explícito', async () => {
      prisma.tienda.findUnique.mockResolvedValue({ idTienda: 1, nombreTienda: 'T' })
      prisma.producto.create.mockResolvedValue({
        idProducto: 1, nombre: 'Camisa', descripcion: null, precio: 299, stock: 0, disponible: false, idTienda: 1, etiquetas: [],
      })

      const res = await request(app)
        .post('/api/productos')
        .send({ nombre: 'Camisa', precio: 299, idTienda: 1, disponible: false })

      expect(res.status).toBe(201)
    })
  })

  describe('PUT /api/productos/:idProducto', () => {
    it('debe actualizar un producto existente', async () => {
      prisma.producto.findUnique.mockResolvedValue({ idProducto: 1, nombre: 'Camisa', idTienda: 1 })
      prisma.producto.update.mockResolvedValue({
        idProducto: 1, nombre: 'Camisa Editada', descripcion: null, precio: 399, stock: 5, disponible: true, idTienda: 1, etiquetas: [],
      })

      const res = await request(app)
        .put('/api/productos/1')
        .send({ nombre: 'Camisa Editada', precio: 399, stock: 5 })

      expect(res.status).toBe(200)
      expect(res.body.producto.nombre).toBe('Camisa Editada')
    })

    it('debe devolver 404 si el producto no existe', async () => {
      prisma.producto.findUnique.mockResolvedValue(null)

      const res = await request(app)
        .put('/api/productos/999')
        .send({ nombre: 'Nuevo', precio: 100 })

      expect(res.status).toBe(404)
      expect(res.body.error).toBe('Producto no encontrado')
    })

    it('debe devolver 404 si la tienda asignada no existe', async () => {
      prisma.producto.findUnique.mockResolvedValue({ idProducto: 1, nombre: 'Camisa', idTienda: 1 })
      prisma.tienda.findUnique.mockResolvedValue(null)

      const res = await request(app)
        .put('/api/productos/1')
        .send({ nombre: 'Camisa', precio: 100, idTienda: 999 })

      expect(res.status).toBe(404)
      expect(res.body.error).toBe('Tienda no encontrada')
    })

    it('debe manejar errores internos', async () => {
      prisma.producto.findUnique.mockRejectedValue(new Error('DB error'))

      const res = await request(app)
        .put('/api/productos/1')
        .send({ nombre: 'Test' })

      expect(res.status).toBe(500)
    })

    it('debe actualizar producto con etiquetas', async () => {
      prisma.producto.findUnique.mockResolvedValue({ idProducto: 1, nombre: 'Camisa', idTienda: 1 })
      prisma.producto.update.mockResolvedValue({
        idProducto: 1, nombre: 'Camisa', descripcion: null, precio: 100, stock: 5, disponible: true, idTienda: 1,
        etiquetas: [{ etiqueta: { idEtiqueta: 1, nombre: 'Moda' } }],
      })

      const res = await request(app)
        .put('/api/productos/1')
        .send({ nombre: 'Camisa', precio: 100, etiquetas: [1] })

      expect(res.status).toBe(200)
      expect(res.body.producto.etiquetas).toHaveLength(1)
    })

    it('debe actualizar con descripcion, disponible e idTienda', async () => {
      prisma.producto.findUnique.mockResolvedValue({ idProducto: 1, nombre: 'Camisa', idTienda: 1 })
      prisma.tienda.findUnique.mockResolvedValue({ idTienda: 2 })
      prisma.producto.update.mockResolvedValue({
        idProducto: 1, nombre: 'Camisa', descripcion: 'Nueva desc', precio: 100, stock: 5, disponible: false, idTienda: 2, etiquetas: [],
      })

      const res = await request(app)
        .put('/api/productos/1')
        .send({ nombre: 'Camisa', descripcion: 'Nueva desc', precio: 100, stock: 5, disponible: false, idTienda: 2 })

      expect(res.status).toBe(200)
    })
  })

  describe('DELETE /api/productos/:idProducto', () => {
    it('debe eliminar un producto existente', async () => {
      prisma.producto.findUnique.mockResolvedValue({ idProducto: 1, nombre: 'Camisa' })
      prisma.producto.delete.mockResolvedValue({ idProducto: 1 })

      const res = await request(app).delete('/api/productos/1')

      expect(res.status).toBe(200)
      expect(res.body.mensaje).toBe('Producto eliminado correctamente')
    })

    it('debe devolver 404 si el producto no existe', async () => {
      prisma.producto.findUnique.mockResolvedValue(null)

      const res = await request(app).delete('/api/productos/999')

      expect(res.status).toBe(404)
      expect(res.body.error).toBe('Producto no encontrado')
    })

    it('debe manejar errores internos', async () => {
      prisma.producto.findUnique.mockRejectedValue(new Error('DB error'))

      const res = await request(app).delete('/api/productos/1')

      expect(res.status).toBe(500)
    })
  })

  describe('GET /api/tiendas/:idTienda/productos', () => {
    it('debe listar productos de una tienda', async () => {
      prisma.tienda.findUnique.mockResolvedValue({ idTienda: 1, nombreTienda: 'Tienda A' })
      prisma.producto.findMany.mockResolvedValue([
        { idProducto: 1, nombre: 'Camisa', descripcion: 'Azul', precio: 299, stock: 10, disponible: true },
      ])

      const res = await request(app).get('/api/tiendas/1/productos')

      expect(res.status).toBe(200)
      expect(res.body.productos).toHaveLength(1)
      expect(res.body.tienda.nombreTienda).toBe('Tienda A')
    })

    it('debe devolver 404 si la tienda no existe', async () => {
      prisma.tienda.findUnique.mockResolvedValue(null)

      const res = await request(app).get('/api/tiendas/999/productos')

      expect(res.status).toBe(404)
      expect(res.body.error).toBe('Tienda no encontrada')
    })

    it('debe manejar errores internos en listado por tienda', async () => {
      prisma.tienda.findUnique.mockRejectedValue(new Error('DB error'))

      const res = await request(app).get('/api/tiendas/1/productos')

      expect(res.status).toBe(500)
    })
  })
})
