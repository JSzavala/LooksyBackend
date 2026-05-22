jest.mock('../../src/lib/prisma', () => ({
  usuario: {
    findMany: jest.fn(),
    findUnique: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
  },
}))

const request = require('supertest')
const express = require('express')
const bcrypt = require('bcryptjs')
const prisma = require('../../src/lib/prisma')
const userRoutes = require('../../src/routes/user.routes')

const app = express()
app.use(express.json())
app.use(userRoutes)

describe('User - Unit Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('GET /api/usuarios', () => {
    it('debe buscar usuarios por nombre', async () => {
      prisma.usuario.findMany.mockResolvedValue([
        { idUsuario: 1, nombre: 'Juan Pérez', correo: 'juan@test.com', rol: 'cliente' },
      ])

      const res = await request(app).get('/api/usuarios?q=Juan')

      expect(res.status).toBe(200)
      expect(res.body.usuarios).toHaveLength(1)
      expect(res.body.total).toBe(1)
    })

    it('debe rechazar búsqueda sin query', async () => {
      const res = await request(app).get('/api/usuarios')

      expect(res.status).toBe(400)
      expect(res.body.error).toBe('Parámetro requerido')
    })
  })

  describe('GET /api/usuarios/:id', () => {
    it('debe obtener un usuario por id', async () => {
      prisma.usuario.findUnique.mockResolvedValue({ idUsuario: 1, nombre: 'Test', correo: 'test@test.com', rol: 'cliente' })

      const res = await request(app).get('/api/usuarios/1')

      expect(res.status).toBe(200)
      expect(res.body.usuario.idUsuario).toBe(1)
    })

    it('debe devolver 404 si no existe', async () => {
      prisma.usuario.findUnique.mockResolvedValue(null)

      const res = await request(app).get('/api/usuarios/999')

      expect(res.status).toBe(404)
    })
  })

  describe('POST /api/usuarios', () => {
    it('debe crear un usuario', async () => {
      prisma.usuario.findUnique.mockResolvedValue(null)
      prisma.usuario.create.mockResolvedValue({ idUsuario: 1, nombre: 'Test', correo: 'test@test.com', rol: 'cliente' })

      const res = await request(app).post('/api/usuarios').send({ nombre: 'Test', correo: 'test@test.com', contrasena: '123456' })

      expect(res.status).toBe(201)
      expect(res.body.usuario).toBeDefined()
    })

    it('debe rechazar creación sin campos', async () => {
      const res = await request(app).post('/api/usuarios').send({})

      expect(res.status).toBe(400)
    })

    it('debe rechazar si el correo ya existe', async () => {
      prisma.usuario.findUnique.mockResolvedValue({ idUsuario: 99 })

      const res = await request(app).post('/api/usuarios').send({ nombre: 'Test', correo: 'existente@test.com', contrasena: '123' })

      expect(res.status).toBe(409)
    })

    it('debe manejar errores internos al crear usuario', async () => {
      prisma.usuario.findUnique.mockRejectedValue(new Error('DB error'))

      const res = await request(app).post('/api/usuarios').send({ nombre: 'Test', correo: 't@t.com', contrasena: '123456' })

      expect(res.status).toBe(500)
    })
  })

  describe('GET /api/usuarios', () => {
    it('debe manejar errores internos en busqueda', async () => {
      prisma.usuario.findMany.mockRejectedValue(new Error('DB error'))

      const res = await request(app).get('/api/usuarios?q=test')

      expect(res.status).toBe(500)
    })
  })

  describe('GET /api/usuarios/:id', () => {
    it('debe manejar errores internos al obtener usuario', async () => {
      prisma.usuario.findUnique.mockRejectedValue(new Error('DB error'))

      const res = await request(app).get('/api/usuarios/1')

      expect(res.status).toBe(500)
    })
  })

  describe('PUT /api/usuarios/:id', () => {
    it('debe actualizar un usuario', async () => {
      prisma.usuario.findUnique.mockResolvedValueOnce({ idUsuario: 1, nombre: 'Test', correo: 'test@test.com', rol: 'cliente' })
      prisma.usuario.update.mockResolvedValue({ idUsuario: 1, nombre: 'Test Editado', correo: 'test@test.com', rol: 'cliente' })

      const res = await request(app).put('/api/usuarios/1').send({ nombre: 'Test Editado', correo: 'test@test.com' })

      expect(res.status).toBe(200)
      expect(res.body.usuario.nombre).toBe('Test Editado')
    })

    it('debe rechazar actualización sin campos', async () => {
      const res = await request(app).put('/api/usuarios/1').send({})

      expect(res.status).toBe(400)
    })

    it('debe devolver 404 si el usuario no existe', async () => {
      prisma.usuario.findUnique.mockResolvedValue(null)

      const res = await request(app).put('/api/usuarios/999').send({ nombre: 'Nuevo', correo: 'nuevo@test.com' })

      expect(res.status).toBe(404)
    })

    it('debe rechazar si el nuevo correo ya existe', async () => {
      prisma.usuario.findUnique
        .mockResolvedValueOnce({ idUsuario: 1, nombre: 'Test', correo: 'original@test.com' })
        .mockResolvedValueOnce({ idUsuario: 2, nombre: 'Otro', correo: 'ocupado@test.com' })

      const res = await request(app).put('/api/usuarios/1').send({ nombre: 'Test', correo: 'ocupado@test.com' })

      expect(res.status).toBe(409)
    })

    it('debe actualizar cuando se cambia el correo sin conflicto', async () => {
      prisma.usuario.findUnique
        .mockResolvedValueOnce({ idUsuario: 1, nombre: 'Test', correo: 'original@test.com' })
        .mockResolvedValueOnce(null)
      prisma.usuario.update.mockResolvedValue({ idUsuario: 1, nombre: 'Test', correo: 'nuevo@test.com', rol: 'cliente' })

      const res = await request(app).put('/api/usuarios/1').send({ nombre: 'Test', correo: 'nuevo@test.com' })

      expect(res.status).toBe(200)
    })

    it('debe manejar errores internos al actualizar', async () => {
      prisma.usuario.findUnique.mockRejectedValue(new Error('DB error'))

      const res = await request(app).put('/api/usuarios/1').send({ nombre: 'Test', correo: 'test@test.com' })

      expect(res.status).toBe(500)
    })
  })

  describe('PUT /api/usuarios/:id/contrasena', () => {
    const hash = bcrypt.hashSync('actualPass', 10)

    it('debe cambiar la contraseña', async () => {
      prisma.usuario.findUnique.mockResolvedValue({ idUsuario: 1, contrasena: hash })

      const res = await request(app)
        .put('/api/usuarios/1/contrasena')
        .send({ contrasenaActual: 'actualPass', nuevaContrasena: 'nuevaPassLarga' })

      expect(res.status).toBe(200)
      expect(res.body.mensaje).toBe('Contraseña actualizada exitosamente')
    })

    it('debe rechazar sin campos obligatorios', async () => {
      const res = await request(app).put('/api/usuarios/1/contrasena').send({})

      expect(res.status).toBe(400)
    })

    it('debe rechazar si nueva contraseña es muy corta', async () => {
      const res = await request(app)
        .put('/api/usuarios/1/contrasena')
        .send({ contrasenaActual: 'pass', nuevaContrasena: 'corta' })

      expect(res.status).toBe(400)
    })

    it('debe devolver 404 si el usuario no existe', async () => {
      prisma.usuario.findUnique.mockResolvedValue(null)

      const res = await request(app)
        .put('/api/usuarios/999/contrasena')
        .send({ contrasenaActual: 'pass', nuevaContrasena: 'nuevaLarga123' })

      expect(res.status).toBe(404)
    })

    it('debe rechazar si la contraseña actual no coincide', async () => {
      prisma.usuario.findUnique.mockResolvedValue({ idUsuario: 1, contrasena: hash })

      const res = await request(app)
        .put('/api/usuarios/1/contrasena')
        .send({ contrasenaActual: 'wrongPass', nuevaContrasena: 'nuevaLarga123' })

      expect(res.status).toBe(401)
    })

    it('debe manejar errores internos', async () => {
      prisma.usuario.findUnique.mockRejectedValue(new Error('DB error'))

      const res = await request(app)
        .put('/api/usuarios/1/contrasena')
        .send({ contrasenaActual: 'pass', nuevaContrasena: 'nuevaLarga123' })

      expect(res.status).toBe(500)
    })
  })
})
