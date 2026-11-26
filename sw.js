/* 动物小镇 service worker: pages & scripts network-first (so updates arrive), media cache-first; works offline after the offline pack is downloaded */
const OFF='mlt-offline';
self.addEventListener('install',e=>self.skipWaiting());
self.addEventListener('activate',e=>e.waitUntil(self.clients.claim()));
const isCode=u=>/\.(html|js|json|webmanifest)$/i.test(u.pathname)||u.pathname.endsWith('/');
self.addEventListener('fetch',e=>{
  const req=e.request; if(req.method!=='GET') return;
  const u=new URL(req.url); if(u.origin!==location.origin) return;
  if(u.pathname.endsWith('/files.json')||req.cache==='no-store') return;
  e.respondWith((async()=>{
    const cache=await caches.open(OFF);
    const hit=()=>cache.match(req,{ignoreSearch:true}).then(r=>r||(u.pathname.endsWith('/')?cache.match(new URL('index.html',u),{ignoreSearch:true}):null));
    if(isCode(u)||req.mode==='navigate'){
      try{ const ctl=new AbortController(); const t=setTimeout(()=>ctl.abort(),4000);
        const r=await fetch(req,{signal:ctl.signal}); clearTimeout(t);
        if(r.ok&&!u.search) cache.put(req,r.clone()); return r; }
      catch(err){ const c=await hit(); if(c) return c; throw err; }
    }
    const c=await hit(); if(c) return c;
    const r=await fetch(req); if(r.ok&&r.status===200&&!u.search) cache.put(req,r.clone()); return r;
  })());
});
