# LOOKSY_EspecificacionComplementaria

INSTITUTO TECNOLÓGICO SUPERIOR DEL SUR DE GUANAJUATO

Especificación complementaria

Proyecto: Looksy

Alumnos:

Dafne Guadalupe Orozco Aguirre

Montserrat Tenorio Villagomez

Guadalupe Yolet Villagomez Nuñez

Jesus Samuel Zavala Ayala

Materia: Ingeniería de software

Profesor: Fernando Jose Martínez López

Semestre: 6to

Especialidad: Sistemas computacionales

Uriangato, Gto.                                                                         Fecha: 03/02/2026

Índice

# Historia de revisiones

| Versión | Fecha | Descripción |
|---|---|---|
| Borrador de inicio | 11 Noviembre, 2025 | Primer borrador sobre las especificaciones complementarias. |
| 1.0 | 3 febrero 2026 | Ajuste de necesidades en el desarrollo del proyecto. |
| 1.1 | 6 marzo 2026 | Ajuste de documentación con objetivos más claros. |

# Introducción

En el presente documento se encuentran las especificaciones complementarias del proyecto Looksy, tras identificar y completar la historia y caso de uso principal del proyecto.

# Funcionalidad

Gestión de errores

Los errores críticos deberán generar alertas inmediatamente para el equipo técnico.

Se registraron los errores del sistema en un almacenamiento, para ser tratados.

Seguridad

Todo trámite de compra y venta en la plataforma requiere la autenticación del usuario.

Los datos personales relacionados a los pagos e información personal del cliente deberán ser tratados mediante una conexión segura.

Las credenciales se almacenarán mediante cifrado seguro.

# Facilidad de uso

Factores humanos

El usuario será capaz de interactuar con el programa de forma intuitiva, de tal manera que sea una experiencia satisfactoria pues existirán indicadores populares  dentro de la plataforma para dar una noción de entrada de a dónde lleva cada cosa como iconos de ropa, el carrito de compras, etc.

Además el texto será de una letra legible y breve, sin llegar a saturar las pantallas con demasiado ruido visual. Se evitarán colores molestos para el usuario.

# Fiabilidad

Capacidad de recuperación

En el caso de que ocurra un error al momento de realizar el pago de una compra, como interrupciones o problemas de conexión, las transacción NO se llevará a cabo, ya que se cuidará la integridad, para que únicamente se complete si y sólo sí se confirma la transferencia, al igual que la compra de dichos productos.

Transparencia

Si existen quejas sobre algún producto o tienda se podrá dar un reporte acerca de la situación en busca de una resolución al problema. Y se tratará dicho problema  para ofrecer una experiencia gratificante al usuario.

# Rendimiento

Se requiere un sistema rápido y ligero, tanto para el cliente como para los vendedores, quienes puedan navegar con facilidad entre las diferentes opciones dentro de la plataforma. Nuestro mayor objetivo es que los usuarios accedan a todos los apartados del sistema en menos de 2 segundos.

El sistema debe soportar un mínimo de 500 usuarios concurrentes sin presentar problemas de rendimiento y sin presentar problemas de carga.

# Soporte

Enfoque en la personalización

La plataforma está diseñada para atender diferentes perfiles como compradores, vendedores y miembros de diferentes grupos para visualizar productos, por lo tanto es necesario que el sistema se pueda procesar de una manera flexible y abarque todos los perfiles. Personalizando hacia las diferentes necesidades del usuario quien la usara día con día.

Adaptabilidad y escalabilidad

Algunos clientes necesitarán que sus intereses se actualicen en la plataforma es por ello que el cliente puede actualizar su información cuando lo requiera, por otra parte las tiendas podrán subir más mercancía y actualizar la información relevante como el stock en sus artículos, además el vendedor podrá configurar su tienda virtual adaptándola a las necesidades que le vayan surgiendo durante su lapso en el sistema.

# Restricciones de implementación

La aplicación solo podrá ser utilizada con conexión a internet, esto debido a que se necesitan llevar a cabo las transacciones relacionadas a los pagos, cargar datos importantes, como la cantidad disponible de los artículos y los datos relevantes para las ventas. Así mismo es necesaria la conexión a internet para que el vendedor pueda recibir las notificaciones relacionadas a las peticiones de ventas realizadas por los clientes. Se usarán los servicios de AWS para aprovechar las bases de datos, almacenamiento y poder gestionar todo más fácilmente con una mayor escalabilidad y una reducción de costos favorable.

# Componentes adquiridos

Por el momento no se ha adquirido ningún componente para el funcionamiento de la plataforma.

# Componentes de libre distribución

Se ha planteado varias ideas respecto a las componentes que se pueden utilizar para el desarrollo del sistema, algunos de los posibles candidatos son:

