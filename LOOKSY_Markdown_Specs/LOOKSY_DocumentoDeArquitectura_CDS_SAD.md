# LOOKSY_DocumentoDeArquitectura_CDS_SAD

LOOKSY

Documento de Arquitectura del software

| Id. Proyecto |  |
|---|---|
| Nombre del Proyecto | LOOKSY |
| Fecha | 02-03-2026 |
| Elaborado por | Dafne Guadalupe Orozco Aguirre Montserrat Tenorio Villagomez Guadalupe Yolet Villagomez Nuñez Jesus Samuel Zavala Ayala |
| Localización del Documento |  |

Índice de Contenido

Documento de Arquitectura del Software

# Introducción

# Alcance

El presente documento tiene como objetivo presentar la propuesta arquitectónica del software Looksy.  Resume las decisiones relevantes tomadas para cubrir los requisitos de calidad y requerimientos funcionales del software, como lo son la estructura lógica de los componentes del sistema, su organización y/o reutilización,  tecnologías y herramientas de desarrollo que se utilizarán durante el desarrollo del software y sus esquemas de datos.

# Resumen Arquitectónico

# Tipo de Aplicación y Estilos Arquitectónicos

La arquitectura de software para el sistema Looksy es cliente-servidor, esto con el fin de procesar las solicitudes requeridas y acceder a la base de datos para resolver la solicitud de cliente. El sistema será una aplicación móvil multiusuario, esto con el fin de que los usuarios puedan interactuar de una manera libre y sin problemas la aplicación en el momento que ellos requieran sin necesidad de que haya saturación de solicitudes a la app.

Utilizaremos el patrón de arquitectura por capas esto para poder tener definido y organizado  todo nuestro sistema y que cada componente de código sea responsable del área en la que se encuentra, manteniendo una mejor organización del sistema.

# Aproximación Técnica

Para el desarrollo de la aplicación Looksy, las tecnologías que usaremos son las siguientes:

Desarrollo móvil frontend: Kotlin Multiplatform ya que sirve para desarrollar diferentes aplicaciones para múltiples plataformas(Android, IOS), permitiendo que haya una buena relación entre todos los componentes para desarrollo.

Desarrollo backend: Node.js  utilizando el framework Express.js, estos sirven para crear APIs rápidas, flexibles y con mucha escalabilidad que nos ayudarán a tener una buena lógica del negocio, procesando rápidamente los datos solicitados del cliente y tener una buena comunicación con la base de datos.

ORM: Prisma ORM funcionará como intermediario traductor entre backend y la base de datos, permitiendo que los datos no se pierdan y puedan tener una buena fluidez en la aplicación

Bases de datos: MySQl, se utilizará como el sistema gestor de base de datos para almacenar y administrar todos los datos del sistema.

Estas tecnologías fueron seleccionadas porque son de las mejores alternativas para desarrollar nuestro sistema en cuestión de compatibilidad, escalabilidad, rendimiento y mantenimiento, con el fin de que el sistema pueda trabajar de una manera rápida y fluida sin complicaciones.

# Ambiente de Desarrollo

Herramientas CASE:

Star UML 5.0.2 será utilizada para realizar los diferentes tipos de diagramas que serán necesarios para presentar la arquitectura del sistema.

IDE desarrollo aplicación móvil:

Android Studio (2025.1.3): IDE de desarrollo de la aplicación móvil  contiene las herramientas necesarias para desarrollar aplicaciones de este tipo.

IDE desarrollo backend:

Visual Studio Code (1.111.0): IDE de desarrollo para el backend, su gran cantidad de plugins y simplicidad es adecuado para manejar las diferentes tecnologías usadas en el backend

Lenguajes de programación:

Kotlin (2.2.21): Lenguaje principal utilizado para el desarrollo de la aplicación móvil.

Framework y librerías principales:

Compose Multiplatform (1.11.0-alpha 03): Librería principal utilizada para la construcción de la interfaz de usuario mediante el framework Compose.

