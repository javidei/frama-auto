/* FRAMA AUTO · Preparador de altas. No publica ni sube archivos. */
(function () {
  "use strict";
  const VISTAS = [
    "Vista principal", "Frontal", "Trasera", "Lateral izquierdo", "Lateral derecho",
    "Frontal tres cuartos", "Trasera tres cuartos", "Carrocería", "Capó",
    "Techo", "Interior", "Salpicadero y volante", "Asientos delanteros",
    "Plazas traseras", "Llantas", "Faros delanteros", "Pilotos traseros",
    "Maletero", "Motor", "Detalle de equipamiento"
  ];
  const MAX_FOTOS = 30;
  const MAX_BYTES = 12 * 1024 * 1024;
  const fotos = [];
  const base = location.pathname === "/frama-auto" || location.pathname.startsWith("/frama-auto/") ? "/frama-auto/" : "/";

  function iniciar() {
    const root = document.getElementById("frama-vehicle-editor");
    if (!root || root.dataset.framaReady === "yes") return;
    root.dataset.framaReady = "yes";
    if (!document.querySelector('link[data-frama-editor]')) {
      const css = document.createElement("link");
      css.rel = "stylesheet";
      css.href = base + "admin-vehicle-form.css";
      css.setAttribute("data-frama-editor", "");
      document.head.appendChild(css);
    }
    root.innerHTML = [
      '<div class="vf-heading">',
      ' <div><p class="vf-eyebrow">GESTIÓN DEL CATÁLOGO / ALTA</p><h2 id="vf-title">Añadir un vehículo</h2><p>Rellena una ficha de ejemplo. Los textos grises son pistas: <strong>los campos empiezan vacíos</strong>.</p></div>',
      ' <span class="vf-demo-badge">VISTA PREVIA · SIN GUARDADO ONLINE</span>',
      '</div>',
      '<div class="vf-alert" role="note"><strong>Importante:</strong> este formulario es un prototipo público. Las fotos se ven solo en este navegador, no se suben. Puedes descargar los datos como JSON, pero todavía no se crea un anuncio ni se guarda en la BBDD.</div>',
      '<form id="vf-form" autocomplete="off">',
      ' <section class="vf-panel"><div class="vf-panel-head"><span>01</span><div><h3>Datos principales</h3><p>Identificación, precio y estado del vehículo</p></div></div>',
      '  <div class="vf-grid">',
      '   <label>Marca <span>*</span><input name="brand" maxlength="60" required placeholder="Ej. BMW" /></label>',
      '   <label>Modelo <span>*</span><input name="model" maxlength="90" required placeholder="Ej. Serie 3 320d" /></label>',
      '   <label>Versión o acabado<input name="trim" maxlength="100" placeholder="Ej. M Sport · Automático" /></label>',
      '   <label>Año <span>*</span><input name="year" inputmode="numeric" maxlength="4" pattern="[0-9]{4}" required placeholder="Ej. 2022" /></label>',
      '   <label>Kilometraje <span>*</span><input name="mileage" inputmode="numeric" maxlength="22" required placeholder="Ej. 32.000 kilómetros" /></label>',
      '   <label>Precio de venta<input name="price" inputmode="numeric" maxlength="22" placeholder="Ej. 28.900 €" /></label>',
      '   <label>Potencia<input name="power" inputmode="numeric" maxlength="12" placeholder="Ej. 190 CV" /></label>',
      '   <label>Estado<select name="status"><option value="" selected disabled>Selecciona un estado</option><option value="disponible">Disponible</option><option value="reservado">Reservado</option><option value="vendido">Vendido</option><option value="en_importacion">En importación</option></select></label>',
      '  </div>',
      ' </section>',
      ' <section class="vf-panel"><div class="vf-panel-head"><span>02</span><div><h3>Características</h3><p>Ficha técnica y equipamiento</p></div></div>',
      '  <div class="vf-grid">',
      '   <label>Combustible<select name="fuel"><option value="" selected>Selecciona el combustible</option><option>Diésel</option><option>Gasolina</option><option>Híbrido ligero</option><option>Híbrido</option><option>Híbrido enchufable</option><option>Eléctrico</option><option>Otro</option></select></label>',
      '   <label>Cambio<select name="transmission"><option value="" selected>Selecciona el cambio</option><option>Manual</option><option>Automático</option></select></label>',
      '   <label>Carrocería<select name="body"><option value="" selected>Selecciona la carrocería</option><option>Berlina</option><option>SUV</option><option>Compacto</option><option>Familiar</option><option>Deportivo</option><option>Coupé</option><option>Cabrio</option><option>Monovolumen</option><option>Otro</option></select></label>',
      '   <label>Color exterior<input name="color" maxlength="70" placeholder="Ej. Gris grafito metalizado" /></label>',
      '   <label>Número de puertas<input name="doors" inputmode="numeric" maxlength="2" placeholder="Ej. 5" /></label>',
      '   <label>Plazas<input name="seats" inputmode="numeric" maxlength="2" placeholder="Ej. 5" /></label>',
      '   <label>Etiqueta ambiental<select name="ecoLabel"><option value="" selected>Selecciona la etiqueta</option><option>0</option><option>ECO</option><option>C</option><option>B</option><option>Sin distintivo</option></select></label>',
      '   <label>Procedencia<input name="origin" maxlength="120" placeholder="Ej. Alemania" /></label>',
      '   <label class="vf-full">Equipamiento (uno por línea)<textarea name="equipment" rows="4" maxlength="4000" placeholder="Ej. Climatizador bizona&#10;Faros LED&#10;Cámara de marcha atrás"></textarea></label>',
      '   <label class="vf-full">Descripción<textarea name="description" rows="4" maxlength="4000" placeholder="Ej. Vehículo en muy buen estado, con historial documentado y equipamiento destacado."></textarea></label>',
      '  </div>',
      ' </section>',
      ' <section class="vf-panel"><div class="vf-panel-head"><span>03</span><div><h3>Fotografías del vehículo</h3><p>Sube fotos, clasifica cada vista y elige la portada</p></div></div>',
      '  <label class="vf-dropzone" for="vf-files"><strong>+ Añadir fotografías</strong><small>JPG, PNG, WEBP y otros formatos de imagen · Máximo 30 fotos y 12 MB por foto</small></label>',
      '  <input id="vf-files" class="vf-file-input" type="file" accept="image/*" multiple aria-label="Seleccionar fotografías del vehículo" />',
      '  <div id="vf-photo-error" class="vf-message" role="status" aria-live="polite"></div>',
      '  <div id="vf-gallery" class="vf-gallery" aria-live="polite"><p class="vf-empty">Todavía no has añadido fotos. Cada imagen tendrá su propio selector de vista.</p></div>',
      '  <p class="vf-photo-help">Vistas habituales: principal, frontal, trasera, laterales, interior, volante, asientos y llantas. Elige <strong>«Otra vista…»</strong> para escribir cualquier detalle nuevo, por ejemplo «Luces diurnas LED».</p>',
      ' </section>',
      ' <div class="vf-actions"><button type="button" id="vf-preview" class="vf-primary">Ver resumen de la ficha</button><button type="button" id="vf-export" class="vf-secondary">Descargar borrador JSON</button><button type="button" id="vf-reset" class="vf-quiet">Limpiar formulario</button></div>',
      ' <p id="vf-status" class="vf-message" role="status" aria-live="polite"></p>',
      '</form>',
      '<section id="vf-preview-box" class="vf-preview" aria-label="Vista previa de la ficha" hidden><h3>Resumen del vehículo</h3><div class="vf-preview-layout"><div id="vf-preview-photo"></div><div><strong id="vf-preview-title"></strong><p id="vf-preview-details"></p><p id="vf-preview-count"></p></div></div><p>Esta vista previa no representa una publicación real.</p></section>'
    ].join("");

    const form = root.querySelector("#vf-form");
    const gallery = root.querySelector("#vf-gallery");
    const fileInput = root.querySelector("#vf-files");
    const error = root.querySelector("#vf-photo-error");
    const status = root.querySelector("#vf-status");

    function campo(name) {
      return form.elements.namedItem(name).value.trim();
    }
    function numero(texto) {
      const clean = String(texto).replace(/[^0-9]/g, "");
      return clean ? Number(clean) : null;
    }
    function etiquetaFoto(foto) {
      return foto.vista === "__otra" ? foto.otra.trim() : foto.vista;
    }
    function pintarFotos() {
      gallery.replaceChildren();
      if (!fotos.length) {
        const empty = document.createElement("p");
        empty.className = "vf-empty";
        empty.textContent = "Todavía no has añadido fotos. Cada imagen tendrá su propio selector de vista.";
        gallery.append(empty);
        return;
      }
      fotos.forEach((foto, index) => {
        const card = document.createElement("article");
        card.className = "vf-photo-card";
        card.innerHTML = [
          '<div class="vf-photo-image"><img alt="Vista previa local de la fotografía" /></div>',
          '<div class="vf-photo-controls">',
          ' <div class="vf-photo-heading"><strong class="vf-photo-number"></strong><button type="button" class="vf-remove" aria-label="Eliminar esta fotografía">Eliminar</button></div>',
          ' <p class="vf-photo-filename"></p>',
          ' <label>¿Qué muestra la foto?<select class="vf-view"><option value="">Selecciona una vista</option></select></label>',
          ' <label class="vf-custom-label" hidden>Nombre de la nueva vista<input type="text" class="vf-custom" maxlength="65" placeholder="Ej. Luces diurnas LED" /></label>',
          ' <label>Detalle opcional<input type="text" class="vf-caption" maxlength="130" placeholder="Ej. Faro izquierdo encendido" /></label>',
          ' <label class="vf-cover"><input type="radio" name="vf-cover" /> Usar como imagen principal</label>',
          '</div>'
        ].join("");
        const img = card.querySelector("img");
        img.src = foto.url;
        const number = card.querySelector(".vf-photo-number");
        number.textContent = "Foto " + (index + 1);
        card.querySelector(".vf-photo-filename").textContent = foto.file.name;
        const select = card.querySelector(".vf-view");
        VISTAS.forEach(label => {
          const opt = document.createElement("option");
          opt.value = label;
          opt.textContent = label;
          select.append(opt);
        });
        const other = document.createElement("option");
        other.value = "__otra";
        other.textContent = "Otra vista… (escribir)";
        select.append(other);
        select.value = foto.vista;
        const customWrap = card.querySelector(".vf-custom-label");
        const custom = card.querySelector(".vf-custom");
        custom.value = foto.otra;
        customWrap.hidden = foto.vista !== "__otra";
        select.addEventListener("change", () => {
          foto.vista = select.value;
          customWrap.hidden = foto.vista !== "__otra";
          if (foto.vista === "__otra") custom.focus();
        });
        custom.addEventListener("input", () => { foto.otra = custom.value; });
        const caption = card.querySelector(".vf-caption");
        caption.value = foto.detalle;
        caption.addEventListener("input", () => { foto.detalle = caption.value; });
        const cover = card.querySelector(".vf-cover input");
        cover.checked = foto.portada;
        cover.addEventListener("change", () => {
          fotos.forEach((item, i) => { item.portada = i === index; });
        });
        card.querySelector(".vf-remove").addEventListener("click", () => {
          URL.revokeObjectURL(foto.url);
          fotos.splice(index, 1);
          if (fotos.length && !fotos.some(item => item.portada)) fotos[0].portada = true;
          pintarFotos();
        });
        gallery.append(card);
      });
    }

    fileInput.addEventListener("change", () => {
      const selected = Array.from(fileInput.files || []);
      let rejected = 0;
      selected.forEach(file => {
        if (!file.type.startsWith("image/") || file.size > MAX_BYTES || fotos.length >= MAX_FOTOS) {
          rejected += 1;
          return;
        }
        fotos.push({
          file: file, url: URL.createObjectURL(file), vista: "", otra: "", detalle: "",
          portada: fotos.length === 0
        });
      });
      fileInput.value = "";
      pintarFotos();
      error.textContent = rejected
        ? rejected + " archivo(s) descartados: comprueba el formato, tamaño o límite de fotos."
        : (selected.length ? "Fotografías añadidas solo a esta sesión del navegador." : "");
    });

    function ficha() {
      return {
        brand: campo("brand"),
        model: campo("model"),
        trim: campo("trim"),
        year: numero(campo("year")),
        mileage: numero(campo("mileage")),
        price: numero(campo("price")),
        power: numero(campo("power")),
        status: campo("status"),
        fuel: campo("fuel"),
        transmission: campo("transmission"),
        body: campo("body"),
        color: campo("color"),
        doors: numero(campo("doors")),
        seats: numero(campo("seats")),
        ecoLabel: campo("ecoLabel"),
        origin: campo("origin"),
        equipment: campo("equipment").split(/\r?\n/).map(s => s.trim()).filter(Boolean),
        description: campo("description"),
        gallery: fotos.map((foto, index) => ({
          slot: index,
          label: etiquetaFoto(foto),
          detail: foto.detalle.trim(),
          filename: foto.file.name,
          cover: foto.portada
        }))
      };
    }
    root.querySelector("#vf-preview").addEventListener("click", () => {
      const data = ficha();
      const preview = root.querySelector("#vf-preview-box");
      const title = root.querySelector("#vf-preview-title");
      const details = root.querySelector("#vf-preview-details");
      const count = root.querySelector("#vf-preview-count");
      title.textContent = [data.brand, data.model, data.trim].filter(Boolean).join(" ") || "Vehículo sin identificar";
      const price = data.price === null ? "Precio pendiente" : new Intl.NumberFormat("es-ES").format(data.price) + " €";
      const mileage = data.mileage === null ? "Kilometraje pendiente" : new Intl.NumberFormat("es-ES").format(data.mileage) + " km";
      details.textContent = [data.year || "Año pendiente", mileage, price, data.fuel, data.transmission].filter(Boolean).join(" · ");
      count.textContent = fotos.length + " fotografía(s) en vista previa local";
      const photo = root.querySelector("#vf-preview-photo");
      photo.replaceChildren();
      const chosen = fotos.find(f => f.portada) || fotos[0];
      if (chosen) {
        const img = document.createElement("img");
        img.src = chosen.url;
        img.alt = etiquetaFoto(chosen) || "Portada sin categoría";
        photo.append(img);
      } else {
        photo.textContent = "Sin fotografía principal";
      }
      preview.hidden = false;
      preview.scrollIntoView({ behavior: "smooth", block: "nearest" });
      status.textContent = "Vista previa creada. No se ha publicado ni guardado en ningún servidor.";
    });
    root.querySelector("#vf-export").addEventListener("click", () => {
      if (!form.reportValidity()) {
        status.textContent = "Completa los campos obligatorios para descargar el borrador.";
        return;
      }
      if (fotos.some(foto => !etiquetaFoto(foto))) {
        status.textContent = "Indica qué muestra cada fotografía (puedes usar «Otra vista…»).";
        gallery.scrollIntoView({ behavior: "smooth", block: "start" });
        return;
      }
      const output = {
        ...ficha(),
        _aviso: "Borrador local. Los archivos de imagen no están incluidos, solo sus nombres y descripciones. No se ha publicado ni subido ningún dato."
      };
      const blob = new Blob([JSON.stringify(output, null, 2)], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "frama-auto-borrador-vehiculo.json";
      document.body.appendChild(a);
      a.click();
      a.remove();
      setTimeout(() => URL.revokeObjectURL(url), 1500);
      status.textContent = "Borrador descargado. Recuerda guardar las fotos originales aparte: el JSON solo lleva sus nombres y categorías.";
    });
    root.querySelector("#vf-reset").addEventListener("click", () => {
      if (!confirm("¿Borrar todos los campos y las fotografías de esta sesión?")) return;
      fotos.forEach(foto => URL.revokeObjectURL(foto.url));
      fotos.length = 0;
      form.reset();
      pintarFotos();
      root.querySelector("#vf-preview-box").hidden = true;
      error.textContent = "";
      status.textContent = "Formulario vacío. No hay datos guardados en el servidor.";
    });
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", iniciar, { once: true });
  else iniciar();
})();