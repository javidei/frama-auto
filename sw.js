/* Shell PWA de FRAMA AUTO: navegacion prioriza la red. */
const CACHE="frama-auto-pwa-v1";
const BASE=new URL("./",self.location.href).pathname;
const CORE=[BASE,BASE+"manifest.webmanifest",BASE+"icons/app-192.svg",BASE+"icons/app-512.svg"];
self.addEventListener("install",e=>e.waitUntil(caches.open(CACHE).then(c=>c.addAll(CORE)).then(()=>self.skipWaiting())));
self.addEventListener("activate",e=>e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x.startsWith("frama-auto-pwa-")&&x!==CACHE).map(x=>caches.delete(x)))).then(()=>self.clients.claim())));
self.addEventListener("fetch",e=>{
 if(e.request.method!=="GET")return;
 const url=new URL(e.request.url);
 if(url.origin!==self.location.origin||!url.pathname.startsWith(BASE)||url.pathname.startsWith(BASE+"api/"))return;
 if(e.request.mode==="navigate"){
   e.respondWith(fetch(e.request).then(r=>{
     if(r.ok&&r.type==="basic"){const copy=r.clone();caches.open(CACHE).then(c=>c.put(e.request,copy)).catch(()=>{});}
     return r;
   }).catch(()=>caches.match(e.request).then(r=>r||caches.match(BASE))));
 }else if(CORE.includes(url.pathname)){
   e.respondWith(fetch(e.request).catch(()=>caches.match(e.request)));
 }
});
