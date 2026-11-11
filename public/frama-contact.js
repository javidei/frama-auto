/* FRAMA AUTO: canales sociales e información, sin envío de formularios. */
(()=>{
"use strict";
if(window.__FRAMA_CONTACT_STARTED)return;
window.__FRAMA_CONTACT_STARTED=true;
const API="https://avboupigkstzprrgvlhr.supabase.co";
const KEY="sb_publishable_eyFLhKFk9HXAab4q1cxG4A_-_la1-OI";
const settingsUrl=API+"/rest/v1/frama_contact_settings?id=eq.1&select=whatsapp,instagram_url,facebook_url";
let config={whatsapp:"",instagram_url:"",facebook_url:""};
const esc=s=>String(s||"").replace(/[&<>"']/g,ch=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[ch]));
function style(){
 if(document.getElementById("frama-contact-style"))return;
 const el=document.createElement("style");el.id="frama-contact-style";
 el.textContent="#contacto .frama-contact-unavailable{width:100%;max-width:580px;padding:clamp(24px,4vw,42px);border:1px solid #796344;border-radius:6px;background:linear-gradient(135deg,#252421,#181b1e);box-shadow:0 14px 40px #0003;color:#e8e5e0}#contacto .frama-contact-unavailable-label{font-size:10px;letter-spacing:2px;color:#ddbf81;font-weight:700}#contacto .frama-contact-unavailable h3{font:400 clamp(25px,3vw,34px)/1.2 Georgia,serif;margin:15px 0;color:#f3eee4}#contacto .frama-contact-unavailable p{font-size:14px;line-height:1.7;color:#c9c5bd;margin:12px 0 0}#contacto .frama-contact-unavailable p:last-child{font-size:12px;color:#adaba5}.frama-social-links{display:flex;align-items:center;flex-wrap:wrap;gap:16px;font-size:11px}.frama-social-links a{color:#dfbf7a}.frama-social-links a:hover{text-decoration:underline}";
 document.head.appendChild(el);
}
function updateFooter(){
 const footer=document.querySelector(".footer-bottom");if(!footer)return;
 let links=document.getElementById("frama-social-links");
 if(!links){links=document.createElement("nav");links.id="frama-social-links";links.className="frama-social-links";links.setAttribute("aria-label","Redes sociales");footer.appendChild(links);}
 const pairs=[["Instagram",config.instagram_url],["Facebook",config.facebook_url]];
 const html=pairs.filter(pair=>/^https:\/\/(?:www\.)?(instagram|facebook)\.com\//i.test(pair[1])).map(pair=>'<a href="'+esc(pair[1])+'" target="_blank" rel="noopener noreferrer">'+pair[0]+'</a>').join("");
 if(links.innerHTML!==html)links.innerHTML=html;
}
function updateWhatsApp(){
 const a=document.getElementById("frama-whatsapp");if(!a)return;
 const digits=(config.whatsapp||"").replace(/[^0-9]/g,"");
 if(digits.length>=8&&digits.length<=15){
 a.style.display="inline-flex";a.href="https://wa.me/"+digits+"?text="+encodeURIComponent("Hola, he visto FRAMA AUTO y quiero información sobre un vehículo.");
 a.title="Contactar con FRAMA AUTO por WhatsApp";a.setAttribute("aria-label","Contactar con FRAMA AUTO por WhatsApp");
 }else{a.style.display="none";a.removeAttribute("href");}
}
function replaceForm(){
 const section=document.getElementById("contacto");if(!section)return;
 const form=section.querySelector("form");if(form){const div=document.createElement("div");div.innerHTML="<div class=\"frama-contact-unavailable\" role=\"note\" aria-label=\"Formulario de contacto no disponible\"><span class=\"frama-contact-unavailable-label\">INFORMACIÓN</span><h3>Consultas desde la web</h3><p>El formulario de consultas y el envío de correos no se implementarán en esta web.</p><p>Para contactar con FRAMA AUTO, utiliza los canales oficiales que se publiquen en la página.</p></div>";form.replaceWith(div.firstElementChild);}
 const demo=section.querySelector(".demo-pill");if(demo)demo.remove();
 const intro=section.querySelector(".contact-layout>div:first-child >p:not(.eyebrow)");
 if(intro&&intro.textContent!=="Información sobre nuestros canales de contacto y atención.")intro.textContent="Información sobre nuestros canales de contacto y atención.";
}
function sync(){style();replaceForm();updateFooter();updateWhatsApp();}
async function load(){try{const res=await fetch(settingsUrl,{headers:{apikey:KEY},cache:"no-store"});if(res.ok){const rows=await res.json();if(rows&&rows[0])config=rows[0];}}catch(e){console.warn("FRAMA AUTO canales:",e);}sync();}
let busy=false;const obs=new MutationObserver(()=>{if(busy)return;busy=true;try{sync();}finally{busy=false;}});
function start(){sync();load();obs.observe(document.body,{childList:true,subtree:true});setTimeout(()=>obs.disconnect(),25000);}
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",start,{once:true});else start();
document.addEventListener("visibilitychange",()=>{if(!document.hidden)load();});
})();
