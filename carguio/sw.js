// Guarda la app en el celular para que abra aunque no haya señal
const CACHE='carguio-v1';
const FILES=['./','./index.html','./manifest.json','./icon-192.png','./icon-512.png'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(CACHE).then(c=>Promise.all(FILES.map(f=>c.add(f).catch(()=>{})))));self.skipWaiting();});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k.startsWith('carguio')&&k!==CACHE).map(k=>caches.delete(k)))));self.clients.claim();});
self.addEventListener('fetch',e=>{
  const u=new URL(e.request.url);
  if(e.request.method!=='GET'||u.hostname.includes('script.google')) return;
  if(u.hostname.includes('fonts.g')){
    e.respondWith(caches.open(CACHE).then(c=>c.match(e.request).then(r=>r||fetch(e.request).then(n=>{c.put(e.request,n.clone());return n;}))));return;
  }
  if(!u.pathname.startsWith(new URL('./',self.registration.scope).pathname)) return;
  e.respondWith(fetch(e.request).then(n=>{const cp=n.clone();caches.open(CACHE).then(c=>c.put(e.request,cp));return n;})
    .catch(()=>caches.match(e.request,{ignoreSearch:true}).then(r=>r||caches.match('./index.html'))));
});
