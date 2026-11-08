# FRAMA AUTO: usuarios, vehículos y fotografías en Supabase

## Estado
La migración `db/frama_auto_supabase.sql` está preparada, pero **es código de instalación**; no prueba por sí sola que haya sido aplicada al proyecto.

Está diseñada para convivir con otros proyectos de Supabase, mediante tres tablas con prefijo `frama_` y un esquema auxiliar `frama_internal` (funciones de autorización). No debe ejecutarse sobre un proyecto equivocado.

## Tablas y alcance

- `public.frama_user_roles`: usuario de Supabase Auth, rol `administrador` o `gestor` y estado activo.
- `public.frama_vehicles`: ficha, ficha técnica, kilómetros, precio en céntimos, estado de venta (disponible/reservado/vendido/en importación), estado de publicación (borrador/publicado/archivado), versión y autor.
- `public.frama_vehicle_photos`: categoría de cada imagen, descripción, posición y portada. Bucket privado: `frama-auto-vehiculos`.

## Permisos
| Acción | Visitante | Gestor | Administrador |
| --- | --- | --- | --- |
| Consultar vehículos publicados | Sí | Sí | Sí |
| Consultar borradores | No | Sí | Sí |
| Crear y editar vehículos | No | Sí | Sí |
| Cambiar estado de venta o publicación | No | Sí | Sí |
| Gestionar fotos | No | Sí | Sí |
| Eliminar definitivamente una ficha | No | No | Sí |
| Asignar/revocar roles | No | No | Sí |

Los permisos se aplican **en la base de datos mediante RLS**, no por ocultar un botón. Los gestores podrán archivar o despublicar; la eliminación irreversible queda reservada al administrador. El administrador podrá inactivar gestores.

## Primer administrador
La cuenta del panel de Supabase **no es automáticamente un usuario de Supabase Auth de la web**. Debe existir un usuario de Auth verificado al que asignar el rol con su UUID real. No seleccionar arbitrariamente cualquier cuenta de Auth.

Ejemplo para ejecutar en SQL Editor **después** de identificar la cuenta correcta:

```sql
insert into public.frama_user_roles (user_id, role)
values ('UUID-REAL-DEL-USUARIO-AUTH', 'administrador')
on conflict (user_id)
do update set role='administrador', active=true;
```

El dueño del proyecto puede administrar roles desde SQL Editor al principio. Más adelante se puede desarrollar una pantalla exclusiva para administradores, respaldada por estas políticas.

## Imágenes
Subir con rutas `<uuid-vehiculo>/<nombre-archivo>` al bucket `frama-auto-vehiculos`. Tamaño máximo por archivo: 12 MB; solo JPEG, PNG y WebP. Guardar en `frama_vehicle_photos` la ruta exacta, categoría, descripción, orden y si es portada. Para visualizar imágenes de un bucket privado, usar la API de descarga con autorización; no presuponer que `getPublicUrl` sirve en un bucket privado.

## Alerta de publicación
El catálogo actual se genera desde `data/vehicles.json` y una exportación de GitHub Pages. La migración de la base de datos **no conecta automáticamente la web**. Faltan cliente, autenticación, consulta de catálogo e integración de altas, ediciones, fotos y publicación. Los vehículos demostrativos deben permanecer identificados como tales. La web pública nunca debe contener una clave `service_role` o secret key.
