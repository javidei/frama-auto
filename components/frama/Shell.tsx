"use client";
import { useState } from "react";
import { Icon } from "./Icon";
export function Logo() {
  return <a className="brand" href="/" aria-label="FRAMA AUTO, inicio"><span className="brand-crop"><img src="/images/logo-original.png" width="1536" height="1536" alt="FRAMA AUTO" /></span><span className="brand-tagline">IMPORTACIÓN Y VENTA DE VEHÍCULOS</span></a>;
}
export function Header() {
  const [open, setOpen] = useState(false);
  return <header className="header"><div className="container header-inner"><Logo /><button className="icon-button menu-button" aria-expanded={open} aria-controls="main-nav" aria-label={open ? "Cerrar menú" : "Abrir menú"} onClick={() => setOpen(!open)}><Icon name={open ? "close" : "menu"} /></button><nav id="main-nav" className={open ? "navigation open" : "navigation"} aria-label="Navegación principal" onKeyDown={e => { if (e.key === "Escape") setOpen(false); }}><a href="/#inicio" onClick={() => setOpen(false)}>Inicio</a><a href="/#catalogo" onClick={() => setOpen(false)}>Catálogo</a><a href="/#importacion" onClick={() => setOpen(false)}>Importación</a><a href="/#nosotros" onClick={() => setOpen(false)}>Nosotros</a><a className="nav-contact" href="/#contacto" onClick={() => setOpen(false)}>Hablemos <Icon name="arrow" size={16} /></a></nav></div></header>;
}
export function Footer() {
  return <footer className="footer"><div className="container footer-top"><Logo /><p>Una nueva forma de encontrar<br />tu próximo vehículo.</p><a href="/#catalogo">Explorar el catálogo <Icon name="arrow" size={18} /></a></div><div className="container footer-bottom"><span>© {new Date().getFullYear()} FRAMA AUTO · v0.1.0</span><nav className="footer-links" aria-label="Enlaces del pie de página"><a className="footer-admin-link" href="/administracion">Administración</a><a href="/informacion">Información de la demo y privacidad</a></nav></div></footer>;
}

/** Número ficticio reservado para ejemplos. Sustituir por el teléfono real antes de publicar. */
const WHATSAPP_TEST_NUMBER = "12025550148";
export function WhatsappFloating() {
  const message = encodeURIComponent("Hola, he visto FRAMA AUTO y quiero información sobre un vehículo.");
  return <a id="frama-whatsapp" className="whatsapp-fab" href={`https://wa.me/${WHATSAPP_TEST_NUMBER}?text=${message}`} target="_blank" rel="noopener noreferrer" aria-label="WhatsApp de prueba: número ficticio, no se reciben mensajes" title="Número de prueba. Sustituir por el teléfono real antes de usarlo con clientes"><svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M20.5 11.7a8.5 8.5 0 0 1-12.5 7.4L3.5 20.5l1.4-4.5a8.5 8.5 0 1 1 15.6-4.3Z"/><path d="M9 8.4c.5 2.7 2.3 4.6 5.1 5.6l1.7-1.2 1.2.9-.8 1.6c-.6.9-2 1.1-3 .8-3.1-1-5.7-3.3-6.4-6.2-.3-1 .2-2.2 1-2.7l1.2 1.2Z"/></svg><span>WhatsApp <small>PRUEBA</small></span></a>;
}
