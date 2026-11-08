/* FRAMA AUTO: formulario y datos de contacto sincronizados con Supabase. */
(()=>{
"use strict";
if(window.__FRAMA_CONTACT_STARTED)return;
window.__FRAMA_CONTACT_STARTED=true;
const API="https://avboupigkstzprrgvlhr.supabase.co";
const KEY="sb_publishable_eyFLhKFk9HXAab4q1cxG4A_-_la1-OI";
const settingsUrl=API+"/rest/v1/frama_contact_settings?id=eq.1&select=email,whatsapp,instagram_url,facebook_url";
const contactEndpoint=API+"/functions/v1/frama-contact";
const base=location.pathname.startsWith("/frama-auto")?"/frama-auto":"";
let config={email:"",whatsapp:"",instagram_url:"",facebook_url:""};
const esc=s=>String(s||"").replace(/[&<>"']/g,ch=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[ch]));
function stylesheet(){
 if(document.getElementById("frama-contact-style"))return;
 const style=document.createElement("style");
 style.id="frama-contact-style";
 style.textContent=".frama-contact-fields{display:grid;grid-template-columns:1fr 1fr;gap:12px}.frama-contact-fields label{min-width:0}.frama-contact-form label{display:block;margin-bottom:14px}.frama-contact-form .consent{display:flex;align-items:flex-start;gap:10px;font-size:11px;color:#bcbfc4}.frama-contact-form .consent input{width:18px;min-height:18px;margin:2px 0 0;flex:none}.frama-contact-form .consent a{color:#e0be76;text-decoration:underline}.frama-contact-result{padding:12px;margin:15px 0 0;background:#191d20;border:1px solid #655336;font-size:12px;color:#e4d4b4}.frama-contact-result[data-error=true]{border-color:#b05e5e;color:#f3c1c1}.frama-social-links{display:flex;align-items:center;flex-wrap:wrap;gap:16px;font-size:11px}.frama-social-links a{color:#dfbf7a}.frama-social-links a:hover{text-decoration:underline}@media(max-width:600px){.frama-contact-fields{grid-template-columns:1fr}}";
 document.head.appendChild(style);
}
function updateFooter(){
 const footer=document.querySelector(".footer-bottom");
 if(!footer)return;
 let links=document.getElementById("frama-social-links");
 if(!links){links=document.createElement("nav");links.id="frama-social-links";links.className="frama-social-links";links.setAttribute("aria-label","Redes sociales");footer.appendChild(links);}
 const pairs=[["Instagram",config.instagram_url],["Facebook",config.facebook_url]];
 const html=pairs.filter(pair=>/^https:\/\/(?:www\.)?(instagram|facebook)\.com\//i.test(pair[1])).map(pair=>'<a href="'+esc(pair[1])+'" target="_blank" rel="noopener noreferrer">'+pair[0]+'</a>').join("");
 if(links.innerHTML!==html)links.innerHTML=html;
}
function updateWhatsApp(){
 let a=document.getElementById("frama-whatsapp");
 if(!a)return;
 const digits=config.whatsapp.replace(/[^0-9]/g,"");
 if(digits.length>=8&&digits.length<=15){
   a.style.display="inline-flex";
   a.href="https://wa.me/"+digits+"?text="+encodeURIComponent("Hola, he visto FRAMA AUTO y quiero información sobre un vehículo.");
   a.title="Contactar con FRAMA AUTO por WhatsApp";
   a.setAttribute("aria-label","Contactar con FRAMA AUTO por WhatsApp");
 }else{a.style.display="none";a.removeAttribute("href");}
}
let lastVehicles=[];
async function refreshVehicleOptions(){
  const select=document.querySelector("#contacto form.frama-contact-form select[name=interest]");
  if(!select)return;
  try{
    const url=API+"/rest/v1/frama_vehicles?select=slug,brand,model,trim,commercial_status&publication_status=eq.published&is_demo=eq.false&order=created_at.desc";
    const res=await fetch(url,{headers:{apikey:KEY,Accept:"application/json"},cache:"no-store"});
    if(!res.ok)throw new Error("No se pudieron cargar los coches publicados.");
    const cars=await res.json();
    if(!Array.isArray(cars))return;
    lastVehicles=cars;
    const existing=[...select.options].filter(o=>o.value&&o.textContent.trim().toLocaleLowerCase("es")!=="una importación a medida").map(o=>({value:o.value,label:o.textContent.replace(/\s*[·-]\s*ejemplo\s*$/i,"").trim()}));
    const items=new Map(existing.map(item=>[item.label.toLocaleLowerCase("es"),item]));
    for(const car of cars){
      const name=[car.brand,car.model,car.trim].filter(Boolean).join(" ").trim();
      if(!name)continue;
      const key=name.toLocaleLowerCase("es");
      const tag=car.commercial_status==="en_importacion"?" (En importación)":"";
      items.set(key,{value:name+tag,label:name+tag});
    }
    const selected=select.value;
    select.replaceChildren(new Option("Una importación a medida",""),...[...items.values()].filter(item=>item.label.trim().toLocaleLowerCase("es")!=="una importación a medida").map(item=>new Option(item.label,item.value)));
    select.value=[...select.options].some(o=>o.value===selected)?selected:"";
  }catch(error){console.warn("FRAMA AUTO vehículos de contacto:",error);}
}

function setupForm(){
 const section=document.getElementById("contacto");
 if(!section)return;
 const original=section.querySelector("form");
 if(!original||original.dataset.framaContact==="true")return;
 const options=[...original.querySelectorAll("select option")].map(x=>({value:x.value,label:x.textContent||""}));
 const menu=[{value:"",label:"Una importación a medida"},...options.filter(x=>x.value&&x.label.trim().toLocaleLowerCase("es")!=="una importación a medida").map(x=>({value:x.value,label:x.label.replace(/\s*[·-]\s*ejemplo\s*$/i,"").trim()}))];
 const form=document.createElement("form");
 form.className="frama-contact-form";
 form.dataset.framaContact="true";
 form.innerHTML='<div class="frama-contact-fields"><label><span>Tu nombre *</span><input required name="name" maxlength="100" autocomplete="name" placeholder="Tu nombre"></label><label><span>Tu correo electrónico *</span><input type="email" required name="email" maxlength="180" autocomplete="email" placeholder="nombre@correo.es"></label></div>'
 +'<label><span>Me interesa</span><select name="interest">'+menu.map(x=>'<option value="'+esc(x.label)+'">'+esc(x.label)+'</option>').join("")+'</select></label>'
 +'<label><span>¿Qué tienes en mente? *</span><textarea required minlength="10" maxlength="1200" rows="4" name="message" placeholder="Cuéntanos qué coche buscas…"></textarea></label>'
 +'<label class="consent"><input type="checkbox" required name="consent"><span>Acepto que FRAMA AUTO utilice mis datos para responder a esta consulta. <a href="'+base+'/informacion/">Información y privacidad</a>.</span></label>'
 +'<label style="position:absolute;left:-10000px" aria-hidden="true">Sitio web<input name="website" tabindex="-1" autocomplete="off"></label>'
 +'<button type="submit" class="button gold">Enviar consulta</button><p class="frama-contact-result" role="status" aria-live="polite" hidden></p>';
 original.replaceWith(form);
 refreshVehicleOptions();
 const demo=section.querySelector(".demo-pill");if(demo)demo.remove();
 const intro=section.querySelector(".contact-layout>div:first-child >p:not(.eyebrow)");
 if(intro)intro.textContent="Cuéntanos qué coche buscas y te responderemos por correo electrónico.";
 form.addEventListener("submit",async event=>{
   event.preventDefault();
   const button=form.querySelector('button[type="submit"]'),result=form.querySelector(".frama-contact-result");
   const payload=Object.fromEntries(new FormData(form));
   if(!form.reportValidity())return;
   button.disabled=true;result.hidden=false;result.dataset.error="false";result.textContent="Enviando consulta…";
   try{
     const res=await fetch(contactEndpoint,{method:"POST",headers:{"Content-Type":"application/json","apikey":KEY},body:JSON.stringify({name:payload.name,email:payload.email,interest:payload.interest,message:payload.message,website:payload.website})});
     let data={};try{data=await res.json();}catch(_e){}
     if(!res.ok||!data.ok)throw new Error(data.error||"No se ha podido enviar el mensaje.");
     result.textContent="Consulta enviada correctamente. Te responderemos lo antes posible.";
     form.reset();
   }catch(error){
     result.dataset.error="true";
     result.textContent=error.message||"Error al enviar. Vuelve a intentarlo.";
   }finally{button.disabled=false;}
 });
}
function sync(){stylesheet();updateFooter();updateWhatsApp();setupForm();}
async function load(){
 try{
   const res=await fetch(settingsUrl,{headers:{"apikey":KEY},cache:"no-store"});
   if(!res.ok)throw Error("No se pueden cargar los datos de contacto.");
   const rows=await res.json();if(rows&&rows[0])config=rows[0];
 }catch(error){console.warn("FRAMA AUTO contacto:",error);}
 sync();
}
let busy=false;
const obs=new MutationObserver(()=>{if(busy)return;busy=true;try{sync();}finally{busy=false;}});
function start(){load();obs.observe(document.body,{childList:true,subtree:true});setTimeout(()=>obs.disconnect(),20000);}
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",start,{once:true});else start();
document.addEventListener("visibilitychange",()=>{if(!document.hidden){load();refreshVehicleOptions();}});
})();