Navigation Compose (2.8.0-alpha 10): Librería utilizada para gestionar la navegación entre las diferentes pantallas de la aplicación.

Lifecycle Runtime Compose (2.7.0): Librería encargada de la gestión del ciclo de vida de los componentes de la aplicación, permitiendo controlar estados y actividades dentro de cada pantalla.

Coil Compose (2.5.0): Librería utilizada para la carga y procesamiento asíncrono de imágenes dentro de la aplicación.

Accompanist FlowLayout (0.32.0): Librería utilizada para el diseño de interfaces dinámicas, como feeds con desplazamiento continuo o layouts adaptables.

Compose UI / Material Legacy (1.6.0): Conjunto de componentes e iconos utilizados para la construcción de la interfaz gráfica de la aplicación.

Backend y framework de servidor

Node.js (24.10): Entorno de ejecución utilizado para desarrollar y ejecutar el servidor de la aplicación. Permite la ejecución de JavaScript del lado del servidor y la gestión de las solicitudes provenientes de la aplicación móvil.

Express.js (5.1): Framework utilizado para la construcción de la API REST del sistema, permitiendo gestionar las rutas, solicitudes y respuestas entre la aplicación móvil y el servidor.

ORM

Prisma ORM (7.0): Herramienta que permite interactuar entre la aplicación desarrollada con Node.js y Express.js y la base de datos MySQL a través de objetos en código.

Android SDK

Compile SDK: 36 (versión objetivo utilizada para compilar la aplicación).

Min SDK: 24 (versión mínima de Android soportada por la aplicación).

Sistema de control de versiones

Git (2.44): Sistema de control de versiones que será utilizado para gestionar los cambios en el código fuente del proyecto y facilitar el trabajo colaborativo del equipo.

GitHub: Plataforma utilizada para el almacenamiento del repositorio del proyecto y la gestión de versiones.

# Ambiente de Producción

Aplicación móvil:
La aplicación Looksy se distribuye para dispositivos móviles mediante las tiendas oficiales Google Play Store y Apple App Store, permitiendo su instalación en dispositivos con sistemas operativos Android y iOS.

Comunicación con el servidor:
La aplicación móvil se comunica con el servidor a través de una API REST, utilizando el protocolo HTTP para enviar y recibir información en formato JSON.

Servidor Backend:
El backend del sistema se encuentra desplegado en un servidor que ejecuta Node.js junto con el framework Express.js, encargado de procesar las solicitudes de la aplicación móvil y gestionar la lógica del sistema.

Base de datos:
Los datos del sistema se almacenan en una base de datos relacional MySQL, la cual es administrada desde el backend mediante Prisma ORM, facilitando el acceso y la manipulación de la información.

Infraestructura:
La infraestructura del sistema se encuentra alojada en un servidor en la nube que garantiza disponibilidad, seguridad y escalabilidad para soportar múltiples usuarios conectados simultáneamente.

# Objetivos de la Arquitectura

La presente arquitectura pretende cubrir los objetivos de calidad esperados, siendo estos los siguientes:

