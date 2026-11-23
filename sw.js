/* Guarda solo la pantalla de arranque (para que la app abra al instante). Los datos siempre vienen en vivo de la plataforma. */
var V = 'p43-v2';
var ARCHIVOS = ['./', 'index.html', 'manifest.webmanifest', 'icons/icon-192.png', 'icons/icon-512.png'];
self.addEventListener('install', function(e){ e.waitUntil(caches.open(V).then(function(c){ return c.addAll(ARCHIVOS); }).then(function(){ return self.skipWaiting(); })); });
self.addEventListener('activate', function(e){
  e.waitUntil(caches.keys().then(function(ks){ return Promise.all(ks.filter(function(k){ return k !== V; }).map(function(k){ return caches.delete(k); })); }).then(function(){ return self.clients.claim(); }));
});
self.addEventListener('fetch', function(e){
  var u = new URL(e.request.url);
  if(e.request.method !== 'GET' || u.origin !== location.origin) return;
  e.respondWith(fetch(e.request).then(function(r){
    var copia = r.clone(); caches.open(V).then(function(c){ c.put(e.request, copia); }); return r;
  }).catch(function(){ return caches.match(e.request).then(function(r){ return r || caches.match('index.html'); }); }));
});
