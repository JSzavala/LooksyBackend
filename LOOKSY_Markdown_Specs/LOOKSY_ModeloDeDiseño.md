# LOOKSY_ModeloDeDiseño

INSTITUTO TECNOLÓGICO SUPERIOR DEL SUR DE GUANAJUATO

Modelo de diseño

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

Diagramas de interacción de diseño

A continuación se aprecia el diagrama de interacción de diseño, mismo que representa cómo los objetos del software colaboran para llevar a cabo el escenario de compra dentro del sistema de Looksy, donde se utiliza el patrón controlador para manejar las solicitudes de eventos del sistema, separando la interfaz de usuario de la lógica de negocio; cada objeto hace lo que corresponde como detallesVenta que calcula su propio subtotal ya que conoce la cantidad y el precio así mismo como el creado que determina que compra debe ser quien crea los objetos detallesVenta gracias que la compra contiene los detalles y los usa solicitados la información a los demás.

Cada flecha representa una llamada a un método real.

Diagrama de clases de diseño

El diagrama de diseño de clases cambia conforme el diagrama de interacción de diseño, añadiendo métodos que definen el comportamiento al igual que flechas que indican la qué clase tiene la referencia de quién y cómo se relacionan sus entre sí, donde:

Compra, suma los subtotales de todos los detallesVenta asociados.

DetallesVenta multiplica la cantidad por el precio unitario del artículo.

Artículo Verifica si la cantidad solicitada está disponible antes de permitir la creación del detalle.

Pago gestiona la respuesta de la transacción de pago y cambia el estado de la compra..