Frontend Móvil: Kotlin + Jetpack Compose Multiplatform

Backend: Node.js + Express.js

ORM: Prisma

Base de datos: MySQL

# Interfaces software

Interfaces y hardware destacables

Dispositivo móvil con acceso a internet para acceder a la plataforma.

Cámara, en caso de desear subir contenido respecto a las prendas de ropa o accesorios.

Cámaras integradas en dispositivos móviles para capturar imágenes de productos o comprobantes de entrega.

Posible soporte futuro para captura de firma digital en pantalla táctil para confirmación de entregas.

Interfaces de software

El sistema deberá comunicarse con varios servicios externos, para calcular impuestos, facturaciones, pagos electrónicos, y estar actualizado de datos importantes como los inventarios, recomendaciones, y el almacenamiento en la nube, para guardar imágenes y productos en una base de datos.

# Reglas de dominio

| ID | Regla | Grado de variación | Fuente |
|---|---|---|---|
| Regla 1 | Se requiere la autorización del soporte para el acceso a la venta de productos. | Funciona como una membresía, se tendrá que volver a validar dependiendo de cada cierto tiempo y si se quiere seguir formando parte de la plataforma. | Política del sistema. |
| Regla 2 | Para empezar a compartir ideas, comprar o interactuar se necesitará antes registrarse. | Bajo | Política del sistema. |
| Regla 3 | El contenido que se comparta como el que se venda no puede ser ofensivo ni ilegal dentro de la plataforma | Bajo | Política del sistema. |
| Regla 4 | Los pagos dentro de la tienda deberán efectuarse dentro de las primeras 24 horas de lo contrario la compra será cancelada. | Alto. Se deben cumplir los pagos, para que los vendedores completen la venta e inicien el proceso de envío. | Política de los vendedores y del sistema. |
| Regla 5 | Los pagos realizados por el cliente serán retenidos hasta que la tienda y el cliente reporten la entrega exitosa de los productos. | Alto. Se debe cumplir con esta norma para asegurar la integridad de ambos usuarios. | Política del sistema. |
| Regla 6 | Los cambios en productos y solicitudes de devoluciones deberán ser tratadas con los vendedores antes de completar la compra. | Medio | Política de los vendedores y del sistema |
| Regla 7 | Los usuarios solo podrán publicar sus inspiraciones de outfits con las prendas o accesorios comprados en la aplicación y haciendo referencia a la tienda de la cual se adquiere, de lo contrario no podrá subir ninguna inspiración. | Medio. Deben respetar lo que el sistema indica. | Política del sistema. |

# Cuestiones legales

Protección al Consumidor: La Ley Federal de Protección al Consumidor (LFPC) es el marco principal. Los proveedores deben:

Informar de manera clara y veraz sobre productos, precios, garantías y condiciones de envío.

Respetar las garantías ofrecidas, que no pueden ser inferiores a sesenta días.

Si el producto está dañado notificar al vendedor para que puedan tratar los procesos de garantía.

Privacidad de Datos: Se debe cumplir con la Ley Federal de Protección de Datos Personales en Posesión de Particulares. Esto incluye tener una política de privacidad visible en el sitio web que explique qué datos se recopilan, para qué se utilizan y cómo se protegen.

Comercio Electrónico: El marco legal incluye el Código de Comercio y el Código Civil Federal. Existe la Norma Oficial Mexicana NMX-COE-001-SCFI-2018, de aplicación voluntaria, que ofrece una guía de buenas prácticas para proteger a los consumidores en transacciones en línea.

# Información en dominios de interés

Dominio de Moda y Comercio Electrónico

Se encontrará con un catálogo de productos en donde se podrá acceder a todo el contenido actualizado, contando con un inventario para ver la disponibilidad de artículos y que puedan ver cuántas ventas se realizan y cuando deben actualizar el stock. Además del proceso de compra el cual se rige por llenar el carrito, contactar a la tienda para acordar los medios de entrega de los productos, y las políticas de devolución de los productos que se desean comprar, así como la realización del pago.

Tipo red social

El sistema Looksy podrá verse como una red social de ropa, en donde todos los compradores subirán sus inspiraciones de outfits basados en sus compras, permitiendo que con esto los demás compradores puedan ver sus fotos y poder decidir si comprar esas prendas.

Comunicacion e interaccion con la comunidad

Habrá mucha interacción entre los usuarios de la plataforma ya que podrán comentar y reaccionar a publicaciones de los usuarios si estos lo permiten, además de que el comprador tendrá comunicación con el vendedor para poder asegurarse de que su artículo sea lo que el comprador quiere y ayudar con dudas sobre tallas, tamaños, devoluciones, métodos de pago, envíos, etc.

