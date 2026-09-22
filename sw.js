/* Scope-local caches; never cache account/API responses. */
const CACHE_PREFIX='trackers:'+new URL(self.registration.scope).pathname+':';
const CACHE_NAME=CACHE_PREFIX+'v6.4';
const APP_SHELL=['./','./index.html','./manifest.webmanifest','./assets/css/workspace.css',
 './assets/js/storage-guard.js','./assets/js/core.js','./assets/js/sheets.js','./assets/js/config.js','./assets/js/cloud.js','./assets/js/pkbon.js','./assets/js/app.js','./assets/js/workspace.js','./assets/js/boot.js',
 ...['trackers-logo','trackers-logo-dark','dashboard','project','documentation','accounting','notes','report','settings','account','magnifying-glass','icon-192','icon-512','icon-maskable-512'].map(n=>'./assets/img/'+n+'.png')];
const VERSIONED_SHELL=APP_SHELL.map(p=>p==='./'||p==='./index.html'?p:p+'?v=20260922.64');
const LIBRARIES=new Set(['https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.57.4/dist/umd/supabase.js','https://unpkg.com/@supabase/supabase-js@2.57.4/dist/umd/supabase.js','https://cdn.sheetjs.com/xlsx-0.20.3/package/dist/xlsx.full.min.js']);
self.addEventListener('install',e=>e.waitUntil(caches.open(CACHE_NAME).then(c=>c.addAll(VERSIONED_SHELL.map(p=>new Request(new URL(p,self.registration.scope),{cache:'reload'}))))));
self.addEventListener('message',e=>{if(e.data?.type==='SKIP_WAITING')self.skipWaiting();if(e.data?.type==='GET_VERSION')e.ports[0]?.postMessage('6.4');});
self.addEventListener('activate',e=>e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k.startsWith(CACHE_PREFIX)&&k!==CACHE_NAME).map(k=>caches.delete(k)))).then(()=>self.clients.claim())));
self.addEventListener('fetch',e=>{
 const req=e.request,url=new URL(req.url);if(req.method!=='GET')return;
 if(url.origin!==self.location.origin){
   if(LIBRARIES.has(req.url))e.respondWith(caches.open(CACHE_NAME).then(async cache=>{const saved=await cache.match(req);if(saved)return saved;const r=await fetch(req);if(r.ok)await cache.put(req,r.clone());return r;}));
   return;
 }
 if(!url.href.startsWith(self.registration.scope))return;
 if(req.mode==='navigate'){
   e.respondWith(fetch(req,{cache:'no-cache'}).then(async r=>{if(r.ok){const c=await caches.open(CACHE_NAME);await c.put('./index.html',r.clone());}return r;}).catch(async()=>{const c=await caches.open(CACHE_NAME);return await c.match('./index.html')||new Response('Aplikasi belum tersedia offline.',{status:503});}));return;
 }
 if(!APP_SHELL.some(p=>new URL(p,self.registration.scope).pathname===url.pathname))return;
 e.respondWith(caches.open(CACHE_NAME).then(async c=>{
   const saved=await c.match(req);if(saved)return saved;
   const response=await fetch(req,{cache:'no-cache'});
   if(response.ok)await c.put(req,response.clone());return response;
 }));
});
