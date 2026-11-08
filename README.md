# FRAMA AUTO · demostración

## Web publicada en GitHub Pages

Dirección pública: **https://javidei.github.io/frama-auto/**.

Este repositorio contiene el proyecto completo y una exportación estática del mismo diseño para GitHub Pages. Los archivos publicados (`index.html`, `_next/`, `images/`, `vehiculos/`, `informacion/`, `404.html`, recursos de navegación y `.nojekyll`) están en la raíz porque esa es la configuración de Pages existente.

Para actualizar la web después de modificar código o JSON:

```sh
npm ci
npm test
npm run export:pages
npm run preview:pages
```

La vista estática se comprueba en http://127.0.0.1:4173/frama-auto/. Después, subir a `main` tanto los cambios de código como los archivos generados en raíz. El despliegue automático de GitHub Pages publica esa raíz. El exportador compila Next.js en una carpeta temporal dentro de `work/`, conserva las fuentes con servidor y verifica las rutas y los recursos locales. No hay que subir `work/` ni `node_modules`.

GitHub Pages no ejecuta servidor: esta publicación no ofrece API, login, envío de mensajes ni administración. Las funciones visuales, los filtros y las galerías funcionan en el navegador. El código de la edición con servidor se conserva, incluido su bloqueo de administración y el plan de BBDD. La selección de coche desde una ficha se aplica al cargar el formulario en el navegador.

Antes de esta importación se conservó la versión anterior en la rama `codex/backup-before-import-2026-11-08`. El historial de `main` también conserva los commits previos.

Web responsive en español para importación y venta de vehículos. Estética negra/dorada basada en la referencia, logotipo original conservado mediante recorte de presentación y subtítulo corregido a «Importación y venta de vehículos».

## Arranque

Requisitos: Node.js 22.13 o superior (verificado con 24.15), npm e internet para instalar dependencias. Desde esta carpeta:

```sh
npm ci
npm run dev
```

Abre http://localhost:5173. En Windows, permite a la aplicación lanzar el servidor cuando el sistema solicite autorización. No hace falta configurar una base de datos, cuentas ni claves.

```sh
npm run build
npm start
```

El arranque de producción utiliza el emulador local del Worker generado; la consola muestra el puerto, normalmente 8787. El proyecto usa React, TypeScript y el starter Vinext con integración Sites. `npm run build` genera `dist/client` y `dist/server`, incluida la configuración necesaria del Worker.

## Qué incluye

- Portada, menú móvil, catálogo, proceso de importación, presentación y contacto de ejemplo.
- Tres vehículos de muestra con fichas independientes en `/vehiculos/[slug]`.
- Búsqueda por texto y filtros combinables de marca, combustible, carrocería, cambio y precio máximo. Orden por precio, año y kilometraje; estado vacío y reinicio. La URL conserva los filtros al recargar.
- Nueve vistas por vehículo: principal, frontal, trasera, ambos laterales, interior, salpicadero/volante, plazas traseras y llantas. Galería ampliable, navegación por flechas, cierre con Escape y gestión nativa del foco mediante `dialog`.
- Enlace desde una ficha al formulario con el vehículo preseleccionado. Solo crea una vista previa local; no envía mensajes ni persiste datos.
- Avisos de demostración, accesibilidad básica, estados de error y 404, movimiento reducido y navegación por teclado.

## Datos y límites de esta versión

`data/vehicles.json` es la fuente local. Los datos, precios, kilómetros, características y equipamientos son ficticios u orientativos. Ninguna ficha representa stock, un historial comprobado, una garantía o una oferta comercial. Las imágenes generadas pueden diferir de los modelos/versiones descritos. No se han inventado cifras de ventas, clientes o países.

Los recursos se sirven localmente en `public/images`; la web no depende de enlaces externos de imágenes ni fuentes tipográficas. Las galerías usan un atlas 3×3 por coche, mostrando cada vista mediante CSS. Para usar fotografías normales en la siguiente fase, sustituir `CarImage` por una imagen individual y guardar una URL por registro de galería.

El original del logo contiene un subtítulo antiguo. No se ha modificado su archivo: `Shell.tsx` y el estilo `.brand-crop` muestran exclusivamente el símbolo y FRAMA AUTO y añaden el subtítulo correcto como texto accesible.

## Arquitectura y futura BBDD

```text
Pantallas del servidor / API GET
            ↓
CatalogRepository (contrato TypeScript)
            ↓
JSON local → futuro adaptador de base de datos
```

- `lib/catalog/types.ts`: contrato público y forma de los vehículos.
- `lib/catalog/repository.ts`: punto único para cambiar el almacenamiento; solo se importa desde páginas/rutas del servidor.
- `lib/catalog/filter.ts`: filtrado puro y reutilizable para este catálogo pequeño.
- `app/api/vehicles`: consultas públicas de lectura; incluyen `demo: true`.
- `app/api/admin/vehicles`: administración deshabilitada en servidor, devuelve 503 en GET, POST, PUT, PATCH y DELETE. No hay login simulado, contraseñas demo ni autenticación en localStorage.
- `docs/BASE-DE-DATOS.md`: entidades, roles y pasos para una integración real.

Para catálogos grandes, trasladar filtros, orden y paginación al repositorio/API del servidor. Las pantallas no deben conocer conexiones, credenciales ni consultas SQL.

## Verificación

```sh
node node_modules/typescript/bin/tsc --noEmit
node --test tests/catalog.test.mjs
node --test tests/http.test.mjs
```

La última orden requiere `npm run dev` abierto. Para otro origen, configurar `FRAMA_TEST_URL` antes de lanzarla. Comprueba páginas, API, imágenes, errores y bloqueo de escrituras. `docs/VERIFICACION.md` registra las comprobaciones realizadas y sus límites.

## Publicación

La edición con servidor utiliza el alojamiento declarado en `.openai/hosting.json`, con un Worker y assets estáticos. La edición para GitHub Pages se genera con `npm run export:pages` y mantiene los mismos componentes visuales. La API y futura BBDD requieren desplegar la edición con servidor. Nunca subir `node_modules`, `.env`, claves, `.wrangler`, ni registros de ejecución.

Antes de operar comercialmente: sustituir el contenido ficticio por información verificada, incorporar datos legales y de contacto reales, implementar autenticación/autorización y un canal de contacto, revisar privacidad y condiciones, probar el alta/edición/publicación de vehículos y retirar los avisos demo únicamente de las unidades verificadas.
