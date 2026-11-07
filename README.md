# FRAMA AUTO · Sitio web de demostración

Landing + catálogo responsive para **importación y venta de vehículos**, basado en la referencia visual negra/dorada y el logotipo elegido.

## Cómo arrancar

Requiere **Node.js 18+**, sin instalar dependencias.

```bash
npm run dev
```

Abrir **http://localhost:4173**. Para comprobar el JSON:

```bash
npm test
```

También sirve cualquier servidor estático (`python -m http.server 4173`). **No abrir `index.html` por doble clic**, ya que muchos navegadores impiden `fetch()` de JSON local con `file://`.

## Funciones

- Inicio con imagen hero, bloques de servicios e introducción al proceso.
- Catálogo cargado desde `data/vehiculos.json` con búsqueda, filtros y ordenación.
- Tarjetas que enlazan a fichas individuales con seis vistas (principal, frontal, trasera, lateral, interior y volante), descripción, equipamiento y especificaciones técnicas.
- Navegación usando rutas hash (`#/vehiculo/slug`), compatible con alojamiento estático, incluida GitHub Pages.
- Diseño adaptable a móvil, tablet y ordenador, menú móvil, controles de galería y estados vacíos.
- Botón de contacto **solo demostrativo**: copia el texto de una consulta, no lo envía ni lo guarda.
- Preparado para migrar a BBDD mediante `js/data-provider.js`. Diseño de permisos y SQL propuesto en `docs/bbdd-y-permisos.md` y `db/schema.sql`.

## Datos ficticios, imágenes y derechos

**IMPORTANTE: NO ES UNA WEB OPERATIVA.** Los vehículos, precios, kilómetros, equipamientos y descripciones son **datos ficticios de muestra**. La mayoría de las imágenes son recortes de composiciones generadas para esta maqueta; **no documentan coches concretos** y algunas vistas no coinciden con marca, modelo o ángulo del nombre mostrado.

Las vistas opcionales externas enlazan a imágenes de Unsplash y tienen alternativa local si fallan: trasera BMW [Manu](https://unsplash.com/photos/7AjfWQFMgcM), volante BMW [Sebastiaan Chia](https://unsplash.com/photos/KTIKM41HsQY), trasera Mercedes [Rana Singh](https://unsplash.com/photos/k6-lNNJifcg), trasera Audi [Leo Gilgamesh](https://unsplash.com/photos/zyfRL9DTxR0). Revisar licencias, identidad del vehículo y consentimiento antes de usar fotografías reales en producción.

## Publicar

Se puede publicar la raíz del proyecto en una rama de GitHub Pages sin compilación. Los enlaces usan hashes y todas las rutas de recursos son relativas. **La web publicada será solo una demostración:** no exponer a visitantes públicos datos ficticios como inventario real.

## Estructura

```text
assets/                Logo, portada y fotos ilustrativas
css/styles.css         Estilos responsive
js/app.js              UI, filtros, tarjetas, fichas y galerías
js/data-provider.js    Capa de acceso a datos
data/vehiculos.json    Inventario de ejemplo
db/schema.sql          Propuesta PostgreSQL (no implementada)
docs/                  Contrato de permisos y plan de migración
tests/validate.mjs     Validación básica del catálogo
index.html             Entrada única
```

## Pendiente antes de producción

Información real de contacto, disponibilidad, condiciones de venta, textos legales y privacidad, fotos y fichas de unidades reales, registro de marca, persistencia, API, autenticación, RBAC validado en servidor y auditoría.

### GitHub Pages

Este proyecto está publicado en la rama `main` de [javidei/frama-auto](https://github.com/javidei/frama-auto), desde la carpeta raíz (`/`).

URL prevista de GitHub Pages: **https://javidei.github.io/frama-auto/**. La primera publicación puede requerir que GitHub complete su despliegue.

Para actualizarlo, revisa los cambios en una rama o haz commits en `main` desde GitHub o Git local. No contiene backend ni secretos.