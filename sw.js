// Guarda las apps en el celular para que abran aunque no haya señal
const CACHE='ciclo-volqueta-v5';
const FILES=['./','./index.html','./manifest.json','./icon-192.png','./icon-512.png',
             './cargadora.html','./manifest-cargadora.json','./icon-c-192.png','./icon-c-512.png'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(CACHE).then(c=>Promise.all(FILES.map(f=>c.add(f).catch(()=>{})))));self.skipWaiting();});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==CACHE).map(k=>caches.delete(k)))));self.clients.claim();});
self.addEventListener('fetch',e=>{
  const u=new URL(e.request.url);
  if(e.request.method!=='GET'||u.hostname.includes('script.google')) return; // los envíos a la base no se tocan
  if(u.hostname.includes('fonts.g')){
    e.respondWith(caches.open(CACHE).then(c=>c.match(e.request).then(r=>r||fetch(e.request).then(n=>{c.put(e.request,n.clone());return n;}))));return;
  }
  // primero internet (versión nueva); sin señal, la copia guardada
  e.respondWith(fetch(e.request).then(n=>{const cp=n.clone();caches.open(CACHE).then(c=>c.put(e.request,cp));return n;})
    .catch(()=>caches.match(e.request,{ignoreSearch:true}).then(r=>r||caches.match(u.pathname.endsWith('cargadora.html')?'./cargadora.html':'./index.html'))));
});
