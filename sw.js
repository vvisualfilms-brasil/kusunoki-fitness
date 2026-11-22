const CACHE='kusunoki-v8';
const FILES=['./','index.html','manifest.json','icon.svg','icon-192.png','icon-512.png'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(CACHE).then(c=>c.addAll(FILES)).then(()=>self.skipWaiting()))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==CACHE).map(x=>caches.delete(x)))).then(()=>self.clients.claim()))});
// Rede primeiro (pega atualizações). Só guarda respostas boas (200);
// página de erro (404, conta fora do ar) nunca substitui a versão salva.
const fromCache=req=>caches.match(req).then(r=>r||caches.match('index.html'));
self.addEventListener('fetch',e=>{
  if(e.request.method!=='GET')return;
  e.respondWith(fetch(e.request).then(r=>{
    if(r.ok){const cp=r.clone();caches.open(CACHE).then(c=>c.put(e.request,cp));return r}
    return fromCache(e.request).then(c=>c||r);
  }).catch(()=>fromCache(e.request)));
});