| Atributo de calidad | Rango Requerido | Motivo | Estrategias para lograr el objetivo |
|---|---|---|---|
| Escalabilidad | Alto | Se debe permitir que la aplicación admita muchos usuarios a la vez sin que esto afecte su rendimiento. | Uso de la arquitectura cliente-servidor, backend con Node.js y manejo eficiente de consultas a la base de datos. |
| Flexibilidad | Medio | La aplicación debe poder adaptarse o modificarse dependiendo de las necesidades del usuario o de las nuevas tecnologías. | Utilizar la arquitectura de capas para poder tener una separación entre la presentación, la lógica y los datos de la app, asi como del lado del servidor usar prisma ORM para modularizar el motor de base de datos. |
| Disponibilidad | Medio | La aplicación debe de estar siempre disponible cada vez que el usuario entre a la app sin ningún problema, y en cualquier lugar. | Uso de servicios de nube con escalabilidad para no tener problemas y una buena conexión a la base de datos. |
| Usabilidad | Alto | El usuario  no debe tener problemas al usar la aplicación, ya que debe tener una interfaz intuitiva. | Uso de Compose UI para el desarrollo de la interfaz gráfica de la aplicación. |
| Rendimiento | Medio | La aplicación debe de responder rápidamente a la demanda de solicitudes de los usuarios. | Buena optimización en las consultas de la base de datos, carga asíncrona de las imágenes con Coil y manejo eficiente de recursos. |
| Multiplataforma | Alto | Es necesario que la aplicación sea compatible con dispositivos IOS y Android, para que los usuarios tengan la posibilidad de acceder sin problemas ni restricciones. | Realizar la implementación de la aplicación con el uso de Compose Multiplatform. |
| Accesibilidad | Medio | La aplicación debe contar con la capacidad de llegar al alcance de múltiples usuarios, tratando de que la interfaz sea amigable con el usuario y que este pueda acceder con facilidad desde su dispositivo móvil. | Implementar buenas prácticas de accesibilidad en la interfaz móvil, así como implementar un contraste adecuado y compatibilidad con lectores de pantalla. |
| Integridad | Alto | Los datos deben mantenerse consistentes durante todas las operaciones del sistema y es necesario que se eviten errores en la información de usuarios, los pedidos o los artículos. | Aplicar validaciones necesarias en la aplicación para mantener la consistencia de datos. Aplicar restricciones en la base de datos y control de transacciones. Uso de Mercado Pago al momento de realizar las ventas |
| Confiabilidad de datos | Alto | La aplicación debe garantizar el almacenamiento y la recuperación de los datos en caso de fallos al sistema, con el objetivo de proteger los datos. | Uso de base de datos MySQL con respaldos periódicos, copias de seguridad y manejo adecuado de errores. |
| Vista | Medio | La aplicación debe mantener una interfaz visual agradable, además, es necesario que la información se presente clara y ordenadamente para mejorar la experiencia de los usuarios. | Uso de diseño ordenado y estructurado con compose multiplatform, junto con la libreria de compose UI para iconos sencillos y entendibles . |

# Diseño de alto nivel de la arquitectura.

En esta sección se detallan de qué manera están organizados los componentes funcionales de alto nivel del sistema.

# Diagrama de componentes:

El diagrama de componentes muestra la arquitectura del sistema Looksy, basada en un modelo cliente-servidor con separación en capas, donde cada componente cumple una función específica.

# Diagrama de contexto:

Mediante este diagrama representamos las principales interacciones que nuestra aplicación implementará entre el usuario y los componentes del sistema. La forma en que se manejara dicha interacción es que el usuario podrá acceder a la aplicación de looksy, la cual actúa como cliente en la arquitectura de capas, la aplicación tendrá la capacidad de enviar solicitudes a través de una API REST al servidor desarrollado con Node .js y Express, el servidor backend se encarga de procesar las peticiones del usuario y realizar consultas a la base de datos, con el objetivo de almacenar o recuperar información necesaria.

# Diseño de bajo nivel (detallado) de la arquitectura.

En esta sección de la arquitectura se desarrollan diagramas de comportamiento y estructurales del sistema, que sirven para visualizar, especificar, construir y documentar los aspectos detallados de la arquitectura.

# 4. Diseño de bajo nivel (detallado) de la arquitectura.

En esta sección de la arquitectura se desarrollan diagramas de comportamiento y estructurales del sistema, que sirven para visualizar, especificar, construir y documentar los aspectos detallados de la arquitectura de Looksy.

# Vista Lógica.

Esta sección describe las partes arquitectónicas significativas del Modelo de Diseño, tales como su descomposición en subsistemas y paquetes. Y para cada paquete significativo, su descomposición en clases y utilerías de clases. Se debe introducir clases significativas para la arquitectura y describir sus responsabilidades, así como las relaciones, operaciones y atributos más importantes.

Diagrama de secuencia:

