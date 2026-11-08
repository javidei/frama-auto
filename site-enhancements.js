/* FRAMA AUTO v0.1.0 · compatibilidad con export estático de GitHub Pages.
   El número WhatsApp es ficticio (rango 555 reservado para ejemplos).
   No hay login, escrituras administrativas ni conexión a base de datos. */
(() => {
  "use strict";
  const VERSION = "0.1.0";
  const TEST_PHONE = "12025550148";
  const base = location.pathname === "/frama-auto" || location.pathname.startsWith("/frama-auto/") ? "/frama-auto" : "";
  const message = encodeURIComponent("Hola, he visto FRAMA AUTO y quiero información sobre un vehículo.");

  function enhance() {
    const footer = document.querySelector(".footer-bottom");
    if (footer) {
      const copyright = footer.querySelector("span");
      if (copyright && !copyright.textContent.includes("v" + VERSION)) {
        copyright.textContent = "© " + new Date().getFullYear() + " FRAMA AUTO · v" + VERSION;
      }
      if (!footer.querySelector(".footer-admin-link")) {
        const anchor = document.createElement("a");
        anchor.className = "footer-admin-link";
        anchor.href = base + "/administracion/";
        anchor.textContent = "Administración";
        anchor.style.color = "#dfbf7a";
        anchor.style.fontSize = "11px";
        anchor.style.textDecoration = "none";
        footer.appendChild(anchor);
      }
    }
    if (!document.getElementById("frama-whatsapp")) {
      if (!document.getElementById("frama-whatsapp-style")) {
        const style = document.createElement("style");
        style.id = "frama-whatsapp-style";
        style.textContent = ".whatsapp-fab{position:fixed;right:23px;bottom:22px;z-index:80;display:inline-flex;align-items:center;gap:11px;background:#12271e;color:#f7fff9!important;border:1px solid #4bb98a;border-radius:100px;padding:12px 16px;min-height:54px;box-shadow:0 8px 26px #0009;text-decoration:none!important;font:700 12px Arial,sans-serif;transition:transform .2s ease,background .2s ease}.whatsapp-fab:hover{background:#194433;transform:translateY(-3px)}.whatsapp-fab span{line-height:1.4}.whatsapp-fab small{display:block;font-size:9px;color:#c6e2d2;letter-spacing:1px;margin-top:2px}@media(max-width:760px){.whatsapp-fab{bottom:14px;right:14px;padding:11px}}@media(prefers-reduced-motion:reduce){.whatsapp-fab{transition:none}}";
        document.head.appendChild(style);
      }
      const anchor = document.createElement("a");
      anchor.id = "frama-whatsapp";
      anchor.className = "whatsapp-fab";
      anchor.href = "https://wa.me/" + TEST_PHONE + "?text=" + message;
      anchor.target = "_blank";
      anchor.rel = "noopener noreferrer";
      anchor.title = "Número de prueba. Sustituir por el teléfono real antes de usarlo con clientes";
      anchor.setAttribute("aria-label", "WhatsApp de prueba: número ficticio, no se reciben mensajes");
      anchor.innerHTML = '<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20.5 11.7a8.5 8.5 0 0 1-12.5 7.4L3.5 20.5l1.4-4.5a8.5 8.5 0 1 1 15.6-4.3Z"/><path d="M9 8.4c.5 2.7 2.3 4.6 5.1 5.6l1.7-1.2 1.2.9-.8 1.6c-.6.9-2 1.1-3 .8-3.1-1-5.7-3.3-6.4-6.2-.3-1 .2-2.2 1-2.7l1.2 1.2Z"/></svg><span>WhatsApp<small>PRUEBA</small></span>';
      document.body.appendChild(anchor);
    }
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", enhance, { once: true });
  else enhance();
  // El export actual conserva bundles anteriores; re-aplicar tras la hidratación.
  const observer = new MutationObserver(() => enhance());
  observer.observe(document.documentElement, { childList: true, subtree: true });
  setTimeout(() => { enhance(); observer.disconnect(); }, 12000);
})();
