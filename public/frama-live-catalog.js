/* FRAMA AUTO 0.1.4: public, read-only Supabase catalogue.
   Only rows published for the public may be read (RLS), never admin secrets. */
(function(){
"use strict";
if(window.__FRAMA_LIVE_STARTED)return;
window.__FRAMA_LIVE_STARTED=true;
window.FRAMA_LIVE_ACTIVE=true;
const API="https://avboupigkstzprrgvlhr.supabase.co";
const KEY="sb_publishable_eyFLhKFk9HXAab4q1cxG4A_-_la1-OI";
const BASE=location.pathname==="/frama-auto"||location.pathname.startsWith("/frama-auto/")?"/frama-auto":"";
const GOLF="volkswagen-golf-gti-mk6-adidas";
const esc=x=>String(x??"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#39;");
const num=x=>x==null||x===""?"No indicado":Number(x).toLocaleString("es-ES");
const price=x=>x==null||x===""?"Consultar":new Intl.NumberFormat("es-ES",{style:"currency",currency:"EUR",maximumFractionDigits:0}).format(Number(x));
const status=x=>({vendido:"VENDIDO",reservado:"RESERVADO",en_importacion:"EN IMPORTACIÓN",disponible:"DISPONIBLE"})[x]||"DISPONIBLE";
const link=x=>BASE+"/ficha/?slug="+encodeURIComponent(x.slug);
function style(){if(document.getElementById("frama-live-css"))return;const l=document.createElement("link");l.id="frama-live-css";l.rel="stylesheet";l.href=BASE+"/frama-live-catalog.css";document.head.appendChild(l);}
function photoUrl(p){if(p?.storage_path)return API+"/storage/v1/object/public/frama-vehicle-photos/"+p.storage_path.split("/").map(encodeURIComponent).join("/");if(p?.src&&/^\/images\/[\w./-]+$/.test(p.src))return BASE+p.src;return "";}
function getPhotos(v,all){return all.filter(x=>x.vehicle_id===v.id).sort((a,b)=>a.slot-b.slot);}
function cover(v,photos){const ps=getPhotos(v,photos),chosen=ps.find(x=>x.is_cover)||ps[0];return photoUrl(chosen)||(v.cover_src&&/^\/images\/[\w./-]+$/.test(v.cover_src)?BASE+v.cover_src:BASE+"/images/hero.png");}
async function getPublic(){
  const headers={apikey:KEY,Accept:"application/json"};
  const [a,b]=await Promise.all([
    fetch(API+"/rest/v1/frama_vehicles?select=*&publication_status=eq.published&is_demo=eq.false&order=created_at.desc",{headers,cache:"no-store"}),
    fetch(API+"/rest/v1/frama_vehicle_photos?select=vehicle_id,slot,label,detail,src,storage_path,is_cover&order=slot.asc",{headers,cache:"no-store"})
  ]);
  if(!a.ok||!b.ok)throw new Error("Error al consultar Supabase: "+a.status+"/"+b.status);
  const [vehicles,photos]=await Promise.all([a.json(),b.json()]);
  if(!Array.isArray(vehicles)||!Array.isArray(photos))throw new Error("Formato de datos inesperado");
  return {vehicles:vehicles.filter(v=>v.publication_status==="published"&&!v.is_demo),photos};
}
function card(v,photos){
  const sold=v.commercial_status==="vendido";
  return '<a class="frama-live-card" href="'+esc(link(v))+'"><div class="frama-live-card-visual"><img src="'+esc(cover(v,photos))+'" loading="lazy" alt="'+esc(v.brand+" "+v.model)+'"><span class="frama-live-tag">'+esc(status(v.commercial_status))+'</span></div>'
   +'<div class="frama-live-card-content"><span class="frama-live-eyebrow">'+esc(v.brand)+'</span><h3>'+esc(v.model)+'</h3><p>'+esc(v.trim||"")+'</p><div class="frama-live-card-metrics"><span>'+esc(v.year||"Año a consultar")+'</span><span>'+esc(num(v.mileage))+' km</span><span>'+esc(v.power_cv?v.power_cv+" CV":v.fuel||"")+'</span></div>'
   +'<div class="frama-live-card-bottom"><strong>'+(sold?"Operación realizada":esc(price(v.price_eur)))+'</strong><span>Ver ficha →</span></div></div></a>';
}
function renderHome(vehicles,photos){
 const catalog=document.getElementById("catalogo");
 if(!catalog)return;
 const oldSale=document.getElementById("vendidos"),oldStock=document.getElementById("frama-live-stock");
 if(oldSale)oldSale.remove();
 if(oldStock)oldStock.remove();
 const sold=vehicles.filter(v=>v.commercial_status==="vendido"),stock=vehicles.filter(v=>v.commercial_status!=="vendido");
 if(stock.length){
  const el=document.createElement("section");el.id="frama-live-stock";el.className="frama-live-stock";el.innerHTML='<div class="container"><span class="frama-live-eyebrow">FRAMA AUTO · STOCK REAL PUBLICADO</span><h2 class="frama-live-title">Vehículos en gestión.</h2><div class="frama-live-cards">'+stock.map(v=>card(v,photos)).join("")+'</div></div>';
  catalog.insertAdjacentElement("beforebegin",el);
 }
 if(sold.length){
  const el=document.createElement("section");el.id="vendidos";el.className="frama-live-sales";el.innerHTML='<div class="container"><span class="frama-live-eyebrow">NUESTRA TRAYECTORIA</span><h2 class="frama-live-title">Operaciones realizadas.</h2><div class="frama-live-cards">'+sold.map(v=>card(v,photos)).join("")+'</div><p class="frama-live-muted" style="margin-top:22px">Vehículos vendidos. Ya no están disponibles para compra.</p></div>';
  catalog.insertAdjacentElement("afterend",el);
 }
}
function labelStats(v){return [
 ["Año",v.year],["Kilometraje",v.mileage==null?null:num(v.mileage)+" km"],["Combustible",v.fuel],["Cambio",v.transmission],["Potencia",v.power_cv?v.power_cv+" CV":null],["Carrocería",v.body],["Color",v.color],["Procedencia",v.origin]
 ].filter(([,val])=>val!==null&&val!==undefined&&val!=="");}
function renderDetail(v,photos,root){
 root.classList.add("frama-live-detail");
 const sold=v.commercial_status==="vendido";
 const originals=getPhotos(v,photos);
 const all=originals.map(p=>({url:photoUrl(p),label:p.label||"Imagen del vehículo",cover:!!p.is_cover})).filter(p=>p.url);
 if(!all.length)all.push({url:cover(v,photos),label:"Vista principal",cover:true});
 const primary=Math.max(0,all.findIndex(p=>p.cover));
 const stats=labelStats(v);
 const extra=Object.entries(v.specs||{}).filter(([k,val])=>val!=null&&val!==""&&!/^(marca|modelo|versi[oó]n|año|kilometraje|precio|potencia|combustible|cambio|carrocer[ií]a|color|procedencia)/i.test(k)).map(([k,val])=>[k,String(val)]);
 const equipment=Object.entries(v.equipment||{}).filter(([,arr])=>Array.isArray(arr)&&arr.length);
 root.innerHTML='<nav class="breadcrumbs"><a href="'+BASE+'/#catalogo">← Volver a FRAMA AUTO</a></nav>'
 +'<div class="frama-live-detail-top"><div><span class="frama-live-eyebrow">'+esc(v.brand)+' · '+esc(status(v.commercial_status))+'</span><h1>'+esc(v.model)+'</h1><p class="frama-live-muted">'+esc(v.trim||"")+'</p></div><div class="frama-live-detail-meta"><span>'+esc(status(v.commercial_status))+'</span><span>Datos actualizados</span></div></div>'
 +'<div class="frama-live-detail-layout"><div class="frama-live-gallery"><button id="frama-live-photo-button" type="button" style="width:100%;padding:0;background:transparent;border:0" aria-label="Ampliar foto"><img id="frama-live-current" class="frama-live-gallery-main" src="'+esc(all[primary].url)+'" alt="'+esc(all[primary].label)+'"></button><div class="frama-live-gallery-bar"><span id="frama-live-caption"></span><span id="frama-live-counter"></span></div>'
 +'<div class="frama-live-thumbs">'+all.map((p,i)=>'<button type="button" class="frama-live-thumb" data-photo="'+i+'" aria-pressed="'+String(i===primary)+'" aria-label="Ver '+esc(p.label)+'"><img src="'+esc(p.url)+'" loading="lazy" alt=""><span>'+esc(p.label)+'</span></button>').join("")+'</div></div>'
 +'<aside class="frama-live-summary"><span class="frama-live-eyebrow">'+esc(status(v.commercial_status))+'</span><div class="frama-live-price">'+(sold?"Vendido":esc(price(v.price_eur)))+'</div><div class="frama-live-stats">'+stats.map(([k,val])=>'<div><span>'+esc(k)+'</span><strong>'+esc(val)+'</strong></div>').join("")+'</div><p class="frama-live-muted" style="margin-top:22px">'+(sold?"Operación finalizada. Este vehículo no está a la venta.":"Consulta con FRAMA AUTO las condiciones y disponibilidad.")+'</p></aside></div>'
 +'<section class="frama-live-detail-section"><span class="frama-live-eyebrow">DESCRIPCIÓN</span><h2>Conoce los detalles.</h2><p>'+esc(v.description||"Información pendiente.")+'</p></section>'
 +'<section class="frama-live-detail-section"><span class="frama-live-eyebrow">FICHA TÉCNICA</span><h2>Características del vehículo</h2><dl class="frama-live-specs">'+stats.concat(extra).map(([k,val])=>'<div><dt>'+esc(k)+'</dt><dd>'+esc(val)+'</dd></div>').join("")+'</dl></section>'
 +(equipment.length?'<section class="frama-live-detail-section"><span class="frama-live-eyebrow">EQUIPAMIENTO</span><h2>Equipamiento</h2><div class="frama-live-equipment">'+equipment.map(([k,items])=>'<article><h3>'+esc(k)+'</h3><ul>'+items.map(t=>'<li>'+esc(t)+'</li>').join("")+'</ul></article>').join("")+'</div></section>':"")
 +'<dialog class="frama-live-dialog" id="frama-live-dialog" aria-label="Galería ampliada"><div class="frama-live-dialog-bar"><strong id="frama-live-modal-label"></strong><button type="button" id="frama-live-close">Cerrar ×</button></div><img id="frama-live-modal-photo" alt=""><div class="frama-live-dialog-bar"><button type="button" id="frama-live-previous">← Anterior</button><span id="frama-live-modal-counter"></span><button type="button" id="frama-live-next">Siguiente →</button></div></dialog>';
 let current=primary;
 const $=s=>root.querySelector("#"+s),dialog=$("frama-live-dialog");
 function select(i){current=(i+all.length)%all.length;const p=all[current];
  $("frama-live-current").src=p.url;$("frama-live-current").alt=p.label;
  $("frama-live-caption").textContent=p.label;$("frama-live-counter").textContent=(current+1)+" / "+all.length;
  $("frama-live-modal-photo").src=p.url;$("frama-live-modal-photo").alt=p.label;
  $("frama-live-modal-label").textContent=p.label;$("frama-live-modal-counter").textContent=(current+1)+" / "+all.length;
  root.querySelectorAll(".frama-live-thumb").forEach((b,index)=>b.setAttribute("aria-pressed",String(index===current)));
 }
 root.querySelectorAll(".frama-live-thumb").forEach(b=>b.addEventListener("click",()=>select(Number(b.dataset.photo))));
 $("frama-live-photo-button").onclick=()=>dialog.showModal();$("frama-live-close").onclick=()=>dialog.close();
 $("frama-live-previous").onclick=()=>select(current-1);$("frama-live-next").onclick=()=>select(current+1);
 dialog.onclick=ev=>{if(ev.target===dialog)dialog.close();};
 dialog.onkeydown=ev=>{if(ev.key==="ArrowLeft")select(current-1);if(ev.key==="ArrowRight")select(current+1);};
 select(primary);
 document.title=v.brand+" "+v.model+" | FRAMA AUTO";
}
function unavailable(root){
 root.classList.add("frama-live-detail");
 root.innerHTML='<div class="frama-live-error"><h1>Vehículo no publicado</h1><p>El vehículo puede estar en borrador o haber sido archivado. No se muestran fichas privadas.</p><a href="'+BASE+'/#catalogo">← Volver al catálogo</a></div>';
 document.title="Vehículo no disponible | FRAMA AUTO";
}
function route(){
 const path=location.pathname;
 const home=path==="/"||path===BASE||path===BASE+"/";
 const generic=/\/ficha\/?$/.test(path);
 const slug=generic?new URLSearchParams(location.search).get("slug")||"":"";
 const old=path.match(/\/vehiculos\/([^/]+)\/?$/);
 const oldSlug=old?decodeURIComponent(old[1]):"";
 return {home,slug:generic?slug:oldSlug,detail:generic||oldSlug===GOLF};
}
let lastLoad=0;
async function start(){
 const r=route();if(!r.home&&!r.detail)return;
 if(Date.now()-lastLoad<1500)return;
 lastLoad=Date.now();
 style();
 try{
  const {vehicles,photos}=await getPublic();
  if(r.home)renderHome(vehicles,photos);
  if(r.detail){
   const main=document.getElementById("frama-live-detail")||document.querySelector("main");
   if(!main)return;
   const v=vehicles.find(x=>x.slug===r.slug);
   if(v)renderDetail(v,photos,main);else unavailable(main);
  }
 }catch(err){
  console.error("FRAMA AUTO: error al cargar catálogo publicado",err);
  const root=document.getElementById("frama-live-detail");
  if(root)root.innerHTML='<p class="frama-live-error">No se puede cargar esta ficha. Comprueba la conexión y vuelve a intentarlo.</p>';
  if(r.home){const sold=document.getElementById("vendidos");if(sold)sold.innerHTML='<div class="container frama-live-error">No se ha podido actualizar el historial de vehículos. Inténtalo de nuevo.</div>';}
  else if(r.detail){const main=document.querySelector("main");if(main&&!root)main.insertAdjacentHTML("afterbegin",'<p class="frama-live-error">No se pueden cargar los cambios actuales. La información que ves podría estar desactualizada.</p>');}
 }
}
window.addEventListener("storage",event=>{if(event.key==="frama-public-catalog-changed")start();});
document.addEventListener("visibilitychange",()=>{if(!document.hidden)start();});
window.addEventListener("pageshow",event=>{if(event.persisted)start();});
window.addEventListener("load",()=>setTimeout(start,2200));
function ready(){setTimeout(start,300);}
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",ready,{once:true});else ready();
})();