A través del diagrama de secuencia representamos las interacciones entre los objetos y componentes del sistema de Looksy a lo largo de la interacción del usuario, observando como los elementos colaboran entre sí, ilustrando el flujo de respuesta ante cada petición.

Modelo de diseño diagrama de clases

Se visualiza la estructura estática del sistema de Looksy, visualizando sus atributos y relaciones entre ellas.

Diagrama de componentes:

Capa de presentación: Es la encargada de la interacción directa con el usuario. En esta capa se encuentra la aplicación móvil, donde se muestran los datos y se envían las solicitudes hacia el servidor.

Capa de lógica de negocio: Esta capa se encarga de procesar las solicitudes recibidas desde la aplicación móvil, aplicar las reglas del sistema y gestionar la comunicación entre la capa de presentación y la capa de datos.

Capa de datos: Es la capa responsable del almacenamiento y gestión de la información del sistema. En esta capa se encuentra la base de datos MySQL, la cual permite almacenar, consultar y actualizar los datos utilizados por la aplicación.

# Vista de Datos

Describe la perspectiva de almacenamiento de datos persistentes del sistema.

Diagrama de base de datos o modelo de datos:

# Vista de Implementación.

Esta sección describe la estructura general del Modelo de Implementación, la descomposición del software en capas y subsistemas en el Modelo de Implementación.

Diagrama de implantación:

En este diagrama se puede ver como el software se despliega en diferentes nodos, con sus respectivas conexiones entre ellos. En este caso, la arquitectura está compuesta por un dispositivo móvil, donde se ejecuta la aplicación desarrollada con Kotlin Multiplatform, un servidor de aplicaciones que ejecuta el backend desarrollado con Node.js y Express.js, y un servidor de base de datos donde se almacena la información utilizando MySQL. La comunicación entre el cliente y el servidor se realiza mediante peticiones HTTP a través de una API REST, permitiendo el intercambio de datos entre los distintos componentes del sistema.

# Arquetipo de la solución

El arquetipo de Looksy representa la implementación concreta de una arquitectura de software que organiza todo el código fuente del proyecto en una estructura coherente y mantenible. Esta organización responde directamente al estilo arquitectónico de alto nivel Clean Architecture o diseño por capas, aplicada de manera simétrica tanto en el backend como en el frontend móvil.

Backend

La Capa de Dominio

Aquí viven las entidades del negocio (usuario, producto, tienda, atuendo, pedido) y las reglas fundamentales que identifican un usuario válido, qué condiciones debe cumplir un producto para ser publicado, o cómo calcular el precio final de un pedido.

Esta capa es completamente independiente de cualquier tecnología. Es código puro de Kotlin/JavaScript que simplemente expresa el negocio de Looksy en términos del lenguaje de la aplicación.

Dentro de la capa de dominio encontramos tres subcarpetas: entidades con los objetos centrales del negocio, objetos-valor con conceptos que no tienen identidad propia pero son importantes así como reglas con validaciones y lógica de negocio compleja.

La Capa de Aplicación

Aquí es donde definimos los casos de uso específicos que nuestra aplicación soporta: registrar un usuario, filtrar productos, publicar un atuendo o procesar una compra.

Cada caso de uso es una pieza de código que coordina el flujo de una operación completa, aplicar cualquier regla de negocio relevante, y luego invocar al repositorio correspondiente para persistir la información.

Se organiza en dos partes principales. Por un lado están los servicios, que son componentes reutilizables que encapsulan operaciones comunes y por otro lado están los casos de uso, organizados por funcionalidad cada uno representando un camino completo que un usuario puede recorrer en la aplicación.

Esta capa conoce al dominio ya que usa sus entidades y reglas, pero no involucra tecnologías externas.

La Capa de Infraestructura

Aquí es donde se implementan todos los detalles técnicos que permiten que la aplicación funcione realmente: la conexión a la base de datos MySQL a través de Prisma, la implementación concreta de los repositorios que antes eran solo interfaces..

