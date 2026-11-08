# Verificación realizada

- Comprobación TypeScript sin errores.
- Compilación de producción completada con el adaptador Vinext/Sites.
- Pruebas automáticas de integridad del JSON, rutas únicas, fichas y nueve vistas, filtros combinados, límites de precio, estado vacío y orden numérico.
- Pruebas HTTP de inicio, las tres fichas, información, recursos locales y API de consulta; 404 con recuperación y rechazo de escritura pública.
- Comprobación del bloqueo del área de administración con GET/POST/PUT/PATCH/DELETE, incluso con una cabecera que pretende ser de propietario.
- Comprobación de la selección de vehículo en el formulario desde la respuesta del servidor.
- Revisión en navegador de portada, búsqueda y filtros, orden ascendente, ficha, selección de fotografía, galería ampliada, siguiente foto y cierre con Escape.
- Revisión del formulario: vista previa local y vehículo preseleccionado desde una ficha. No se transmite el formulario.
- Revisión visual y de anchura en escritorio, tablet de 768 px y móvil de 390 px. Sin desbordamiento horizontal; menú móvil funcional y galería reorganizada en tres columnas de miniaturas.

Límites: móvil comprobado mediante tamaño de navegador, sin un dispositivo Android físico. No se ha auditado con lector de pantalla. No hay BBDD, autenticación comercial, envíos de contacto ni panel de administración activos. Las comprobaciones locales no sustituyen una validación comercial de los datos y fotografías reales.
