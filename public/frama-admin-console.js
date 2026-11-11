/* FRAMA AUTO: panel de vehículos con Auth, RLS y Storage de Supabase. */
(function () {
"use strict";
const BASE = location.pathname.startsWith("/frama-auto") ? "/frama-auto/" : "/";
const API = "https://avboupigkstzprrgvlhr.supabase.co";
const KEY = "sb_publishable_eyFLhKFk9HXAab4q1cxG4A_-_la1-OI";
const BUCKET = "frama-vehicle-photos";
const CACHE_KEY = "frama-auto-auth-v1";
const TYPES = ["Vista principal","Frontal","Trasera","Lateral izquierdo","Lateral derecho","Diagonal delantera","Diagonal trasera","Carrocería","Capó","Techo","Interior general","Salpicadero","Volante","Cuadro de instrumentos","Pantalla multimedia","Consola central","Asientos delanteros","Asientos traseros","Maletero","Llantas","Neumáticos","Faros delanteros","Pilotos traseros","Retrovisores","Motor","Equipamiento especial"];
const STATUSES = [["disponible","Disponible"],["reservado","Reservado"],["vendido","Vendido"],["en_importacion","En importación"]];
let root, token=null, role=null, user=null, vehicles=[], editing=null, gallery=[], saved=false, saving=false;
function h(s){return String(s == null ? "" : s).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#39;");}
function el(id){return root.querySelector("#"+id);}
function msg(s,isError=false){const box=el("fa-msg");if(box){box.textContent=s;box.className="fa-msg"+(isError?" fa-error":"");}}
function label(s,value){return '<option value="'+h(s)+'"'+(String(s)===String(value)?" selected":"")+'>'+h(s)+'</option>';}
function opts(array,current){return array.map(v=>label(Array.isArray(v)?v[0]:v,Array.isArray(v)?v[0]:current).replace(/>[^<]*<\/option>$/,">"+h(Array.isArray(v)?v[1]:v)+"</option>")).join("");}
function field(name,title,value,placeholder,required=false){return '<label>'+h(title)+(required?' <b>*</b>':'')+'<input name="'+name+'" maxlength="400" value="'+h(value)+'" placeholder="'+h(placeholder)+'"'+(required?' required':'')+'></label>';}
function combo(name,title,arr,current){return '<label>'+h(title)+'<select name="'+name+'">'+arr.map(x=>{const a=Array.isArray(x)?x:[x,x];return '<option value="'+h(a[0])+'"'+(String(a[0])===String(current??"")?" selected":"")+'>'+h(a[1])+'</option>';}).join("")+'</select></label>';}
function int(v){if(v==null||String(v).trim()==="")return null;const n=Number(String(v).replace(/[^0-9]/g,""));return Number.isSafeInteger(n)?n:null;}
function fetchHeaders(auth){const o={"apikey":KEY};if(auth&&token)o.Authorization="Bearer "+token.access_token;return o;}
async function responseJson(r){const t=await r.text();let o={};try{o=JSON.parse(t||"{}");}catch(e){o={message:t};}if(!r.ok)throw new Error(o.msg||o.error_description||o.message||o.error||"Error HTTP "+r.status);return o;}
async function refresh(){if(!token||!token.refresh_token)throw new Error("Sesión caducada");const r=await fetch(API+"/auth/v1/token?grant_type=refresh_token",{method:"POST",headers:{"apikey":KEY,"Content-Type":"application/json"},body:JSON.stringify({refresh_token:token.refresh_token})});const data=await responseJson(r);setToken(data);}
function setToken(s){token={access_token:s.access_token,refresh_token:s.refresh_token||token?.refresh_token,expires_at:Math.floor(Date.now()/1000)+(s.expires_in||3600)};sessionStorage.setItem(CACHE_KEY,JSON.stringify(token));}
async function req(path,method="GET",body=null,kind="rest"){if(token&&token.expires_at<Date.now()/1000+45)await refresh();const url=API+"/"+kind+"/v1/"+path;const headers=fetchHeaders(true);if(body!==null)headers["Content-Type"]="application/json";if(method==="POST"||method==="PATCH")headers.Prefer="return=representation";const r=await fetch(url,{method,headers,body:body!==null?JSON.stringify(body):undefined,cache:"no-store"});return responseJson(r);}
async function authUser(){if(!token)return null;if(token.expires_at<Date.now()/1000+45)await refresh();const r=await fetch(API+"/auth/v1/user",{headers:fetchHeaders(true),cache:"no-store"});return responseJson(r);}
function clearSession(){token=null;role=null;user=null;sessionStorage.removeItem(CACHE_KEY);}

/* Modal independiente del panel: permanece visible tras reconstruir el listado. */
function showSaveSuccess(vehicle, wasEditing){
  const old=document.getElementById("fa-success-dialog");
  if(old)old.remove();
  const published=vehicle.publication_status==="published" && !vehicle.is_demo;
  const title=wasEditing?"Cambios guardados correctamente":"Vehículo guardado correctamente";
  const car=[vehicle.brand,vehicle.model,vehicle.trim].filter(Boolean).join(" ");
  const state=published
    ?"La ficha y las fotografías se han guardado en Supabase. Puedes consultar la versión publicada en la web."
    :vehicle.is_demo
      ?"Los datos se han guardado en Supabase. Los vehículos de demostración no se publican como stock real."
      :vehicle.publication_status==="archived"
        ?"Los cambios se han guardado. El vehículo está archivado y no aparece en el catálogo público."
        :"Los cambios se han guardado. El vehículo está en borrador y no aparece en el catálogo público.";
  const dialog=document.createElement("dialog");
  dialog.id="fa-success-dialog";
  dialog.className="fa-success-dialog";
  dialog.setAttribute("aria-labelledby","fa-success-title");
  dialog.setAttribute("aria-describedby","fa-success-description");
  const url=BASE+"ficha/?slug="+encodeURIComponent(vehicle.slug);
  dialog.innerHTML='<div class="fa-success-body"><div class="fa-success-icon" aria-hidden="true">✓</div>'
    +'<h2 id="fa-success-title">'+h(title)+'</h2>'
    +'<p class="fa-success-vehicle">'+h(car)+'</p>'
    +'<p id="fa-success-description">'+h(state)+'</p>'
    +'<div class="fa-success-actions"><button type="button" class="fa-success-ok">Aceptar</button>'
    +(published?'<a class="fa-success-view" href="'+h(url)+'" target="_blank" rel="noopener noreferrer">Ver ficha pública ↗</a>':"")
    +'</div></div>';
  document.body.appendChild(dialog);
  dialog.querySelector(".fa-success-ok").addEventListener("click",()=>dialog.close());
  dialog.addEventListener("close",()=>dialog.remove(),{once:true});
  dialog.showModal();
  dialog.querySelector(".fa-success-ok").focus();
}

function hideOldPage(){const page=document.querySelector(".hero h1,.admin-heading h1");if(page)page.textContent="Administración de vehículos";const lead=document.querySelector(".hero .intro,.admin-lead");if(lead)lead.textContent="Gestiona las fichas y fotografías; consulta debajo el estado de desarrollo.";}
function skin(){if(document.querySelector("link[data-frama-admin]"))return;const s=document.createElement("link");s.rel="stylesheet";s.href=BASE+"frama-admin-console.css?v=0.1.5";s.dataset.framaAdmin="";document.head.appendChild(s);}
function shell(content){root.innerHTML='<div class="fa-shell"><div class="fa-top"><div><p class="fa-kicker">FRAMA AUTO · CATÁLOGO</p><h2 id="vf-title">Panel de administración</h2></div>'+(role?'<span class="fa-role">'+h(role==="admin"?"Administrador":"Gestor")+'</span>':"")+'</div><div id="fa-msg" class="fa-msg" role="status" aria-live="polite"></div>'+content+'</div>';}
function login(){shell('<form id="fa-login" class="fa-card fa-login"><h3>Acceso autorizado</h3><p>Utiliza una cuenta de Supabase Auth autorizada para FRAMA AUTO. Las credenciales del panel de Supabase no tienen por qué ser las mismas.</p><label>Correo electrónico<input type="email" name="email" required autocomplete="username" placeholder="tu-correo@ejemplo.es"></label><label>Contraseña<input type="password" name="password" required autocomplete="current-password"></label><button class="fa-primary" type="submit">Entrar en administración</button></form>');
el("fa-login").onsubmit=async ev=>{ev.preventDefault();const f=ev.currentTarget,button=f.querySelector("button");button.disabled=true;msg("Comprobando acceso…");try{const r=await fetch(API+"/auth/v1/token?grant_type=password",{method:"POST",headers:{"apikey":KEY,"Content-Type":"application/json"},body:JSON.stringify({email:f.elements.email.value.trim(),password:f.elements.password.value})});const data=await responseJson(r);setToken(data);await enter();}catch(err){clearSession();msg("No se ha podido iniciar sesión: "+err.message,true);}finally{button.disabled=false;}};
}
async function enter(){try{user=await authUser();const list=await req("frama_staff?select=role,active&user_id=eq."+encodeURIComponent(user.id)+"&limit=1");role=list[0]&&list[0].active?list[0].role:null;if(!role){shell('<div class="fa-card">Esta cuenta no tiene permisos de FRAMA AUTO. <button id="fa-out" class="fa-secondary">Cerrar sesión</button></div>');el("fa-out").onclick=logout;return;}await showList();}catch(err){clearSession();login();msg("Inicia sesión de nuevo: "+err.message,true);}}
async function logout(){try{if(token)await fetch(API+"/auth/v1/logout",{method:"POST",headers:fetchHeaders(true)});}catch(_e){}clearSession();gallery.forEach(p=>{if(p.preview)URL.revokeObjectURL(p.preview);});gallery=[];login();}
async function showList(){editing=null;gallery.forEach(p=>{if(p.preview)URL.revokeObjectURL(p.preview);});gallery=[];try{vehicles=await req("frama_vehicles?select=id,slug,brand,model,trim,year,mileage,commercial_status,publication_status,is_demo&order=created_at.desc");}catch(err){shell('<div class="fa-card">No se ha podido consultar el catálogo. <button id="fa-out" class="fa-secondary">Cerrar sesión</button></div>');el("fa-out").onclick=logout;msg(err.message,true);return;}
shell('<div class="fa-toolbar"><button id="fa-new" class="fa-primary">+ Añadir nuevo vehículo</button><button id="fa-reload" class="fa-secondary">Actualizar listado</button><button id="fa-settings" class="fa-secondary">Redes y WhatsApp</button><button id="fa-out" class="fa-quiet">Cerrar sesión</button></div><div class="fa-card"><h3>Vehículos registrados ('+vehicles.length+')</h3><div class="fa-list">'+(vehicles.map(v=>'<article class="fa-item"><div><strong>'+h(v.brand+" "+v.model+" "+(v.trim||""))+'</strong><small>'+h(v.year||"Año pendiente")+' · '+h(v.mileage==null?"Kilometraje pendiente":Number(v.mileage).toLocaleString("es-ES")+" km")+' · '+h(v.is_demo?"DEMO":v.commercial_status.replace("_"," "))+' · '+h(v.publication_status==="published"?"Publicado":v.publication_status==="draft"?"Borrador":"Archivado")+'</small></div><button class="fa-secondary fa-edit" data-id="'+h(v.id)+'">Editar vehículo</button></article>').join("")||'<p>No hay vehículos.</p>')+'</div></div><p class="fa-note">Los cambios se guardan en Supabase. Los vehículos no demo que estén Publicados se muestran desde Supabase en el catálogo público. Borradores y archivados no se muestran.</p>');
el("fa-new").onclick=()=>editForm(null);el("fa-reload").onclick=showList;el("fa-settings").onclick=showContactSettings;el("fa-out").onclick=logout;root.querySelectorAll(".fa-edit").forEach(b=>b.onclick=()=>loadVehicle(b.dataset.id));
}

async function showContactSettings(){
  if(role!=="admin"){msg("Solo el administrador puede modificar estos ajustes.",true);return;}
  try {
    const rows=await req("frama_contact_settings?select=*&id=eq.1");
    const settings=rows[0];
    if(!settings)throw new Error("No se han encontrado los ajustes.");
    shell('<div class="fa-toolbar"><button class="fa-secondary" id="fa-settings-back">← Volver a vehículos</button><button class="fa-quiet" id="fa-out">Cerrar sesión</button></div>'
      +'<form id="fa-contact-settings" class="fa-card"><h3>Redes y WhatsApp sociales</h3><p>Estos ajustes se guardan en Supabase y se muestran automáticamente en la web pública. El envío automático requiere configurar RESEND_API_KEY y FRAMA_FROM_EMAIL en los secretos de Supabase.</p>'
      +'<label>WhatsApp internacional (ejemplo: +34600111222)<input type="tel" name="whatsapp" maxlength="16" placeholder="+34600111222" value="'+h(settings.whatsapp||"")+'"></label>'
      +'<label>Instagram (URL del perfil)<input type="url" name="instagram_url" maxlength="400" placeholder="https://www.instagram.com/usuario/" value="'+h(settings.instagram_url||"")+'"></label>'
      +'<label>Facebook (URL de la página)<input type="url" name="facebook_url" maxlength="400" placeholder="https://www.facebook.com/pagina/" value="'+h(settings.facebook_url||"")+'"></label>'
      +'<p class="fa-note">Instagram contiene provisionalmente el enlace a una publicación. Cámbialo por el perfil cuando lo tengas. WhatsApp y Facebook se ocultarán mientras estén vacíos.</p>'
      +'<button type="submit" class="fa-primary" id="fa-settings-save">Guardar contacto y redes</button></form>');
    el("fa-settings-back").onclick=showList;el("fa-out").onclick=logout;
    el("fa-contact-settings").onsubmit=async event=>{
      event.preventDefault();
      const form=event.currentTarget,submit=el("fa-settings-save");
      const whatsapp=form.elements.whatsapp.value.trim().replace(/[\s()-]/g,"");
      const instagram_url=form.elements.instagram_url.value.trim(),facebook_url=form.elements.facebook_url.value.trim();
      if(whatsapp&&!/^\+[1-9]\d{7,14}$/.test(whatsapp)){msg("El número de WhatsApp debe empezar por + y contener el prefijo de país.",true);return;}
      if(instagram_url&&!/^https:\/\/(www\.)?instagram\.com\//i.test(instagram_url)){msg("Utiliza una URL de Instagram válida.",true);return;}
      if(facebook_url&&!/^https:\/\/(www\.)?facebook\.com\//i.test(facebook_url)){msg("Utiliza una URL de Facebook válida.",true);return;}
      submit.disabled=true;msg("Guardando configuración…");
      try {
        await req("frama_contact_settings?id=eq.1","PATCH",{whatsapp,instagram_url,facebook_url,updated_at:new Date().toISOString()});
        msg("Configuración de contacto guardada. La web pública la cargará automáticamente.");
      }catch(error){msg("No se ha guardado: "+error.message,true);}
      finally{submit.disabled=false;}
    };
  }catch(error){msg("Error al cargar configuración: "+error.message,true);}
}

async function loadVehicle(id){msg("Cargando vehículo…");try{const rows=await req("frama_vehicles?select=*&id=eq."+encodeURIComponent(id)+"&limit=1");if(!rows[0])throw new Error("No se ha encontrado el vehículo.");const p=await req("frama_vehicle_photos?select=*&vehicle_id=eq."+encodeURIComponent(id)+"&order=slot.asc");gallery=p.map(o=>({...o,preview:null,file:null}));editForm(rows[0]);}catch(err){msg(err.message,true);}}
function newPhoto(src){return src?.storage_path?API+"/storage/v1/object/public/"+BUCKET+"/"+src.storage_path:(src?.src?BASE+src.src.replace(/^\//,""):"");}
function photoTypeSelect(p,i){const standard=TYPES.includes(p.label);const chosen=standard?p.label:"__otra";return '<label>Tipo de fotografía<select data-i="'+i+'" class="fa-photo-type">'+TYPES.map(s=>label(s,chosen)).join("")+'<option value="__otra"'+(chosen==="__otra"?" selected":"")+'>Otro (especificar)</option></select></label><label class="fa-other"'+(standard?' hidden':'')+'>Nombre personalizado<input data-i="'+i+'" class="fa-photo-other" maxlength="100" placeholder="Ej. Luces diurnas LED" value="'+h(standard?"":p.label)+'"></label>';}
function renderPhotos(){const target=el("fa-photos");if(!target)return;if(!gallery.length){target.innerHTML='<p class="fa-note">Sin fotografías. Añade la primera una a una.</p>';return;}target.innerHTML=gallery.map((p,i)=>'<article class="fa-photo"><div class="fa-preview">'+(p.preview||p.storage_path||p.src?'<img src="'+h(p.preview||newPhoto(p))+'" alt="Fotografía del vehículo">':'<span>Foto pendiente</span>')+'</div><div class="fa-photo-controls"><strong>Fotografía '+(i+1)+'</strong>'+photoTypeSelect(p,i)+'<label>Descripción (opcional)<input class="fa-detail" data-i="'+i+'" maxlength="160" placeholder="Ej. Llanta delantera derecha" value="'+h(p.detail||"")+'"></label><div class="fa-photo-actions"><label class="fa-cover"><input type="radio" name="fa-cover" data-i="'+i+'"'+(p.is_cover?" checked":"")+'> Portada</label><button class="fa-mini fa-up" type="button" data-i="'+i+'" '+(!i?"disabled":"")+'>↑</button><button class="fa-mini fa-down" type="button" data-i="'+i+'" '+(i===gallery.length-1?"disabled":"")+'>↓</button><button class="fa-mini fa-remove" type="button" data-i="'+i+'">Quitar</button></div></div></article>').join("");
 target.querySelectorAll(".fa-photo-type").forEach(s=>s.onchange=()=>{const i=+s.dataset.i;gallery[i].label=s.value==="__otra"?"":s.value;renderPhotos();});
 target.querySelectorAll(".fa-photo-other").forEach(x=>x.oninput=()=>{gallery[+x.dataset.i].label=x.value;});
 target.querySelectorAll(".fa-detail").forEach(x=>x.oninput=()=>{gallery[+x.dataset.i].detail=x.value;});
 target.querySelectorAll(".fa-cover input").forEach(x=>x.onchange=()=>{gallery.forEach((p,i)=>p.is_cover=i===+x.dataset.i);});
 target.querySelectorAll(".fa-remove").forEach(b=>b.onclick=()=>{const i=+b.dataset.i,p=gallery.splice(i,1)[0];if(p.preview)URL.revokeObjectURL(p.preview);if(gallery.length&&!gallery.some(x=>x.is_cover))gallery[0].is_cover=true;renderPhotos();});
 target.querySelectorAll(".fa-up,.fa-down").forEach(b=>b.onclick=()=>{const i=+b.dataset.i,j=i+(b.classList.contains("fa-up")?-1:1);[gallery[i],gallery[j]]=[gallery[j],gallery[i]];renderPhotos();});
}
function editForm(v){editing=v;const demo=!!v?.is_demo;
shell('<div class="fa-toolbar"><button id="fa-back" class="fa-secondary">← Volver al listado</button><button id="fa-out" class="fa-quiet">Cerrar sesión</button></div><form id="fa-vehicle-form" class="fa-card"><h3>'+(v?"Editar vehículo":"Añadir nuevo vehículo")+'</h3><p class="fa-note">Los ejemplos en gris son placeholders, no datos guardados.</p><div class="fa-form-grid">'+
field("brand","Marca",v?.brand,"Ej. BMW",true)+field("model","Modelo",v?.model,"Ej. Serie 3 320d",true)+field("trim","Versión o acabado",v?.trim,"Ej. M Sport")+
field("year","Año",v?.year,"Ej. 2022")+field("mileage","Kilometraje",v?.mileage,"Ej. 32.000 kilómetros")+field("price_eur","Precio (€)",v?.price_eur,"Ej. 28.900 €")+
field("power_cv","Potencia (CV)",v?.power_cv,"Ej. 190 CV")+field("fuel","Combustible",v?.fuel,"Ej. Gasolina")+field("transmission","Cambio",v?.transmission,"Ej. Manual")+
field("body","Carrocería",v?.body,"Ej. Compacto")+field("color","Color",v?.color,"Ej. Rojo Tornado")+field("doors","Puertas",v?.doors,"Ej. 3")+field("seats","Plazas",v?.seats,"Ej. 5")+field("eco_label","Etiqueta ambiental",v?.eco_label,"Ej. C")+field("origin","Procedencia",v?.origin,"Ej. Alemania")+
combo("commercial_status","Estado comercial",demo?[["demostracion","Demostración (sin venta)"]]:STATUSES,demo?"demostracion":v?.commercial_status||"disponible")+
combo("publication_status","Publicación",[["draft","Borrador"],["published","Publicado"],["archived","Archivado"]],v?.publication_status||"draft")+
'<label class="fa-wide">Descripción<textarea name="description" rows="4" placeholder="Descripción del vehículo">'+h(v?.description||"")+'</textarea></label>'+
'<label class="fa-wide">Equipamiento (una línea por elemento)<textarea name="equipment" rows="5" placeholder="Climatizador bizona&#10;Sensores de aparcamiento">'+h(Array.isArray(v?.equipment)?v.equipment.join("\n"):Object.entries(v?.equipment||{}).flatMap(([k,arr])=>(Array.isArray(arr)?arr:[]).map(x=>x)).join("\n"))+'</textarea></label>'+
'</div><h3>Fotografías</h3><p class="fa-note">Una por una, indicando la parte del coche. Se admite JPG, PNG o WebP de hasta 12 MB cada una.</p><div id="fa-photos" class="fa-photos"></div><div class="fa-addphoto"><label>Tipo de la nueva foto<select id="fa-new-type">'+TYPES.map(s=>label(s,"Frontal")).join("")+'<option value="__otra">Otro (especificar)</option></select></label><label id="fa-custom-wrap" hidden>Otra vista<input id="fa-new-custom" maxlength="100" placeholder="Ej. Techo panorámico"></label><label>Descripción<input id="fa-new-detail" maxlength="160" placeholder="Ej. Faro derecho"></label><label>Archivo<input id="fa-new-file" type="file" accept="image/jpeg,image/png,image/webp"></label><button id="fa-addphoto-btn" type="button" class="fa-secondary">+ Añadir fotografía</button></div><div class="fa-toolbar fa-savebar"><button id="fa-save" class="fa-primary" type="submit">'+(v?"Guardar cambios":"Guardar vehículo")+'</button><button id="fa-cancel" class="fa-quiet" type="button">Cancelar</button></div></form>');
el("fa-back").onclick=showList;el("fa-cancel").onclick=showList;el("fa-out").onclick=logout;
el("fa-new-type").onchange=()=>{el("fa-custom-wrap").hidden=el("fa-new-type").value!=="__otra";};
el("fa-addphoto-btn").onclick=()=>{if(gallery.length>=30){msg("Máximo 30 imágenes.",true);return;}const f=el("fa-new-file").files[0];if(!f){msg("Selecciona una imagen primero.",true);return;}if(!["image/jpeg","image/png","image/webp"].includes(f.type)||f.size>12*1024*1024){msg("La imagen debe ser JPG, PNG o WebP y ocupar menos de 12 MB.",true);return;}const typ=el("fa-new-type").value;const name=(typ==="__otra"?el("fa-new-custom").value:typ).trim();if(!name){msg("Indica qué muestra la foto.",true);return;}gallery.push({file:f,preview:URL.createObjectURL(f),label:name,detail:el("fa-new-detail").value.trim(),is_cover:!gallery.length,src:null,storage_path:null,legacy_atlas_slot:null});el("fa-new-file").value="";el("fa-new-detail").value="";el("fa-new-custom").value="";el("fa-new-type").value="Frontal";el("fa-custom-wrap").hidden=true;renderPhotos();msg("Fotografía añadida a la ficha. Se subirá cuando pulses Guardar.");};
el("fa-vehicle-form").onsubmit=saveVehicle;
renderPhotos();
}
function payload(form){const fd=new FormData(form);const get=k=>String(fd.get(k)||"").trim();const equipment=get("equipment").split(/\r?\n/).map(s=>s.trim()).filter(Boolean);return {brand:get("brand"),model:get("model"),trim:get("trim")||null,year:int(get("year")),mileage:int(get("mileage")),price_eur:int(get("price_eur")),power_cv:int(get("power_cv")),fuel:get("fuel")||null,transmission:get("transmission")||null,body:get("body")||null,color:get("color")||null,doors:int(get("doors")),seats:int(get("seats")),eco_label:get("eco_label")||null,origin:get("origin")||null,description:get("description")||null,equipment:{General:equipment},commercial_status:editing?.is_demo?"demostracion":get("commercial_status"),publication_status:editing?.is_demo?"draft":get("publication_status"),is_demo:!!editing?.is_demo};}
function slugify(s){return s.normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/^-+|-+$/g,"").slice(0,75);}
async function upload(file,id){if(!token)throw new Error("Sesión no disponible");if(token.expires_at<Date.now()/1000+45)await refresh();const ext=file.type==="image/png"?"png":file.type==="image/webp"?"webp":"jpg";const path=id+"/"+crypto.randomUUID()+"."+ext;const res=await fetch(API+"/storage/v1/object/"+BUCKET+"/"+path,{method:"POST",headers:{...fetchHeaders(true),"Content-Type":file.type,"x-upsert":"false"},body:file});await responseJson(res);return path;}
async function saveVehicle(event){event.preventDefault();if(saving)return;const wasEditing=Boolean(editing);const form=event.currentTarget;const data=payload(form);if(!data.brand||!data.model){msg("Marca y modelo son obligatorios.",true);return;}if(data.year!==null&&(data.year<1886||data.year>2100)){msg("Revisa el año.",true);return;}if(gallery.some(p=>!p.label?.trim())){msg("Todas las fotos deben tener un tipo.",true);return;}if(gallery.length&&!gallery.some(p=>p.is_cover))gallery[0].is_cover=true;saving=true;el("fa-save").disabled=true;msg("Guardando ficha…");let vehicle=null;try{if(editing){const rows=await req("frama_vehicles?id=eq."+encodeURIComponent(editing.id)+"&version=eq."+editing.version,"PATCH",data);if(!rows.length)throw new Error("La ficha cambió en otra sesión. Recarga el vehículo antes de guardar.");vehicle=rows[0];}else{data.slug=slugify(data.brand+"-"+data.model)+"-"+Date.now().toString(36);const rows=await req("frama_vehicles","POST",data);vehicle=rows[0];}if(!vehicle)throw new Error("El servidor no devolvió el vehículo.");for(const p of gallery){if(p.file&&!p.storage_path){msg("Subiendo fotografías…");p.storage_path=await upload(p.file,vehicle.id);p.file=null;}}msg("Guardando galería…");const packed=gallery.map(p=>({label:p.label.trim(),detail:p.detail||"",src:p.src||null,storage_path:p.storage_path||null,legacy_atlas_slot:p.legacy_atlas_slot??null,is_cover:!!p.is_cover}));await req("rpc/frama_replace_vehicle_photos","POST",{p_vehicle_id:vehicle.id,p_photos:packed});saved=true;try{localStorage.setItem("frama-public-catalog-changed",String(Date.now()));}catch(_e){}await showList();msg("Vehículo guardado correctamente en Supabase.");showSaveSuccess(vehicle,wasEditing);}catch(err){msg("No se ha completado el guardado: "+err.message+". Si se guardó la ficha, revisa su galería antes de repetir.",true);if(vehicle)editing=vehicle;}finally{saving=false;const button=el("fa-save");if(button)button.disabled=false;}}
async function start(){root=document.getElementById("frama-vehicle-editor");if(!root||root.dataset.framaConsole)return;root.dataset.framaConsole="true";skin();hideOldPage();try{token=JSON.parse(sessionStorage.getItem(CACHE_KEY)||"null");if(!token?.access_token||!token?.refresh_token)token=null;}catch(_){token=null;}if(!token)login();else await enter();}
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",start,{once:true});else start();
})();