Esta capa depende completamente de tecnologías específicas.

Dentro de infraestructura encontramos subcarpetas claramente diferenciadas: base-datos con el cliente de Prisma, almacenamiento para la gestión de archivos, y externos para los adaptadores de servicios de terceros.

La Capa de Interfaces

Aquí es donde llegan las peticiones HTTP desde la app móvil, donde se validan, se transforman a objetos que la aplicación entiende, y donde se preparan las respuestas para enviar de vuelta.

Esta capa está organizada en varias subcarpetas. Las rutas definen los endpoints de nuestra API REST y los conectan con los controladores apropiados. Los controladores reciben las peticiones, invocan los casos de uso correspondientes y formulan las respuestas. Los middlewares procesan las peticiones antes de que lleguen a los controladores (autenticación, rate limiting, logging). Los validadores se aseguran de que los datos de entrada tengan el formato correcto. Y los DTO (Data Transfer Objects) definen la forma exacta de los datos que viajan por la red.

Los controladores no contienen lógica de negocio. Su única responsabilidad es traducir entre HTTP y nuestra aplicación: reciben un request, extraen los datos, invocan un caso de uso, y convierten el resultado en una respuesta HTTP.

Frontend

El frontend de Looksy sigue una organización muy similar a la del backend. Al aplicar los mismos principios arquitectónicos en ambos lados, creamos un sistema donde los desarrolladores pueden moverse con facilidad entre frontend y backend ya que la arquitectura es consistente.

La Capa de Dominio

Aquí el dominio contiene la lógica específica de la aplicación móvil y las reglas de presentación.

Por ejemplo, el caso de uso "filtrar-productos.caso.kt", que recibe los criterios de búsqueda del usuario y los prepara para enviarlos al backend, pero no contiene la lógica real de filtrado también contiene lógica de validación de formularios y transformaciones de datos para la UI.

La Capa de Datos

Aquí es donde implementamos todo lo relacionado con la obtención y persistencia de datos en el dispositivo.

Esta capa tiene tres subcomponentes principales: Primero, los modelos, que son las representaciones de datos que usa la aplicación. Segundo, las fuentes de datos, que incluyen tanto las llamadas a la API remota como el acceso a la base de datos local. Tercero, los repositorios, que implementan una estrategia de "cache-first": primero intentan obtener datos de la base local, y si no están o están expirados, llaman a la API y actualizan el cache.

Esta organización permite que la aplicación funcione offline y que la experiencia del usuario sea fluida incluso en condiciones de red deficientes.

La Capa de Presentación

Aquí es donde existen todas las pantallas, componentes y lógica de UI de la aplicación.

Está organizada en dos grandes bloques: viewmodels y pantallas.

La carpeta viewmodels contiene ViewModels globales que no pertenecen a una pantalla específica. Por ejemplo, sesion-viewmodel.kt gestiona el estado de autenticación del usuario en toda la aplicación, mientras que tema-viewmodel.kt maneja las preferencias de tema claro u oscuro.

La carpeta pantallas es donde se localiza la interfaz de usuario organizada por funcionalidades. Cada funcionalidad principal tiene su propia carpeta que contiene todo lo necesario para esa parte de la aplicación, así como lo necesario para ser reutilizadas en algún otro componente.

# Herramientas para la Integración

El sistema Looksy estará integrado por una variedad de aplicaciones de hardware y software. La aplicación móvil se desarrollará con Android Studio como entorno de desarrollo, y se utilizarán, para crear la interfaz de usuario, el framework Compose Multiplatform y el lenguaje de programación Kotlin.

Para la comunicación entre el cliente y servidor utilizaremos una API Rest, en la cual Node.js será el escenario principal junto con el framework Express.js. el cual nos permitirá  manejar las respuestas y las solicitudes entre el servidor y la aplicación móvil.

Para el acceso y gestión de los datos de la aplicación se utilizará MySQL como sistema gestor de base de datos, el cual estará conectado mediante Prisma ORM, permitiendo la manipulación e interpretación de los datos desde el servidor.

