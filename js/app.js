import { getVehicles } from './data-provider.js';

const $ = (selector, scope = document) => scope.querySelector(selector);
const money = (amount) => new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(amount);
const number = (value) => new Intl.NumberFormat('es-ES').format(value);
const escapeHTML = (value = '') => String(value).replace(/[&<>"']/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char]);
const icon = (name) => {
  const paths = {
    year: '<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M7 3v4M17 3v4M3 10h18"/>',
    km: '<circle cx="12" cy="12" r="9"/><path d="m12 12 5-4M7 17h10"/>',
    fuel: '<path d="M5 3h10v18H5zM7 7h6M15 8h2l3 3v7a2 2 0 0 1-4 0v-4"/>',
    gear: '<rect x="4" y="4" width="16" height="16" rx="3"/><path d="M8 8h8M8 12h8M12 8v9"/>'
  };
  return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${paths[name] || paths.year}</svg>`;
};
const state = { vehicles: [], activeVehicle: null, photoIndex: 0, activeTab: 'description', favorites: new Set() };

try { state.favorites = new Set(JSON.parse(localStorage.getItem('frama-favoritos-demo') || '[]')); } catch { /* storage unavailable */ }
const persistFavorites = () => { try { localStorage.setItem('frama-favoritos-demo', JSON.stringify([...state.favorites])); } catch { /* optional */ } };

function assetImage(source, alt, className = '', lazy = true) {
  return `<img src="${escapeHTML(source.src || source)}" alt="${escapeHTML(alt)}" class="${escapeHTML(className)}" ${lazy ? 'loading="lazy"' : 'fetchpriority="high"'} ${source.fallback ? `data-fallback="${escapeHTML(source.fallback)}"` : ''}>`;
}
function setupImageFallbacks(root = document) {
  root.querySelectorAll('img[data-fallback]').forEach((img) => {
    img.addEventListener('error', () => { if (img.dataset.fallback) { img.src = img.dataset.fallback; delete img.dataset.fallback; } }, { once: true });
  });
}
function vehicleCard(v) {
  const liked = state.favorites.has(v.id);
  return `<article class="vehicle-card">
    <a class="card-image-link" href="#vehiculo/${encodeURIComponent(v.id)}" aria-label="Ver ficha de ${escapeHTML(v.marca)} ${escapeHTML(v.modelo)}">
      ${assetImage(v.imagenes[0], `${v.marca} ${v.modelo}, foto de demostración`)}
      <span class="card-badge">DEMO</span><span class="card-image-shade" aria-hidden="true"></span>
    </a>
    <button class="favorite-btn ${liked ? 'is-favorite' : ''}" data-favorite="${escapeHTML(v.id)}" type="button" aria-pressed="${liked}" aria-label="${liked ? 'Quitar de' : 'Añadir a'} favoritos: ${escapeHTML(v.marca)} ${escapeHTML(v.modelo)}">${liked ? '♥' : '♡'}</button>
    <div class="card-content">
      <div class="card-topline"><span>${escapeHTML(v.marca)}</span><span>${escapeHTML(v.carroceria)}</span></div>
      <h3 class="card-name"><a href="#vehiculo/${encodeURIComponent(v.id)}">${escapeHTML(v.modelo)}</a></h3>
      <div class="card-version">${escapeHTML(v.version)}</div>
      <div class="card-specs">
        <span class="card-spec">${icon('year')}${v.anio}</span><span class="card-spec">${icon('km')}${number(v.kilometros)} km</span>
        <span class="card-spec">${icon('fuel')}${escapeHTML(v.combustible)}</span><span class="card-spec">${icon('gear')}${escapeHTML(v.cambio)}</span>
      </div>
      <div class="card-bottom"><div><span class="price-label">Precio ilustrativo</span><strong class="card-price">${money(v.precio)}</strong></div>
        <a class="card-arrow" href="#vehiculo/${encodeURIComponent(v.id)}" aria-label="Ver ${escapeHTML(v.modelo)}">↗</a></div>
    </div>
  </article>`;
}
function getFiltered() {
  const query = $('#filter-query').value.trim().toLocaleLowerCase('es-ES');
  const brand = $('#filter-brand').value;
  const fuel = $('#filter-fuel').value;
  const body = $('#filter-body').value;
  const sort = $('#filter-sort').value;
  const items = state.vehicles.filter(v => {
    const haystack = `${v.marca} ${v.modelo} ${v.version} ${v.carroceria}`.toLocaleLowerCase('es-ES');
    return (!query || haystack.includes(query)) && (!brand || v.marca === brand) && (!fuel || v.combustible === fuel) && (!body || v.carroceria === body);
  });
  const orders = { 'price-asc': (a,b) => a.precio-b.precio, 'price-desc':(a,b)=>b.precio-a.precio, newest:(a,b)=>b.anio-a.anio, 'km-asc':(a,b)=>a.kilometros-b.kilometros, featured:(a,b)=>Number(b.destacado)-Number(a.destacado) };
  return items.sort(orders[sort] || orders.featured);
}
function renderCatalog() {
  const vehicles = getFiltered();
  $('#vehicle-grid').innerHTML = vehicles.map(vehicleCard).join('');
  $('#listing-count').textContent = `${vehicles.length} ${vehicles.length === 1 ? 'vehículo' : 'vehículos'} de ejemplo`;
  $('#empty-state').hidden = vehicles.length !== 0;
  setupImageFallbacks($('#vehicle-grid'));
}
function populateFilters() {
  for (const [field, property] of [['#filter-brand','marca'], ['#filter-fuel','combustible'], ['#filter-body','carroceria']]) {
    const select = $(field);
    [...new Set(state.vehicles.map(v => v[property]))].sort((a,b) => a.localeCompare(b,'es')).forEach(value => {
      const option = document.createElement('option'); option.value = value; option.textContent = value; select.append(option);
    });
  }
}
function specs(items) { return items.map(([label, value]) => `<div class="spec-item"><dt>${escapeHTML(label)}</dt><dd>${escapeHTML(value)}</dd></div>`).join(''); }
function detailPhoto(v, index) {
  const pic = v.imagenes[index];
  return `${assetImage(pic, `${v.marca} ${v.modelo}: vista ${pic.tipo.toLocaleLowerCase('es-ES')}, imagen ilustrativa`, 'detail-photo', index !== 0)}<span class="photo-label">${escapeHTML(pic.tipo)} · Fotografía ilustrativa</span>`;
}
function renderPhoto(v) {
  const gallery = $('#detail-main-image');
  if (!gallery) return;
  const pic = v.imagenes[state.photoIndex];
  gallery.innerHTML = `${detailPhoto(v, state.photoIndex)}<button class="gallery-nav prev" type="button" data-gallery-move="-1" aria-label="Foto anterior">‹</button><button class="gallery-nav next" type="button" data-gallery-move="1" aria-label="Foto siguiente">›</button>`;
  document.querySelectorAll('.detail-thumb').forEach((button, i) => button.setAttribute('aria-pressed', String(i === state.photoIndex)));
  setupImageFallbacks(gallery);
}
function renderTab(v) {
  const el = $('#detail-tab-panel');
  if (!el) return;
  const allSpecs = [ ['Marca',v.marca], ['Modelo',v.modelo], ['Versión',v.version], ['Año',String(v.anio)], ['Kilometraje',`${number(v.kilometros)} km`], ['Combustible',v.combustible], ['Cambio',v.cambio], ['Carrocería',v.carroceria], ['Potencia',`${v.potenciaCV} CV`], ['Cilindrada',`${number(v.cilindradaCC)} cm³`], ['Tracción',v.traccion], ['Transmisión',v.transmision], ['Consumo orientativo',`${String(v.consumoL100).replace('.',',')} l/100 km`], ['Emisiones orientativas',`${v.emisionesGKm} g/km`], ['Etiqueta (demo)',v.etiqueta], ['Puertas',String(v.puertas)], ['Plazas',String(v.plazas)], ['Color',v.color], ['Disponibilidad','Vehículo ficticio · sin stock real'] ];
  const blocks = {
    description: `<h2>Descripción del vehículo</h2><p>${escapeHTML(v.descripcion)}</p><p class="detail-muted">Todos los datos se muestran únicamente para ilustrar una ficha de producto.</p>`,
    equipment: `<h2>Equipamiento ilustrativo</h2><ul class="equipment-grid">${v.equipamiento.map(item => `<li>${escapeHTML(item)}</li>`).join('')}</ul>`,
    technical: `<h2>Ficha técnica de demostración</h2><dl class="technical-grid">${specs(allSpecs)}</dl>`
  };
  el.innerHTML = blocks[state.activeTab] || blocks.description;
  document.querySelectorAll('.detail-tab').forEach(button => { const active = button.dataset.tab === state.activeTab; button.setAttribute('aria-selected', String(active)); button.tabIndex = active ? 0 : -1; });
}
function renderDetail(v) {
  state.activeVehicle = v;
  state.photoIndex = 0;
  state.activeTab = 'description';
  const el = $('#detail-view');
  el.innerHTML = `
    <div class="detail-crumb"><a href="#inicio">Inicio</a><span>/</span><a href="#catalogo">Vehículos</a><span>/</span>${escapeHTML(v.marca)} ${escapeHTML(v.modelo)}</div>
    <a href="#catalogo" class="detail-back">← Volver al catálogo</a>
    <div class="detail-layout">
      <div class="detail-gallery">
        <div class="detail-main-image" id="detail-main-image"></div>
        <div class="detail-thumbs" aria-label="Galería de imágenes de demostración">${v.imagenes.map((pic,i) => `<button type="button" class="detail-thumb" data-photo="${i}" aria-pressed="${i===0}" aria-label="Ver foto ${escapeHTML(pic.tipo)}">${assetImage(pic, `Vista ${pic.tipo}`)}<span>${escapeHTML(pic.tipo)}</span></button>`).join('')}</div>
      </div>
      <aside class="detail-summary">
        <div class="detail-brand">${escapeHTML(v.marca)} · CATÁLOGO DEMO</div>
        <h1>${escapeHTML(v.modelo)}</h1><p class="detail-version">${escapeHTML(v.version)}</p>
        <span class="detail-price">${money(v.precio)}<small>Precio ficticio de demostración</small></span>
        <dl class="spec-list">${specs([['Año',String(v.anio)], ['Kilometraje',`${number(v.kilometros)} km`], ['Combustible',v.combustible], ['Cambio',v.cambio], ['Potencia',`${v.potenciaCV} CV`], ['Carrocería',v.carroceria], ['Color',v.color], ['Disponibilidad','Sin stock real']])}</dl>
        <div class="detail-actions"><button type="button" class="btn btn-gold" data-contact-vehicle="${escapeHTML(v.id)}">Preparar consulta <span aria-hidden="true">↗</span></button><button type="button" class="btn btn-ghost" data-favorite="${escapeHTML(v.id)}" aria-pressed="${state.favorites.has(v.id)}">${state.favorites.has(v.id) ? '♥ Guardado en favoritos' : '♡ Añadir a favoritos'}</button></div>
        <p class="detail-demo-warning">Consulta de ejemplo: no hay inventario, precios ni vehículos reales publicados.</p>
      </aside>
    </div>
    <div class="details-below">
      <div class="detail-tabs" role="tablist" aria-label="Información del vehículo"><button type="button" class="detail-tab" data-tab="description" role="tab" aria-selected="true">Descripción</button><button type="button" class="detail-tab" data-tab="equipment" role="tab" aria-selected="false">Equipamiento</button><button type="button" class="detail-tab" data-tab="technical" role="tab" aria-selected="false">Ficha técnica</button></div>
      <div class="detail-tab-panel" role="tabpanel" id="detail-tab-panel"></div>
    </div>
    <div class="notice-inline"><strong>Próxima fase:</strong> datos y fotografías servidos desde una API con base de datos. Solo personal autenticado y autorizado podrá gestionar el inventario.</div>`;
  renderPhoto(v);
  renderTab(v);
  setupImageFallbacks(el);
}
function route() {
  const hash = decodeURIComponent(location.hash.slice(1));
  const detail = hash.startsWith('vehiculo/');
  const id = detail ? hash.slice('vehiculo/'.length) : null;
  const v = id && state.vehicles.find(vehicle => vehicle.id === id);
  const home = $('#home-view');
  const detailView = $('#detail-view');
  if (detail && v) {
    home.hidden = true; detailView.hidden = false; renderDetail(v);
    $('#header').classList.add('in-detail');
    window.scrollTo({ top: 0, behavior: 'instant' });
    document.title = `${v.marca} ${v.modelo} | FRAMA AUTO (demo)`;
  } else {
    home.hidden = false; detailView.hidden = true;
    $('#header').classList.remove('in-detail');
    document.title = 'FRAMA AUTO | Importación y venta de vehículos';
    if (detail && !v) location.replace('#catalogo');
    else if (hash) requestAnimationFrame(() => document.getElementById(hash)?.scrollIntoView({behavior:'smooth'}));
  }
  closeMenu();
}
function closeMenu() { $('#main-nav').classList.remove('open'); $('#mobile-menu-toggle').setAttribute('aria-expanded','false'); $('#mobile-menu-toggle').setAttribute('aria-label','Abrir menú'); }
function contactOpen(v) { if (v) $('#contact-car').value = `${v.marca} ${v.modelo} ${v.version}`; $('#form-feedback').textContent = ''; $('#contact-dialog').showModal(); }

document.addEventListener('click', async (event) => {
  const fav = event.target.closest('[data-favorite]');
  if (fav) { const id = fav.dataset.favorite; state.favorites.has(id) ? state.favorites.delete(id) : state.favorites.add(id); persistFavorites(); if (!$('#detail-view').hidden && state.activeVehicle?.id === id) renderDetail(state.activeVehicle); else renderCatalog(); return; }
  const photo = event.target.closest('[data-photo]');
  if (photo && state.activeVehicle) { state.photoIndex = Number(photo.dataset.photo); renderPhoto(state.activeVehicle); return; }
  const movement = event.target.closest('[data-gallery-move]');
  if (movement && state.activeVehicle) { state.photoIndex = (state.photoIndex + Number(movement.dataset.galleryMove) + state.activeVehicle.imagenes.length) % state.activeVehicle.imagenes.length; renderPhoto(state.activeVehicle); return; }
  const tab = event.target.closest('[data-tab]');
  if (tab && state.activeVehicle) { state.activeTab = tab.dataset.tab; renderTab(state.activeVehicle); return; }
  const vehicleContact = event.target.closest('[data-contact-vehicle]');
  if (vehicleContact) { contactOpen(state.vehicles.find(v => v.id === vehicleContact.dataset.contactVehicle)); return; }
});

$('#mobile-menu-toggle').addEventListener('click', () => { const menu = $('#main-nav'); const open = menu.classList.toggle('open'); $('#mobile-menu-toggle').setAttribute('aria-expanded', String(open)); $('#mobile-menu-toggle').setAttribute('aria-label', open ? 'Cerrar menú' : 'Abrir menú'); });
$('#main-nav').addEventListener('click', e => { if (e.target.closest('a')) closeMenu(); });
$('#filter-form').addEventListener('input', renderCatalog);
$('#filter-form').addEventListener('change', renderCatalog);
$('#filter-form').addEventListener('reset', () => setTimeout(renderCatalog, 0));
$('#empty-reset').addEventListener('click', () => { $('#filter-form').reset(); renderCatalog(); });
$('#open-contact').addEventListener('click', () => contactOpen());
$('#close-contact').addEventListener('click', () => $('#contact-dialog').close());
$('#contact-dialog').addEventListener('click', (event) => { if (event.target === $('#contact-dialog')) $('#contact-dialog').close(); });
$('#contact-form').addEventListener('submit', async (event) => {
  event.preventDefault();
  const name = $('#contact-name').value.trim(); const car = $('#contact-car').value.trim(); const message = $('#contact-message').value.trim();
  if (!name || !message) { $('#form-feedback').textContent = 'Introduce tu nombre y un mensaje.'; return; }
  const draft = `Hola, soy ${name}.\n${car ? `Me interesa el vehículo: ${car}.\n` : ''}${message}\n\nEnviado desde una demostración de FRAMA AUTO (sin envío automático).`;
  try { await navigator.clipboard.writeText(draft); $('#form-feedback').textContent = 'Consulta copiada. Podrás pegarla donde quieras.'; }
  catch { $('#form-feedback').textContent = 'La copia automática no está disponible en este navegador. Selecciona el texto para copiarlo.'; const textarea=document.createElement('textarea'); textarea.value=draft; textarea.readOnly=true; textarea.rows=5; $('#form-feedback').append(textarea); }
});
window.addEventListener('hashchange', route);
window.addEventListener('scroll', () => $('#header').classList.toggle('scrolled', window.scrollY > 60), {passive:true});
$('#year').textContent = new Date().getFullYear();

async function init() {
  try {
    state.vehicles = await getVehicles();
    populateFilters();
    renderCatalog();
    route();
  } catch(err) {
    console.error(err);
    $('#vehicle-grid').innerHTML = '<div class="loading-error">No se pudo cargar el catálogo de demostración. Abre la web con un servidor local HTTP (consulta el README).</div>';
    $('#listing-count').textContent = 'Sin conexión al catálogo';
  }
}
init();
