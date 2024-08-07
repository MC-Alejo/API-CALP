# Historial de Cambios

## [2.1.1] - 2024-07-27

### Change

- Se modifico los formatos de las respuestas JSON de las solicitudes

### Fixed

- Bug que impedía que los Encargados de un Área puedan visualizar información de la tarea de una solicitud específica.

## [2.0.1] - 2024-07-27

### Added

- Restricción adicional al editar/finalizar/eliminar tareas y alarmas (El juez o GO solo pueden)

## [2.0.0] - 2024-07-26

### Added

- Endpoint para obtener las areas con su encargado de area.
- Endpoint para obtener datos ordenados y completos relacionados con las tareas y solicitudes.
- Endpoint para la gestión de backups y de restore.
- Nueva funcionalidad para los backups automaticos.
- Nueva funcionalidad de generacion de reportes.
- Fecha de cumplimiento para las tareas finalizadas.
- Telefono para los empleados.
- Se agrego en la validación de roles del endpoint "Solicitudes por ID" al Encargado de área.

### Changed

- Las tareas que genera el Jefe de Mantenimiento fue modificada, ahora se posee mayor flexibilidad.
- Refactorización de las alarmas, ahora son manejadas como tareas.
- Endpoints para obtencion de datos de las alarmas.
- Mejora en la eficiencia de las consultas SQL.

### Fixed

- Corrección en el endpoint "inventario de tarea" no trae las tareas finalizadas.

### Removed

- Tabla de alarmas en la base de datos.

## [1.0.0] - 2023-11-23

### Added

- Implementación inicial de la API.
- Funcionalidades CRUD básicas.
- Integración con base de datos PostgreSQL.