En cuanto a las herramientas de control e integración del código, se utilizará Git para el control de versiones y GitHub como repositorio remoto, permitiendo almacenar el proyecto, facilitar el trabajo colaborativo del equipo y mantener un historial de las diferentes versiones del sistema.

Además, el sistema será probado en dispositivos móviles Android/IOS y ejecutado en diferentes equipos de desarrollo con sistema operativo Windows o Linux. Las herramientas utilizadas cuentan con licencias de uso libre o de código abierto, lo que facilita su implementación dentro del proyecto.

# Ambiente para la Integración

La integración del sistema se realizará en diferentes ambientes de desarrollo con el fin de que la aplicación se desenvuelva de la mejor manera y obtener un software de calidad.

Ambiente de desarrollo:

En este escenario se integrarán los diferentes componentes del sistema. En el desarrollo móvil tenemos como IDE Android Studio, junto con Kotlin y Compose Multiplatform, en el desarrollo backend se utilizara Node.js junto con el framework Express.js , mientras que la base de datos será gestionada por MySQL conectado a través de Prisma ORM. El código fuente será almacenado y controlado mediante Git y GitHub, permitiendo la integración continua del proyecto.

Ambiente de pruebas:

En este ambiente se evaluará y se realizarán las pruebas necesarias para verificar que la aplicación pueda comunicarse correctamente con el servidor y la base de datos, además de que se evaluará el correcto funcionamiento de la API, la autenticación de los usuario y la integridad de todos los datos.

Ambiente de producción:

Este es el entorno final en donde se albergará la aplicación, junto con el servidor backend que estará alojado en un servidor web para ejecutar Node.js , mientras que MySQL mantendrá toda la información proveniente del sistema, este ambiente incluirá controles estrictos de acceso, monitoreo constante, registros (logs) y respaldos para proteger la información y detectar fallas rápidamente.

Vista de Despliegue.

En la vista de despliegue del sistema Looksy encontraremos los componentes en los cuales el sistema se implementara. La arquitectura es un modelo cliente-servidor en donde los procesos del sistema se ejecutan en varios nodos físicos conectados a través de internet.

El primer nodo corresponde al dispositivo móvil del usuario, en donde se ejecuta la aplicación desarrollada en Kotlin utilizando Compose Multiplatform. Este nodo representa la capa de presentación del sistema y es responsable de la interacción con el usuario.

El segundo nodo representa el servidor backend en donde se desarrolla la lógica de negocio de la aplicación, además de que aquí se encuentra la API desarrollada con  Node.js y el framework Express.js, que se encargan de procesar las solicitudes provenientes del sistema.

El tercer nodo contiene el servidor de base de datos, que es donde se aloja toda la información del sistema mediante MySQL. Teniendo por consecuencia Prisma ORM como  intermediario entre el backend y la base de datos.

Los nodos se comunican a través de la red Internet  utilizando el protocolo HTTP mediante servicios REST, para el intercambio de datos entre la aplicación móvil, backend y la base de datos.

# Ambiente para el Despliegue

El sistema Looksy se desplegará en un ambiente cliente-servidor conectado a través de Internet. La aplicación móvil se ejecutará en los dispositivos Android/IOS de los usuarios, donde la interfaz estará desarrollada con kotlin y el framework Compose Multiplatform, desarrollada mediante el entorno Android Studio.

El backend del sistema se ejecutará en un servidor que contará con el entorno Node.js, utilizando el framework Express.js para gestionar la API REST que permitirá la comunicación entre la aplicación móvil y el servidor.

La base de datos del sistema será gestionada en MySQL, contando como intermediario entre el backend y la base de datos Prisma ORM para la correcta manipulación de los datos en el backend.

Los distintos componentes del sistema se comunicarán a través de internet mediante protocolos HTTP, permitiendo el intercambio seguro de información entre los dispositivos móviles, el servidor de aplicaciones y el servidor de base de datos.

