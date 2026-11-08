/* Instalacion PWA de FRAMA AUTO. */
(()=>{
 if(window.__FRAMA_PWA_ACTIVE__)return;window.__FRAMA_PWA_ACTIVE__=true;
 const base=location.pathname==="/frama-auto"||location.pathname.startsWith("/frama-auto/")?"/frama-auto/":"/";
 function link(rel,path,type){
   let el=document.querySelector('link[rel="'+rel+'"]');
   if(!el){el=document.createElement("link");el.rel=rel;document.head.append(el);}
   el.href=base+path;if(type)el.type=type;
 }
 link("manifest","manifest.webmanifest");
 link("icon","icons/app-192.svg","image/svg+xml");
 link("apple-touch-icon","images/logo-original.png","image/png");
 if(!document.querySelector('meta[name="theme-color"]')){
   const m=document.createElement("meta");m.name="theme-color";m.content="#08090b";document.head.append(m);
 }
 function registerWorker(){if("serviceWorker" in navigator)navigator.serviceWorker.register(base+"sw.js",{scope:base}).catch(e=>console.warn("PWA no disponible",e));}
 if(document.readyState==="complete")registerWorker();
 else window.addEventListener("load",registerWorker,{once:true});
 let deferred=null,button=null;
 window.addEventListener("beforeinstallprompt",e=>{
  if(window.matchMedia("(display-mode: standalone)").matches)return;
  e.preventDefault();deferred=e;if(button)return;
  button=document.createElement("button");button.type="button";button.textContent="Instalar FRAMA AUTO";
  Object.assign(button.style,{position:"fixed",bottom:"16px",left:"14px",zIndex:"90",border:"1px solid #d3ac62",borderRadius:"999px",background:"#171614",color:"#efd098",padding:"13px 17px",font:"600 13px system-ui,sans-serif",boxShadow:"0 4px 24px #0009",cursor:"pointer"});
  button.addEventListener("click",async()=>{if(!deferred)return;const prompt=deferred;deferred=null;try{await prompt.prompt();await prompt.userChoice;}catch(e){}button?.remove();button=null;});
  document.body.append(button);
 });
 window.addEventListener("appinstalled",()=>{button?.remove();button=null;deferred=null;});
})();
