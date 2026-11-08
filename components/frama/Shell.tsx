"use client";
import { useEffect, useState } from "react";
import { Icon } from "./Icon";
export function Logo() {
  return <a className="brand" href="/" aria-label="FRAMA AUTO, inicio"><span className="brand-crop"><img src="/images/logo-original.png" width="1536" height="1536" alt="FRAMA AUTO" /></span><span className="brand-tagline">IMPORTACIÓN Y VENTA DE VEHÍCULOS</span></a>;
}
export function Header() {
  const [open, setOpen] = useState(false);
  return <header className="header"><div className="container header-inner"><Logo /><button className="icon-button menu-button" aria-expanded={open} aria-controls="main-nav" aria-label={open ? "Cerrar menú" : "Abrir menú"} onClick={() => setOpen(!open)}><Icon name={open ? "close" : "menu"} /></button><nav id="main-nav" className={open ? "navigation open" : "navigation"} aria-label="Navegación principal" onKeyDown={e => { if (e.key === "Escape") setOpen(false); }}><a href="/#inicio" onClick={() => setOpen(false)}>Inicio</a><a href="/#catalogo" onClick={() => setOpen(false)}>Catálogo</a><a href="/#importacion" onClick={() => setOpen(false)}>Importación</a><a href="/#nosotros" onClick={() => setOpen(false)}>Nosotros</a><a className="nav-contact" href="/#contacto" onClick={() => setOpen(false)}>Hablemos <Icon name="arrow" size={16} /></a></nav></div></header>;
}

type ContactSettings={whatsapp:string;instagram_url:string;facebook_url:string};
function useContactSettings(){
 const [settings,setSettings]=useState<ContactSettings>({whatsapp:"",instagram_url:"",facebook_url:""});
 useEffect(()=>{
   const ctrl=new AbortController();
   fetch("https://avboupigkstzprrgvlhr.supabase.co/rest/v1/frama_contact_settings?id=eq.1&select=whatsapp,instagram_url,facebook_url",{
     headers:{apikey:"sb_publishable_eyFLhKFk9HXAab4q1cxG4A_-_la1-OI"},signal:ctrl.signal,cache:"no-store"
   }).then(r=>r.ok?r.json():[]).then(rows=>{if(rows?.[0])setSettings(rows[0]);}).catch(()=>{});
   return ()=>ctrl.abort();
 },[]);
 return settings;
}
export function Footer() {
 const contact=useContactSettings();
 return <footer className="footer"><div className="container footer-top"><Logo /><p>Una nueva forma de encontrar<br />tu próximo vehículo.</p><a href="/#catalogo">Explorar el catálogo <Icon name="arrow" size={18} /></a></div><div className="container footer-bottom"><span>© {new Date().getFullYear()} FRAMA AUTO · v0.1.7</span><nav className="footer-links" aria-label="Enlaces del pie de página"><a className="footer-admin-link" href="/administracion">Administración</a><a href="/informacion">Información y privacidad</a></nav><nav className="frama-social-links" id="frama-social-links" aria-label="Redes sociales">{contact.instagram_url&&<a href={contact.instagram_url} target="_blank" rel="noopener noreferrer">Instagram</a>}{contact.facebook_url&&<a href={contact.facebook_url} target="_blank" rel="noopener noreferrer">Facebook</a>}</nav></div></footer>;
}
export function WhatsappFloating() {
 const contact=useContactSettings();
 const phone=contact.whatsapp.replace(/[^0-9]/g,"");
 if(phone.length<8||phone.length>15)return null;
 const message=encodeURIComponent("Hola, he visto FRAMA AUTO y quiero información sobre un vehículo.");
 return <a id="frama-whatsapp" className="whatsapp-fab" href={`https://wa.me/${phone}?text=${message}`} target="_blank" rel="noopener noreferrer" aria-label="Contactar con FRAMA AUTO por WhatsApp"><svg viewBox="0 0 32 32" width="36" height="36" fill="currentColor" aria-hidden="true"><path d="M16 3.3a12.6 12.6 0 0 0-10.87 19L3.4 28.6l6.45-1.7A12.65 12.65 0 1 0 16 3.3Zm0 22.45c-1.77 0-3.5-.48-5.01-1.4l-.36-.21-3.82 1 .99-3.72-.24-.38A9.7 9.7 0 1 1 16 25.75Zm5.43-7.27c-.3-.16-1.77-.88-2.05-.98-.27-.1-.48.15-.68.15s-.77.98-.94 1.17c-.17.2-.35.23-.65.08-.3-.15-1.27-.47-2.42-1.49-.9-.8-1.5-1.77-1.67-2.08-.18-.3-.02-.46.13-.61.14-.14.3-.35.45-.53.15-.17.2-.29.3-.49.1-.2.05-.38-.03-.53-.07-.15-.68-1.64-.94-2.24-.24-.59-.49-.51-.68-.52h-.58c-.2 0-.53.08-.8.38-.28.3-1.05 1.03-1.05 2.5 0 1.48 1.08 2.91 1.23 3.11.15.2 2.12 3.24 5.14 4.54.72.31 1.28.49 1.72.63.73.23 1.38.2 1.9.12.58-.09 1.79-.73 2.04-1.43.25-.7.25-1.3.17-1.43-.08-.13-.28-.2-.59-.35Z"/></svg></a>;
}
