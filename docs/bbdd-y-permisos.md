# Camino a la base de datos

## Situación actual

`js/data-provider.js` consulta `data/vehiculos.json`. No existe base de datos ni panel administrativo funcional; por tanto, **no hay autenticación simulada** ni usuarios con permisos reales. Los vehículos, precios y fotos son ejemplos.

## Siguiente fase (propuesta, pendiente de decisión)

1. Escoger motor y alojamiento: PostgreSQL gestionado, por ejemplo, o una alternativa equivalente. No se ha elegido proveedor.
2. API backend con validación de sesión, validación de datos y control de permisos por operación. La web no debe conectarse con usuario privilegiado a la BBDD.
3. Tablas `vehicles`, `vehicle_photos`, `app_users`, `audit_events` según `db/schema.sql`. Si hay fotos reales, subirlas a almacenamiento de objetos y persistir solo la clave.
4. Proteger cambios de estado: `draft` → `published`, `published` → `sold` y retirada de anuncios.
5. Panel de acceso restringido. Administradores conceden roles; editores crean y modifican anuncios; visitas solo leen publicados.
6. Auditoría de altas/ediciones/bajas, protección de imágenes, gestión de RGPD (datos de contacto, si aplica), backups y tests.

## Propuesta de API

| Método | Ruta | Acceso | Función |
|---|---|---|---|
| GET | `/api/vehicles` | público | Solo vehículos publicados, con filtros/paginación |
| GET | `/api/vehicles/:slug` | público | Detalle y galería publicada |
| POST | `/api/admin/vehicles` | editor/admin | Crear borrador |
| PATCH | `/api/admin/vehicles/:id` | editor/admin | Editar campos autorizados |
| POST | `/api/admin/vehicles/:id/photos` | editor/admin | Subir fotos (validación de formatos) |
| POST | `/api/admin/vehicles/:id/publish` | admin | Publicar tras revisión |
| DELETE | `/api/admin/vehicles/:id` | admin | Retirar/eliminar según política |
| PATCH | `/api/admin/users/:id/role` | admin | Conceder o revocar permisos |

`getVehicles()` podrá reemplazarse por `fetch('/api/vehicles')`, preservando la interfaz JSON. El esquema propuesto aún no está desplegado ni auditado para producción.
