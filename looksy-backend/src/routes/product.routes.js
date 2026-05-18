const express = require('express')
const router = express.Router()
const prisma = require('../lib/prisma')

router.get('/api/productos', async (req, res) => {
  try {
    const productos = await prisma.producto.findMany({
      where: { disponible: true },
      select: {
        idProducto: true,
        nombre: true,
        descripcion: true,
        precio: true,
        stock: true,
        disponible: true,
        idTienda: true,
        tienda: {
          select: { nombreTienda: true },
        },
        etiquetas: {
          select: {
            etiqueta: {
              select: { idEtiqueta: true, nombre: true },
            },
          },
        },
      },
      orderBy: { nombre: 'asc' },
    })

    res.json({ productos, total: productos.length })
  } catch (error) {
    console.error('Error al obtener productos:', error)
    res.status(500).json({
      error: 'Error interno del servidor',
      mensaje: 'No se pudieron obtener los productos',
    })
  }
})

router.post('/api/productos', async (req, res) => {
  try {
    const { nombre, descripcion, precio, stock, disponible, idTienda, etiquetas } = req.body

    if (!nombre || !precio || !idTienda) {
      return res.status(400).json({
        error: 'Parámetros requeridos',
        mensaje: 'Los campos nombre, precio e idTienda son obligatorios',
      })
    }

    const tienda = await prisma.tienda.findUnique({
      where: { idTienda: Number(idTienda) },
    })
    if (!tienda) {
      return res.status(404).json({
        error: 'Tienda no encontrada',
        mensaje: `No existe una tienda con el id ${idTienda}`,
      })
    }

    const producto = await prisma.producto.create({
      data: {
        nombre,
        descripcion,
        precio,
        stock: stock || 0,
        disponible: disponible !== undefined ? disponible : true,
        idTienda: Number(idTienda),
        etiquetas: etiquetas && etiquetas.length
          ? {
              create: etiquetas.map(idEtiqueta => ({
                idEtiqueta: Number(idEtiqueta),
              })),
            }
          : undefined,
      },
      select: {
        idProducto: true,
        nombre: true,
        descripcion: true,
        precio: true,
        stock: true,
        disponible: true,
        idTienda: true,
        etiquetas: {
          select: {
            etiqueta: { select: { idEtiqueta: true, nombre: true } },
          },
        },
      },
    })

    res.status(201).json({ producto })
  } catch (error) {
    console.error('Error al crear producto:', error)
    res.status(500).json({
      error: 'Error interno del servidor',
      mensaje: 'No se pudo crear el producto',
    })
  }
})

router.get('/api/tiendas/:idTienda/productos', async (req, res) => {
  try {
    const { idTienda } = req.params

    const tienda = await prisma.tienda.findUnique({
      where: { idTienda: Number(idTienda) },
    })

    if (!tienda) {
      return res.status(404).json({
        error: 'Tienda no encontrada',
        mensaje: `No existe una tienda con el id ${idTienda}`,
      })
    }

    const productos = await prisma.producto.findMany({
      where: {
        idTienda: Number(idTienda),
        disponible: true,
      },
      select: {
        idProducto: true,
        nombre: true,
        descripcion: true,
        precio: true,
        stock: true,
        disponible: true,
      },
      orderBy: { nombre: 'asc' },
    })

    res.json({
      tienda: {
        idTienda: tienda.idTienda,
        nombreTienda: tienda.nombreTienda,
      },
      productos,
      total: productos.length,
    })
  } catch (error) {
    console.error('Error al obtener productos de la tienda:', error)
    res.status(500).json({
      error: 'Error interno del servidor',
      mensaje: 'No se pudieron obtener los productos de la tienda',
    })
  }
})

router.put('/api/productos/:idProducto', async (req, res) => {
  try {
    const { idProducto } = req.params
    const { nombre, descripcion, precio, stock, disponible, idTienda, etiquetas } = req.body

    const producto = await prisma.producto.findUnique({
      where: { idProducto: Number(idProducto) },
    })

    if (!producto) {
      return res.status(404).json({
        error: 'Producto no encontrado',
        mensaje: `No existe un producto con el id ${idProducto}`,
      })
    }

    if (idTienda) {
      const tienda = await prisma.tienda.findUnique({
        where: { idTienda: Number(idTienda) },
      })
      if (!tienda) {
        return res.status(404).json({
          error: 'Tienda no encontrada',
          mensaje: `No existe una tienda con el id ${idTienda}`,
        })
      }
    }

    const productoActualizado = await prisma.producto.update({
      where: { idProducto: Number(idProducto) },
      data: {
        ...(nombre !== undefined && { nombre }),
        ...(descripcion !== undefined && { descripcion }),
        ...(precio !== undefined && { precio }),
        ...(stock !== undefined && { stock }),
        ...(disponible !== undefined && { disponible }),
        ...(idTienda !== undefined && { idTienda: Number(idTienda) }),
        ...(etiquetas !== undefined && {
          etiquetas: {
            deleteMany: {},
            create: etiquetas.map(id => ({ idEtiqueta: Number(id) })),
          },
        }),
      },
      select: {
        idProducto: true,
        nombre: true,
        descripcion: true,
        precio: true,
        stock: true,
        disponible: true,
        idTienda: true,
        etiquetas: {
          select: {
            etiqueta: { select: { idEtiqueta: true, nombre: true } },
          },
        },
      },
    })

    res.json({ producto: productoActualizado })
  } catch (error) {
    console.error('Error al actualizar producto:', error)
    res.status(500).json({
      error: 'Error interno del servidor',
      mensaje: 'No se pudo actualizar el producto',
    })
  }
})

router.delete('/api/productos/:idProducto', async (req, res) => {
  try {
    const { idProducto } = req.params

    const producto = await prisma.producto.findUnique({
      where: { idProducto: Number(idProducto) },
    })

    if (!producto) {
      return res.status(404).json({
        error: 'Producto no encontrado',
        mensaje: `No existe un producto con el id ${idProducto}`,
      })
    }

    await prisma.producto.delete({
      where: { idProducto: Number(idProducto) },
    })

    res.json({
      mensaje: 'Producto eliminado correctamente',
      idProducto: Number(idProducto),
    })
  } catch (error) {
    console.error('Error al eliminar producto:', error)
    res.status(500).json({
      error: 'Error interno del servidor',
      mensaje: 'No se pudo eliminar el producto',
    })
  }
})

module.exports = router
