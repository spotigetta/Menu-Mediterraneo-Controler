const CACHE='mesa21-v1';
const ASSETS=['./','./index.html','./favicon.svg','./css/styles.css','./js/app.js','./manifest.webmanifest','./data/ingredients.json','./data/recipes.json','./data/menu.json','./data/inventory.json','./data/shopping-plans.json','./data/products.json','./data/settings.json','./data/utilization.json'];
self.addEventListener('install',e=>e.waitUntil(caches.open(CACHE).then(c=>c.addAll(ASSETS)).then(()=>self.skipWaiting())));
self.addEventListener('activate',e=>e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim())));
self.addEventListener('fetch',e=>{if(e.request.method!=='GET')return;e.respondWith(fetch(e.request).then(r=>{const copy=r.clone();caches.open(CACHE).then(c=>c.put(e.request,copy));return r}).catch(()=>caches.match(e.request)))});
