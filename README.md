looksy-backend/
│
├── src/
│   ├── index.js                          # Punto de entrada de la aplicacion
│   ├── app.js                             # Configuracion de Express
│   │
│   ├── configuracion/                      # Configuraciones generales
│   │   ├── base-datos.js                    # Configuracion de Prisma
│   │   ├── autenticacion.js                  # Configuracion de JWT
│   │   ├── almacenamiento.js                 # Configuracion para imagenes (S3/Cloudinary)
│   │   └── entorno.js                        # Variables de entorno
│   │
│   ├── prisma/                              # Esquema y migraciones de Prisma
│   │   ├── schema.prisma                     # Modelos de base de datos
│   │   ├── migrations/                        # Historial de migraciones
│   │   └── semilla.js                         # Datos de prueba iniciales
│   │
│   ├── dominio/                             # Capa de dominio (reglas de negocio)
│   │   ├── entidades/                         # Entidades del negocio
│   │   │   ├── usuario.entidad.js
│   │   │   ├── producto.entidad.js
│   │   │   ├── atuendo.entidad.js
│   │   │   ├── tienda.entidad.js
│   │   │   ├── pedido.entidad.js
│   │   │   └── etiqueta.entidad.js
│   │   │
│   │   ├── objetos-valor/                     # Objetos de valor
│   │   │   ├── correo.ov.js
│   │   │   ├── telefono.ov.js
│   │   │   ├── direccion.ov.js
│   │   │   ├── precio.ov.js
│   │   │   └── inventario.ov.js
│   │   │
│   │   └── reglas/                            # Reglas de dominio especificas
│   │       ├── usuario-reglas.js
│   │       ├── producto-reglas.js
│   │       ├── compra-reglas.js
│   │       └── atuendo-reglas.js
│   │
│   ├── aplicacion/                           # Capa de aplicacion (casos de uso)
│   │   ├── servicios/                          # Servicios de aplicacion
│   │   │   ├── autenticacion.servicio.js
│   │   │   ├── usuario.servicio.js
│   │   │   ├── producto.servicio.js
│   │   │   ├── atuendo.servicio.js
│   │   │   ├── tienda.servicio.js
│   │   │   ├── pedido.servicio.js
│   │   │   ├── etiqueta.servicio.js
│   │   │   ├── filtro.servicio.js              # Logica de filtrado
│   │   │   ├── recomendacion.servicio.js        # Recomendaciones personalizadas
│   │   │   ├── interaccion.servicio.js          # Likes/comentarios
│   │   │   ├── notificacion.servicio.js         # Notificaciones push
│   │   │   └── ubicacion.servicio.js            # Geolocalizacion
│   │   │
│   │   └── casos-uso/                          # Casos de uso especificos
│   │       ├── autenticacion/
│   │       │   ├── registrar-usuario.caso.js
│   │       │   ├── registrar-proveedor.caso.js
│   │       │   ├── iniciar-sesion.caso.js
│   │       │   └── cerrar-sesion.caso.js
│   │       │
│   │       ├── usuario/
│   │       │   ├── obtener-feed.caso.js
│   │       │   ├── filtrar-productos.caso.js
│   │       │   ├── registrar-intereses.caso.js
│   │       │   ├── publicar-atuendo.caso.js
│   │       │   ├── interactuar-publicacion.caso.js
│   │       │   ├── ver-ubicacion-tienda.caso.js
│   │       │   └── solicitar-compra.caso.js
│   │       │
│   │       └── proveedor/
│   │           ├── registrar-info-producto.caso.js
│   │           ├── actualizar-inventario.caso.js
│   │           ├── registrar-contacto.caso.js
│   │           ├── registrar-direccion.caso.js
│   │           ├── agregar-etiquetas.caso.js
│   │           └── publicar-producto.caso.js
│   │
│   ├── infraestructura/                       # Capa de infraestructura
│   │   ├── base-datos/                         # Acceso a datos
│   │   │   ├── prisma.cliente.js                # Cliente Prisma singleton
│   │   │   └── repositorios/                    # Implementaciones de repositorios
│   │   │       ├── usuario.repositorio.js
│   │   │       ├── producto.repositorio.js
│   │   │       ├── atuendo.repositorio.js
│   │   │       ├── tienda.repositorio.js
│   │   │       ├── pedido.repositorio.js
│   │   │       ├── etiqueta.repositorio.js
│   │   │       ├── comentario.repositorio.js
│   │   │       └── like.repositorio.js
│   │   │
│   │   ├── cache/                              # Cache con Redis
│   │   │   ├── redis.cliente.js
│   │   │   ├── feed.cache.js
│   │   │   ├── producto.cache.js
│   │   │   └── sesion.cache.js
│   │   │
│   │   ├── almacenamiento/                     # Almacenamiento de archivos
│   │   │   ├── s3.cliente.js
│   │   │   ├── imagen.servicio.js
│   │   │   └── subir.middleware.js
│   │   │
│   │   └── externos/                            # Servicios externos
│   │       ├── firebase.cliente.js
│   │       ├── mapas.cliente.js
│   │       └── correo.cliente.js
│   │
│   ├── interfaces/                            # Capa de interfaces (adaptadores)
│   │   ├── rutas/                              # Definicion de rutas
│   │   │   ├── index.js                         # Agrupador de rutas
│   │   │   ├── autenticacion.rutas.js
│   │   │   ├── usuario.rutas.js
│   │   │   ├── producto.rutas.js
│   │   │   ├── atuendo.rutas.js
│   │   │   ├── tienda.rutas.js
│   │   │   ├── pedido.rutas.js
│   │   │   └── etiqueta.rutas.js
│   │   │
│   │   ├── controladores/                      # Controladores
│   │   │   ├── autenticacion.controlador.js
│   │   │   ├── usuario.controlador.js
│   │   │   ├── producto.controlador.js
│   │   │   ├── atuendo.controlador.js
│   │   │   ├── tienda.controlador.js
│   │   │   ├── pedido.controlador.js
│   │   │   └── etiqueta.controlador.js
│   │   │
│   │   ├── middlewares/                        # Middlewares
│   │   │   ├── autenticacion.middleware.js
│   │   │   ├── validacion.middleware.js
│   │   │   ├── error.middleware.js
│   │   │   ├── limite-peticiones.middleware.js
│   │   │   └── subida.middleware.js
│   │   │
│   │   ├── validadores/                         # Validaciones de entrada
│   │   │   ├── autenticacion.validador.js
│   │   │   ├── usuario.validador.js
│   │   │   ├── producto.validador.js
│   │   │   ├── atuendo.validador.js
│   │   │   └── tienda.validador.js
│   │   │
│   │   ├── dto/                                 # Data Transfer Objects
│   │   │   ├── usuario.dto.js
│   │   │   ├── producto.dto.js
│   │   │   ├── atuendo.dto.js
│   │   │   ├── tienda.dto.js
│   │   │   └── pedido.dto.js
│   │   │
│   │   └── websocket/                           # WebSockets para tiempo real
│   │       ├── socket.servidor.js
│   │       ├── notificacion.manejador.js
│   │       └── chat.manejador.js
│   │
│   ├── compartido/                             # Codigo compartido
│   │   ├── constantes/                          # Constantes globales
│   │   │   ├── roles.js
│   │   │   ├── categorias.js
│   │   │   ├── estado-pedido.js
│   │   │   └── codigos-error.js
│   │   │
│   │   ├── utilidades/                          # Utilidades
│   │   │   ├── registrador.js
│   │   │   ├── ayudantes.js
│   │   │   ├── jwt.utilidades.js
│   │   │   ├── hash.utilidades.js
│   │   │   └── fecha.utilidades.js
│   │   │
│   │   └── enumeraciones/                        # Enumeraciones
│   │       ├── tipo-usuario.enum.js
│   │       ├── categoria-producto.enum.js
│   │       └── tipo-interaccion.enum.js
│   │
│   └── tipos/                                   # Definiciones de tipos (si se usa JS con JSDoc)
│       ├── usuario.tipo.js
│       ├── producto.tipo.js
│       └── atuendo.tipo.js
│
├── pruebas/                                     # Pruebas
│   ├── unitarias/
│   │   ├── dominio/
│   │   ├── aplicacion/
│   │   └── infraestructura/
│   │
│   ├── integracion/
│   │   ├── rutas/
│   │   └── repositorios/
│   │
│   └── e2e/
│       └── flujos/
│
├── logs/                                        # Archivos de log
│   ├── error.log
│   └── combinado.log
│
├── subidas/                                     # Archivos subidos temporalmente
│   └── temp/
│
├── prisma/                                      # Configuracion Prisma (nivel raiz)
│   └── schema.prisma
│
├── .env                                          # Variables de entorno
├── .env.ejemplo                                  # Ejemplo de variables de entorno
├── .gitignore                                    # Archivos ignorados por git
├── .eslintrc.js                                  # Configuracion de linting
├── .prettierrc                                   # Configuracion de formato
├── package.json                                  # Dependencias
├── package-lock.json                             # Lock de dependencias
└── README.md                                      # Documentacion del proyecto