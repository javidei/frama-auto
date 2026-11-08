/* FRAMA AUTO v0.1.1 · compatibilidad con export estático de GitHub Pages.
   El número WhatsApp es ficticio (rango 555 reservado para ejemplos).
   No hay login, escrituras administrativas ni conexión a base de datos. */
(() => {
  "use strict";
  const VERSION = "0.1.1";
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
        style.textContent = ".whatsapp-fab{position:fixed;right:22px;bottom:22px;z-index:80;width:66px;height:66px;display:inline-flex;align-items:center;justify-content:center;background:linear-gradient(140deg,#36db70,#1dad4b);color:#092418!important;border:0;border-radius:50%;padding:0;box-shadow:0 8px 24px #0008;text-decoration:none!important;transition:transform .2s ease,box-shadow .2s ease}.whatsapp-fab:hover{transform:translateY(-3px) scale(1.04);box-shadow:0 12px 30px #0009}.whatsapp-fab svg{display:block;width:39px;height:39px;flex-shrink:0}@media(max-width:760px){.whatsapp-fab{right:14px;bottom:14px;width:58px;height:58px}.whatsapp-fab svg{width:35px;height:35px}}@media(prefers-reduced-motion:reduce){.whatsapp-fab{transition:none}}";
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
      anchor.innerHTML = "<svg viewBox=\"0 0 32 32\" width=\"36\" height=\"36\" fill=\"currentColor\" aria-hidden=\"true\"><path d=\"M16 3.3a12.6 12.6 0 0 0-10.87 19L3.4 28.6l6.45-1.7A12.65 12.65 0 1 0 16 3.3Zm0 22.45c-1.77 0-3.5-.48-5.01-1.4l-.36-.21-3.82 1 .99-3.72-.24-.38A9.7 9.7 0 1 1 16 25.75Zm5.43-7.27c-.3-.16-1.77-.88-2.05-.98-.27-.1-.48.15-.68.15s-.77.98-.94 1.17c-.17.2-.35.23-.65.08-.3-.15-1.27-.47-2.42-1.49-.9-.8-1.5-1.77-1.67-2.08-.18-.3-.02-.46.13-.61.14-.14.3-.35.45-.53.15-.17.2-.29.3-.49.1-.2.05-.38-.03-.53-.07-.15-.68-1.64-.94-2.24-.24-.59-.49-.51-.68-.52h-.58c-.2 0-.53.08-.8.38-.28.3-1.05 1.03-1.05 2.5 0 1.48 1.08 2.91 1.23 3.11.15.2 2.12 3.24 5.14 4.54.72.31 1.28.49 1.72.63.73.23 1.38.2 1.9.12.58-.09 1.79-.73 2.04-1.43.25-.7.25-1.3.17-1.43-.08-.13-.28-.2-.59-.35Z\"/></svg>";
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
