// Guarda la app en el celular para que abra aunque no haya señal
const CACHE='ciclo-volqueta-v4';
const FILES=['./','./index.html','./manifest.json','./icon-192.png','./icon-512.png'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(CACHE).then(c=>c.addAll(FILES)));self.skipWaiting();});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==CACHE).map(k=>caches.delete(k)))));self.clients.claim();});
self.addEventListener('fetch',e=>{
  const u=new URL(e.request.url);
  if(e.request.method!=='GET'||u.hostname.includes('script.google')) return; // los envíos a la base no se tocan
  if(u.hostname.includes('fonts.g')){ // fuentes: guardar copia
    e.respondWith(caches.open(CACHE).then(c=>c.match(e.request).then(r=>r||fetch(e.request).then(n=>{c.put(e.request,n.clone());return n;}))));return;
  }
  // app: intenta internet (por si hay versión nueva), si no hay señal usa la copia guardada
  e.respondWith(fetch(e.request).then(n=>{caches.open(CACHE).then(c=>c.put(e.request,n.clone()));return n;}).catch(()=>caches.match(e.request).then(r=>r||caches.match('./index.html'))));
});
