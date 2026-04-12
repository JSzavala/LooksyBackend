# LOOKSY_StackTecnologico

INSTITUTO TECNOLÓGICO SUPERIOR DEL SUR DE GUANAJUATO

Stack tecnológico.

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

Frontend Móvil: Kotlin + Jetpack Compose Multiplatform

Tecnologías:

Kotlin Multiplatform

Jetpack Compose Multiplatform

SQLDelight (BD local)

Ktor Client (HTTP)

DataStore (preferencias)

Ventajas:

Código compartido entre iOS y Android (~60-80% reutilización)

Rendimiento nativo (compila a código específico de plataforma)

Programación reactiva con Compose (UI declarativa moderna)

Tipado fuerte y null-safety (menos errores en runtime)

Soporte oficial de JetBrains y Google

Acceso directo a APIs nativas cuando se necesita

Curva de aprendizaje gradual desde Kotlin

Desventajas:

Ecosistema más pequeño que React Native/Flutter

Menos librerías específicas para ciertos casos

Comunidad en crecimiento (no tan madura)

Curva de aprendizaje del KMM (Kotlin Multiplatform Mobile)

Tooling aún en evolución

Tiempo de compilación más lento que opciones interpretadas

Backend: Node.js + Express.js

Tecnologías:

Node.js runtime

Express.js framework

TypeScript (implícito por ser compatible)

Ventajas:

JavaScript/TypeScript en backend y frontend (si usaran web)

Alto rendimiento I/O (non-blocking)

Gran ecosistema de librerías (npm)

Curva de aprendizaje baja

Comunidad enorme y madura

Excelente para APIs REST

Fácil escalabilidad horizontal

Desventajas:

No es ideal para operaciones CPU-intensive

Callback hell (aunque Promises/async-await ayudan)

Tipado débil por defecto (TypeScript lo mejora)

Menos estructurado que frameworks como Spring Boot

Requiere cuidado con la arquitectura para proyectos grandes

ORM: Prisma

Ventajas:

Type-safe completo (consultas con autocompletado)

Migraciones automáticas y versionadas

Schema declarativo y fácil de entender

Excelente integración con TypeScript

Previene SQL injection por diseño

Query optimizado y performante

IDE support excepcional

Desventajas:

Capa de abstracción adicional (overhead mínimo)

Curva de aprendizaje del schema propio

Menos flexible que SQL puro para consultas complejas

Migraciones pueden ser lentas en BD grandes

Dependencia de herramientas de Prisma

Base de Datos: MySQL

Ventajas:

Madurez y estabilidad probada por décadas

Excelente rendimiento para lecturas

ACID compliant (transacciones confiables)

Amplia documentación y comunidad

Soporte universal en hosting services

Buen equilibrio entre características y simplicidad

Replicación nativa para escalabilidad

Desventajas:

Menos features modernas que PostgreSQL

Escalabilidad horizontal más compleja que NoSQL

Full-text search limitado comparado con Elasticsearch

JSON support menos robusto que PostgreSQL

Particionamiento más limitado

