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
  return <footer className="footer"><div className="container footer-top"><Logo /><p>Una nueva forma de encontrar<br />tu próximo vehículo.</p><a href="/#catalogo">Explorar el catálogo <Icon name="arrow" size={18} /></a></div><div className="container footer-bottom"><span>© {new Date().getFullYear()} FRAMA AUTO · Web de demostración</span><a href="/informacion">Información de la demo y privacidad</a></div></footer>;
}
