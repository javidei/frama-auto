# Conectar el catálogo a una base de datos

Esta fase no está implementada ni activada. La demo permanece de solo lectura. No basta con cambiar una variable para habilitar una administración insegura.

## Modelo propuesto

| Entidad | Campos principales |
|---|---|
| vehicles | id, slug único, marca, modelo, versión, año, kilómetros, combustible, cambio, carrocería, precio en céntimos, moneda, potencia, descripción, estado draft/published/archived, is_demo, created_at, updated_at, version |
| vehicle_specs | vehicle_id, clave, valor, posición |
| vehicle_equipment | vehicle_id, categoría, texto, posición |
| vehicle_images | id, vehicle_id, URL o storage_key, tipo de vista, texto alternativo, posición, imagen principal |
| users | id interno, issuer y subject únicos del proveedor de identidad, estado activo/desactivado |
| roles | owner, editor, viewer |
| permissions | catalog.read, catalog.write, catalog.publish, catalog.delete, users.manage |
| user_roles | user_id, role_id, asignado por, fecha |
| role_permissions | role_id, permission_id |
| audit_log | actor, acción, entidad, id, fecha, resultado y referencia de cambios sin datos sensibles |

`owner` administra usuarios y permisos, además del catálogo. `editor` puede crear y modificar borradores; la publicación y eliminación se otorgan por separado. `viewer` solo puede consultar el área privada. El catálogo público solo expone registros publicados y sus campos públicos. La condición de propietario se obtiene del proveedor de identidad y la base de datos, nunca del navegador.

## Orden de integración

1. Elegir motor y proveedor de identidad compatibles con el alojamiento. Si se usa un Worker, emplear un driver HTTP o un binding admitido por la plataforma. Mantener conexión y secretos solo en servidor.
2. Crear migraciones versionadas, restricciones, claves foráneas e índices para slug, estado y filtros. Importar este JSON como `is_demo = true`, sin convertirlo en stock real.
3. Implementar `CatalogRepository.list` y `findBySlug` en un adaptador de BBDD. Mapear los registros al mismo DTO `Vehicle` o revisar de forma explícita el contrato para contenido real. Utilizar consultas parametrizadas. No enviar datos internos de usuarios al cliente.
4. Para fotos individuales, guardar URL/clave de almacenamiento, vista y alt por imagen; adaptar `CarImage`. Validar uploads por contenido MIME, tamaño y dimensiones; guardar archivos fuera de rutas ejecutables.
5. Integrar una sesión real con cookies HttpOnly/Secure y política SameSite apropiada. Verificar firma, issuer, audience y caducidad en servidor con el SDK del proveedor. No aceptar roles de cabeceras arbitrarias, formularios, JWT sin verificar ni localStorage.
6. Implementar autorización por permiso en cada lectura privada y cada mutación, incluidos endpoints por id y subidas. Resolver roles vigentes en BBDD usando la identidad ya verificada. Comprobar que el usuario sigue activo. Devolver 401 sin sesión y 403 sin permiso.
7. Añadir protección CSRF/origen para operaciones con cookies, validación de entrada en servidor, rate limiting, registro de auditoría y control de concurrencia por `version`/`updated_at`.
8. Solo entonces sustituir el bloqueo de `app/api/admin/vehicles/route.ts` por handlers protegidos. Crear el primer propietario con un procedimiento administrativo fuera del registro público; denegar todo acceso no concedido expresamente.
9. Probar denegación sin sesión, sesión caducada, usuario desactivado, permisos revocados, editor intentando otorgarse roles y acceso por id a recursos no autorizados. Verificar también que el API público no devuelve borradores.

## Flujo obligatorio del servidor

```text
Petición → verificar sesión real → cargar usuario y permisos actuales
          → autorizar acción y recurso → validar datos y CSRF
          → transacción de escritura + auditoría → respuesta mínima
```

El frontend podrá ocultar controles según permisos para mejorar la experiencia; las decisiones de seguridad siempre se repiten en el servidor. La demo no incluye ningún control que finja estar autenticado.
