/* 动物小镇 · 共享核心：钱包、每日任务、防沉迷、晚安画面
   每个小游戏都要 <script src="(相对路径)/town-core.js"></script>，并在 <html data-town-root="..."> 写明到小镇根目录的相对路径 */
/* ---------- touch devices (iPad): unlock audio on first tap, replay sounds that were blocked ---------- */
(function(){
  const touch=('ontouchstart' in window)||navigator.maxTouchPoints>1;
  const P=HTMLMediaElement.prototype, orig=P.play; let unlocked=false; const waiting=new Set();
  const SIL='data:audio/mpeg;base64,SUQzBAAAAAAAI1RTU0UAAAAPAAADTGF2ZjYwLjE2LjEwMAAAAAAAAAAAAAAA//NwwAAAAAAAAAAAAEluZm8AAAAPAAAACAAAA/oAR0dHR0dHR0dHR0dHYmJiYmJiYmJiYmJifHx8fHx8fHx8fHx8fJaWlpaWlpaWlpaWlrGxsbGxsbGxsbGxsbHLy8vLy8vLy8vLy8vl5eXl5eXl5eXl5eXl////////////////AAAAAExhdmM2MC4zMQAAAAAAAAAAAAAAACQC1AAAAAAAAAP6yysejgAAAAAAAAAAAAAAAAD/80DEAAAAA0gAAAAATEFNRTMuMTAwVVVVVVVVVVVVVUxBTUUzLjEwMFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVf/zQsRbAAADSAAAAABVVVVVVVVVVVVVVVVVVVVVVVVVVUxBTUUzLjEwMFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVf/zQMSkAAADSAAAAABVVVVVVVVVVVVVVVVVVVVVVVVVTEFNRTMuMTAwVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV//NCxKMAAANIAAAAAFVVVVVVVVVVVVVVVVVVVVVVVVVVTEFNRTMuMTAwVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV//NAxKQAAANIAAAAAFVVVVVVVVVVVVVVVVVVVVVVVVVMQU1FMy4xMDBVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVX/80LEowAAA0gAAAAAVVVVVVVVVVVVVVVVVVVVVVVVVVVMQU1FMy4xMDBVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVX/80DEpAAAA0gAAAAAVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVf/zQsSjAAADSAAAAABVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVQ==';
  const POOL=[];
  function unlock(){ if(unlocked) return; unlocked=true;
    if(touch){ for(let i=0;i<6;i++){ const a=new (window.__OrigAudio||Audio)(); a.src=SIL; a.muted=true; orig.call(a).then(()=>{ a.pause(); a.muted=false; a.removeAttribute('src'); a.load(); POOL.push(a); }).catch(()=>{}); } }
    waiting.forEach(fn=>fn()); waiting.clear(); }
  ['pointerdown','touchend','click','keydown'].forEach(ev=>addEventListener(ev,()=>{ unlock(); if(waiting.size){ const w=[...waiting]; waiting.clear(); w.forEach(fn=>fn()); } },{capture:true,passive:true}));
  P.play=function(){ const el=this; return orig.call(el).catch(err=>{ if(err&&err.name==='NotAllowedError'){ unlocked=false; return new Promise((res,rej)=>{ const go=()=>orig.call(el).then(res,rej); waiting.add(go); setTimeout(()=>{ if(waiting.delete(go)) rej(err); },15000); }); } throw err; }); };
  if(touch){ const OA=window.Audio; window.__OrigAudio=OA;
    window.Audio=function(src){ const a=POOL.find(x=>x.paused&&!x.loop&&!x.__busy); let el;
      if(a){ el=a; el.__busy=true; el.loop=false; el.playbackRate=1; el.volume=1; const free=()=>{ el.__busy=false; }; el.addEventListener('ended',free,{once:true}); el.addEventListener('error',free,{once:true}); setTimeout(free,30000); if(src!==undefined) el.src=src; }
      else { el=src!==undefined?new OA(src):new OA(); }
      return el; };
    window.Audio.prototype=OA.prototype; }
})();
/* ---------- phones: the town is drawn for a landscape tablet, so widen the layout viewport to fit a small screen ---------- */
(function(){
  const mv=document.querySelector('meta[name=viewport]'); if(!mv) return;
  const base=mv.getAttribute('content'); const MIN_H=720;
  const coarse=matchMedia('(pointer:coarse)').matches||navigator.maxTouchPoints>0;
  const phone=()=>coarse&&Math.min(screen.width,screen.height)<600;
  let cur=null, lastLand=null;
  function fit(){ if(!phone()) return;
    const land=innerWidth>innerHeight; lastLand=land;
    let want=base;
    if(land){ const longSide=Math.max(screen.width,screen.height); const w=Math.max(longSide,Math.ceil(MIN_H*innerWidth/innerHeight)); want='width='+w+', viewport-fit=cover'; }
    if(want!==cur){ cur=want; mv.setAttribute('content',want); }
    rotateCover(!land); }
  function rotateCover(show){ let d=document.getElementById('tc-rotate');
    if(!show){ if(d) d.remove(); return; } if(d||!document.body) return;
    const zh=(()=>{ try{ return (localStorage.getItem('mlt_lang')||'en')==='zh'; }catch(e){ return false; } })();
    d=document.createElement('div'); d.id='tc-rotate';
    d.innerHTML='<div style="font-size:64px;line-height:1;animation:tcrot 2s ease-in-out infinite">📱</div><div style="font-size:22px;font-weight:900;margin:18px 0 10px">'+(zh?'请把手机横过来玩':'Please turn your phone sideways')+'</div><div style="font-size:14px;opacity:.8;max-width:280px;line-height:1.5">'+(zh?'如果画面没有跟着转，请在控制中心关掉「竖排方向锁定」。':'If the screen does not turn, switch off Portrait Orientation Lock in Control Centre.')+'</div>';
    d.style.cssText='position:fixed;inset:0;z-index:2147483000;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;padding:24px;background:linear-gradient(160deg,#FFE9D6,#E6F4DA);color:#3B3049;font-family:ui-rounded,"PingFang SC",system-ui,sans-serif';
    if(!document.getElementById('tc-rot-css')){ const s=document.createElement('style'); s.id='tc-rot-css'; s.textContent='@keyframes tcrot{0%,30%{transform:rotate(0)}60%,100%{transform:rotate(-90deg)}}'; document.head.appendChild(s); }
    document.body.appendChild(d); }
  fit();
  addEventListener('orientationchange',()=>setTimeout(fit,300));
  let t; addEventListener('resize',()=>{ clearTimeout(t); t=setTimeout(()=>{ if(phone()&&(innerWidth>innerHeight)!==lastLand) fit(); },250); });
  window.__fitPhone=fit;
})();
/* ---------- offline (website only): service worker + downloadable offline pack ---------- */
const ONLINE_SITE=/^https?:/.test(location.protocol)&&('serviceWorker' in navigator);
(function(){
"use strict";
const ROOT = (document.documentElement.dataset.townRoot || '.').replace(/\/$/,'');
const GAMES = {
  spelling: { name:'图书馆 · 拼单词', unit:'组', icon:'book', url: ROOT+'/图书馆/拼写.html', ready:true },
  shop:     { name:'杂货店 · 当小店员', unit:'轮', icon:'basket', url: ROOT+'/小镇.html#shop', ready:true },
  chinese:  { name:'书院 · 认汉字（读书、学字或复习）', unit:'次', icon:'lantern', url: ROOT+'/书院/认字.html', ready:true },
  math:     { name:'面包店 · 开店做点心', unit:'次', icon:'cupcake', url: ROOT+'/面包店/烘焙.html', ready:true },
};
const GOALS = {
  balanced: { label:'均衡', counts:{spelling:1, shop:1, chinese:1, math:1} },
  english:  { label:'着重英文拼写', counts:{spelling:2, shop:1, chinese:1, math:1} },
  chinese:  { label:'着重中文', counts:{spelling:1, shop:1, chinese:2, math:1} },
  math:     { label:'着重数学', counts:{spelling:1, shop:2, chinese:1, math:2} },
  custom:   { label:'自定义', counts:null },
};
const IDLE_LIMIT = 120;        // 秒：超过 2 分钟没操作就暂停计时
const TASK_BONUS = 200;        // 全部完成每日任务的奖励（分）
const STAMPS_PER_EGG = 3;

/* ---------- storage ---------- */
let dbp;
function db(){ if(dbp) return dbp; dbp=new Promise((res,rej)=>{ const r=indexedDB.open('animaltown',1);
  r.onupgradeneeded=()=>{ if(!r.result.objectStoreNames.contains('kv')) r.result.createObjectStore('kv'); };
  r.onsuccess=()=>res(r.result); r.onerror=()=>rej(r.error); }); return dbp; }
async function kvGet(k){ const d=await db(); return new Promise((res,rej)=>{ const q=d.transaction('kv').objectStore('kv').get(k); q.onsuccess=()=>res(q.result); q.onerror=()=>rej(q.error); }); }
async function kvPut(k,v){ const d=await db(); return new Promise((res,rej)=>{ const t=d.transaction('kv','readwrite'); t.objectStore('kv').put(v,k); t.oncomplete=()=>res(); t.onerror=()=>rej(t.error); }); }
function today(d=new Date()){ const z=n=>String(n).padStart(2,'0'); return d.getFullYear()+'-'+z(d.getMonth()+1)+'-'+z(d.getDate()); }

function fresh(){ return { v:1, created:today(), pin:null, childName:'',
  coins:1000, coinsTotal:1000, welcomeGift:true,
  outfit:'pink', owned:['pink'], decor:[], animals:[], newAnimal:null,
  stamps:[], eggsOpened:0, diary:[], notes:[], tasks:{}, time:{}, extra:{}, ledger:[],
  settings:{ goal:'balanced', custom:{spelling:1,shop:1,chinese:1,math:1}, minutes:20, bedtime:'', shopLevel:1 } }; }
let T=null;
const ready=(async()=>{ try{ T=await kvGet('state'); }catch(e){ T=null; }
  if(!T) T=fresh();
  T.settings=Object.assign(fresh().settings,T.settings||{}); T.diary=T.diary||[]; T.notes=T.notes||[];
  if(T.settings.lang&&T.settings.lang!==LANG){ try{ localStorage.setItem('mlt_lang',T.settings.lang); }catch(e){} if(!T.settings.langSynced){ T.settings.langSynced=1; } }
  await migrateSpelling(); tourInit(); return T; })();
let saveTimer; function save(){ clearTimeout(saveTimer); saveTimer=setTimeout(()=>kvPut('state',T).catch(()=>{}),120); }
function saveNow(){ clearTimeout(saveTimer); return kvPut('state',T); }

/* 拼写游戏旧数据：换成小镇币，已解锁的小动物搬到宠物乐园 */
async function migrateSpelling(){
  if(T.spellMigrated) return;
  try{ const d=await new Promise((res)=>{ const r=indexedDB.open('spellingpals',1); r.onupgradeneeded=()=>{ ['kv','photos','audio'].forEach(s=>{ if(!r.result.objectStoreNames.contains(s)) r.result.createObjectStore(s); }); }; r.onsuccess=()=>res(r.result); r.onerror=()=>res(null); });
    if(!d){ T.spellMigrated=true; return; }
    const S=await new Promise(res=>{ const q=d.transaction('kv').objectStore('kv').get('state'); q.onsuccess=()=>res(q.result); q.onerror=()=>res(null); });
    if(S){ (S.unlocked||[]).forEach(i=>{ if(!T.animals.includes(i)) T.animals.push(i); });
      const c=(S.pawsTotal||0)*25; if(c>0){ T.coins+=c; T.coinsTotal+=c; T.ledger.push({d:today(),c,why:'拼写游戏的 换成小镇币'}); }
      if(S.pin && !T.pin) T.pin=S.pin; if(S.childName) T.childName=S.childName; }
    T.spellMigrated=true; await saveNow();
  }catch(e){ T.spellMigrated=true; }
}

/* ---------- money ---------- */
function fmt(c){ c=Math.round(c); const neg=c<0; c=Math.abs(c); const d=Math.floor(c/100), r=c%100; return (neg?'-':'')+'$'+d+'.'+String(r).padStart(2,'0'); }
function earn(cents, why){ T.coins+=cents; T.coinsTotal+=cents; T.ledger.push({d:today(),c:cents,why}); if(T.ledger.length>400) T.ledger.splice(0,100); save(); }
function spend(cents, why){ if(T.coins<cents) return false; T.coins-=cents; T.ledger.push({d:today(),c:-cents,why}); save(); return true; }

/* ---------- daily tasks ---------- */
function counts(){ const g=GOALS[T.settings.goal]||GOALS.balanced; return g.counts||T.settings.custom; }
const MAX_TASKS = 3;           // 每天最多 3 个任务，轮流安排
function tasksToday(){ const c=counts(), done=T.tasks[today()]||{};
  let keys=Object.keys(GAMES).filter(k=>GAMES[k].ready && (c[k]||0)>0);
  if(keys.length>MAX_TASKS){ const focus=keys.filter(k=>c[k]>=2), rest=keys.filter(k=>c[k]<2);
    const day=Math.floor(Date.parse(today()+'T12:00:00Z')/864e5); const rot=rest.map((k,i)=>rest[(i+day)%rest.length]);
    const pick=new Set([...focus,...rot].slice(0,MAX_TASKS)); keys=keys.filter(k=>pick.has(k)); }
  return keys.map(k=>({game:k, ...GAMES[k], need:c[k], done:Math.min(done[k]||0,c[k])})); }
function allDone(){ const t=tasksToday(); return t.length>0 && t.every(x=>x.done>=x.need); }
function taskDone(game){ tourMark(game); const d=today(); const before=allDone(); T.tasks[d]=T.tasks[d]||{}; T.tasks[d][game]=(T.tasks[d][game]||0)+1;
  let bonus=0, stamp=false; if(!before && allDone()){ bonus=TASK_BONUS; earn(bonus,'完成今天全部任务'); }
  save(); return { allDoneNow: !before && allDone(), bonus, stamp }; }
// one stamp per finished spelling round, at most STAMPS_PER_EGG a day → at most one new friend a day
function addStamp(){ const d=today(); if(T.stamps.filter(x=>x===d).length>=STAMPS_PER_EGG) return false; T.stamps.push(d); save(); return true; }
function stampsToward(){ return Math.max(0,T.stamps.length-T.eggsOpened*STAMPS_PER_EGG); }
function pickNewAnimal(){ const AN=window.ANIMALS||[]; const locked=AN.map((_,i)=>i).filter(i=>!T.animals.includes(i)); if(!locked.length) return null;
  const w=locked.map(i=>['cat','dog'].includes(AN[i].kind)?2:1); let r=Math.random()*w.reduce((a,b)=>a+b,0); for(let k=0;k<locked.length;k++){ r-=w[k]; if(r<=0) return locked[k]; } return locked[0]; }
// full-screen egg hatching show: dark screen, egg wobbles, cracks, golden flash, new friend pops out
function hatchShow(){ return new Promise(async res=>{ css(); const pick=pickNewAnimal(); if(pick==null||eggsAvailable()<=0) return res(null);
  T.eggsOpened++; T.animals.push(pick); T.newAnimal=pick; await saveNow(); const A=window.ANIMALS[pick];
  const egg=`<svg viewBox="0 0 200 250" width="100%" height="100%"><defs><radialGradient id="eg" cx="38%" cy="32%" r="75%"><stop offset="0" stop-color="#FFFDF6"/><stop offset=".7" stop-color="#FFF1C9"/><stop offset="1" stop-color="#F3CF7A"/></radialGradient>
    <clipPath id="eTop"><path d="M0,0H200V118L178,104L156,124L134,102L112,126L90,104L68,126L46,104L24,124L0,108Z"/></clipPath><clipPath id="eBot"><path d="M0,250H200V118L178,104L156,124L134,102L112,126L90,104L68,126L46,104L24,124L0,108Z"/></clipPath>
    <g id="eShape"><path d="M100,8C150,8 188,92 188,152C188,210 148,244 100,244C52,244 12,210 12,152C12,92 50,8 100,8Z" fill="url(#eg)" stroke="#E2B65A" stroke-width="4"/>
    <circle cx="66" cy="70" r="11" fill="#FFB3C7"/><circle cx="132" cy="56" r="8" fill="#9ED8F5"/><circle cx="150" cy="150" r="13" fill="#B8E3A8"/><circle cx="56" cy="170" r="9" fill="#C9B6F5"/><circle cx="104" cy="200" r="10" fill="#FFB3C7"/><ellipse cx="72" cy="40" rx="12" ry="20" fill="#fff" opacity=".7" transform="rotate(-25 72 40)"/></g></defs>
    <g class="eb"><use href="#eShape" clip-path="url(#eBot)"/></g><g class="et"><use href="#eShape" clip-path="url(#eTop)"/></g>
    <path class="ck1" d="M24,124L46,104L68,126L90,104" fill="none" stroke="#8A6420" stroke-width="4" stroke-linejoin="round"/><path class="ck2" d="M90,104L112,126L134,102L156,124L178,104" fill="none" stroke="#8A6420" stroke-width="4" stroke-linejoin="round"/></svg>`;
  const o=document.createElement('div'); o.id='tc-hatch'; o.innerHTML=`<div class="rays"></div><div class="flash"></div><div class="egg">${egg}</div>
    <div class="friend"><div class="pic" style="${animalStyle(pick)}"></div><h2>${L(A.zh,A.en)}</h2><p>${L('新朋友来啦！','A new friend!')}</p><button>${L('欢迎你！','Welcome!')}</button></div><div class="hint">${L('蛋在动了……','The egg is moving…')}</div>`;
  document.body.appendChild(o); requestAnimationFrame(()=>o.classList.add('on'));
  speak(L('哇，集齐三个印章啦！蛋要孵出来了！','Wow, three stamps! The egg is hatching!'), LANG==='en'?'en-NZ':'zh-CN');
  const step=(c,t)=>setTimeout(()=>o.classList.add(c),t);
  step('s1',700); step('s2',1900); step('s3',3000); step('s4',3900); step('pop',4300);
  setTimeout(()=>{ const s=['sparkle','star','heart','star','paw']; for(let i=0;i<26;i++){ const e=document.createElement('i'); e.className='sp'; e.innerHTML=icon(s[i%s.length]); const a=Math.random()*Math.PI*2, d=160+Math.random()*260;
      e.style.cssText=`--dx:${Math.cos(a)*d}px;--dy:${Math.sin(a)*d}px;animation-delay:${Math.random()*.25}s`; o.appendChild(e); }
    speak(L(`是${A.zh}！欢迎你！`,`It's a ${A.en}! Welcome!`), LANG==='en'?'en-NZ':'zh-CN'); },4300);
  o.querySelector('.friend button').onclick=()=>{ o.classList.add('bye'); setTimeout(()=>{ o.remove(); res(pick); },400); }; }); }
function eggsAvailable(){ return Math.floor(T.stamps.length/STAMPS_PER_EGG) - T.eggsOpened; }

/* ---------- time limit ---------- */
let lastAct=Date.now(), tickT=null, bannerShown=false;
['pointerdown','keydown','mousemove','wheel','touchstart'].forEach(ev=>addEventListener(ev,()=>{ lastAct=Date.now(); },{passive:true}));
function usedSec(){ return T.time[today()]||0; }
function limitSec(){ const m=T.settings.minutes; if(!m) return Infinity; return (m + (T.extra[today()]||0))*60; }
function pastBedtime(){ const b=T.settings.bedtime; if(!b) return false; const [h,m]=b.split(':').map(Number); const n=new Date(); const mins=n.getHours()*60+n.getMinutes(); return mins>=h*60+m || mins<5*60; }
function overtime(){ return usedSec()>=limitSec() || pastBedtime(); }
// which part of town the child is in, for the parent dashboard (learning vs play time)
const PATH_AREA=[['图书馆','spelling'],['书院','chinese'],['面包店','math'],['小屋','diary'],['健身房','gym']];
let AREA=(PATH_AREA.find(([k])=>decodeURIComponent(location.pathname).includes('/'+k+'/'))||[0,'town'])[1];
function setArea(a){ AREA=a||'town'; }
function parentOpen(){ return !!document.querySelector('#parent.on,#pParent.on'); }
function startTimer(){ if(tickT) return; tickT=setInterval(()=>{ if(document.hidden) return; if((Date.now()-lastAct)/1000>IDLE_LIMIT) return;
  if(parentOpen()) return; // time spent in the parent centre is not the child's time
  const d=today(); T.time[d]=(T.time[d]||0)+1; T.timeBy=T.timeBy||{}; const tb=T.timeBy[d]=T.timeBy[d]||{}; tb[AREA]=(tb[AREA]||0)+1; if(T.time[d]%5===0) save();
  if(overtime() && !bannerShown){ bannerShown=true; showBanner(); }
  document.dispatchEvent(new CustomEvent('town:tick')); },1000); }
function remainingSec(){ return Math.max(0, limitSec()-usedSec()); }

/* ---------- UI: banner + night ---------- */
function css(){ if(document.getElementById('town-core-css')) return; const s=document.createElement('style'); s.id='town-core-css'; s.textContent=`
#tc-hatch{position:fixed;inset:0;z-index:20000;background:rgba(22,12,40,0);transition:background .6s;display:flex;align-items:center;justify-content:center;overflow:hidden;font-family:ui-rounded,system-ui,"PingFang SC"}
#tc-hatch.on{background:rgba(18,10,34,.9)}#tc-hatch.bye{opacity:0;transition:opacity .4s}
#tc-hatch .egg{position:absolute;width:min(34vh,260px);height:min(42vh,325px);transform:translateY(-120vh);transition:transform .7s cubic-bezier(.3,1.5,.5,1)}
#tc-hatch.on .egg{transform:none}
#tc-hatch.s1 .egg svg{animation:tcw1 .5s ease-in-out infinite;transform-origin:50% 95%}
#tc-hatch.s2 .egg svg{animation:tcw2 .22s ease-in-out infinite}
#tc-hatch .ck1,#tc-hatch .ck2{stroke-dasharray:120;stroke-dashoffset:120;transition:stroke-dashoffset .5s}
#tc-hatch.s2 .ck1,#tc-hatch.s3 .ck2{stroke-dashoffset:0}
#tc-hatch.s3 .egg{filter:drop-shadow(0 0 30px #FFE07A) drop-shadow(0 0 60px #FFD040)}
#tc-hatch .et,#tc-hatch .eb{transition:transform .8s cubic-bezier(.2,.8,.3,1),opacity .8s;transform-box:fill-box;transform-origin:center}
#tc-hatch.s4 .egg svg{animation:none}#tc-hatch.s4 .ck1,#tc-hatch.s4 .ck2{opacity:0}
#tc-hatch.s4 .et{transform:translate(-30px,-140px) rotate(-35deg);opacity:0}#tc-hatch.s4 .eb{transform:translateY(120px) scale(.9);opacity:0}
#tc-hatch .flash{position:absolute;width:40px;height:40px;border-radius:50%;background:radial-gradient(#fff,#FFE58A 40%,rgba(255,210,80,0) 70%);opacity:0}
#tc-hatch.s4 .flash{animation:tcflash 1.1s ease-out forwards}
#tc-hatch .rays{position:absolute;width:160vmax;height:160vmax;background:repeating-conic-gradient(rgba(255,225,120,.28) 0 8deg,transparent 8deg 20deg);border-radius:50%;opacity:0;transform:scale(.2);transition:opacity .8s,transform 1s;-webkit-mask:radial-gradient(circle,#000 0,transparent 60%);mask:radial-gradient(circle,#000 0,transparent 60%)}
#tc-hatch.s4 .rays{opacity:1;transform:scale(1);animation:tcspin 14s linear infinite}
#tc-hatch .friend{position:absolute;text-align:center;color:#fff;transform:scale(0);opacity:0}
#tc-hatch.pop .friend{animation:tcpop .7s cubic-bezier(.3,1.6,.5,1) forwards}
#tc-hatch .friend .pic{width:min(36vh,280px);height:min(36vh,280px);margin:0 auto;border-radius:50%;background-color:#fff;background-repeat:no-repeat;box-shadow:0 0 0 8px #FFE07A,0 0 60px #FFD040;animation:tcbob 1.6s ease-in-out .7s infinite}
#tc-hatch .friend h2{font-size:44px;margin:22px 0 4px;font-weight:900;text-shadow:0 3px 10px rgba(0,0,0,.4)}
#tc-hatch .friend p{font-size:22px;margin:0 0 20px;opacity:.9}
#tc-hatch .friend button{border:none;border-radius:999px;background:#FF8FAB;color:#fff;font:900 24px ui-rounded,system-ui,"PingFang SC";padding:14px 34px;box-shadow:0 5px 0 #D9607F;cursor:pointer}
#tc-hatch .hint{position:absolute;bottom:9vh;color:#FFE9A8;font-size:24px;font-weight:800;transition:opacity .4s}#tc-hatch.s4 .hint{opacity:0}
#tc-hatch .sp{position:absolute;font-style:normal;font-size:30px;animation:tcsp 1.4s ease-out forwards}
@keyframes tcw1{0%,100%{transform:rotate(0)}25%{transform:rotate(-6deg)}75%{transform:rotate(6deg)}}
@keyframes tcw2{0%,100%{transform:rotate(0) translateX(0)}25%{transform:rotate(-10deg) translateX(-6px)}75%{transform:rotate(10deg) translateX(6px)}}
@keyframes tcflash{0%{opacity:1;transform:scale(1)}40%{opacity:1;transform:scale(40)}100%{opacity:0;transform:scale(60)}}
@keyframes tcspin{to{transform:scale(1) rotate(360deg)}}
@keyframes tcpop{0%{transform:scale(0) translateY(60px);opacity:0}100%{transform:scale(1);opacity:1}}
@keyframes tcbob{50%{transform:translateY(-12px)}}
@keyframes tcsp{0%{transform:translate(0,0) scale(.4);opacity:1}100%{transform:translate(var(--dx),var(--dy)) scale(1.2);opacity:0}}

#town-banner{position:fixed;left:50%;top:14px;transform:translateX(-50%);z-index:9000;background:#2B2D5C;color:#FFF3C4;padding:12px 26px;border-radius:999px;font:800 20px ui-rounded,system-ui,"PingFang SC";box-shadow:0 6px 20px rgba(0,0,0,.25);animation:tcdrop .5s cubic-bezier(.3,1.5,.5,1)}
@keyframes tcdrop{from{transform:translate(-50%,-80px)}}
#town-night{position:fixed;inset:0;z-index:9999;background:#0d1433 center/cover no-repeat;display:flex;align-items:center;justify-content:center;font-family:ui-rounded,system-ui,"PingFang SC";animation:tcfade 1.6s ease}
@keyframes tcfade{from{opacity:0}}
#town-night .tn-box{background:rgba(16,20,60,.72);backdrop-filter:blur(4px);border-radius:32px;padding:28px 40px;display:flex;align-items:center;gap:24px;color:#FFF6D8;max-width:900px;box-shadow:0 0 60px rgba(255,220,140,.18)}
#town-night img.r{height:min(52vh,420px);filter:drop-shadow(0 6px 12px rgba(0,0,0,.4))}
#town-night h1{font-size:44px;margin:0 0 10px;font-weight:900;letter-spacing:2px}
#town-night p{font-size:22px;margin:6px 0;line-height:1.5}
#town-night .zz{display:flex;gap:10px;margin-top:14px;flex-wrap:wrap}
#town-night .zz div{width:70px;height:70px;border-radius:50%;background:#fff center/cover;position:relative;filter:brightness(.85)}
#town-night .zz div::after{content:'';position:absolute;right:-8px;top:-10px;font-size:22px}
#town-night .diary{margin-top:18px;background:#FFD98A;color:#3B2A10;border:none;border-radius:999px;padding:14px 26px;font:900 21px ui-rounded,system-ui,"PingFang SC";cursor:pointer;box-shadow:0 0 24px rgba(255,210,120,.6);animation:tcglow 2s ease-in-out infinite}
@keyframes tcglow{50%{box-shadow:0 0 40px rgba(255,210,120,.95)}}
#town-night .parent{position:absolute;right:20px;top:18px;background:rgba(255,255,255,.9);color:#3B2A10;border:none;border-radius:999px;padding:10px 18px;font:800 16px ui-rounded,system-ui,"PingFang SC";cursor:pointer;box-shadow:0 3px 0 rgba(0,0,0,.25)}`;
  document.head.appendChild(s); }
function showBanner(){ css(); if(document.getElementById('town-banner')) return; const b=document.createElement('div'); b.id='town-banner'; b.textContent='天快黑了，完成这一关就要休息啦'; document.body.appendChild(b);
  speakZh('天快黑了，完成这一关就要休息啦'); setTimeout(()=>b.remove(),9000); }
function animalStyle(i){ const A=(window.ANIMALS||[])[i]; if(!A) return ''; const sc=100/A.s;
  return `background-image:url(${ROOT}/assets/animals${A.sheet}.webp);background-size:${sc}% ${sc}%;background-position:${A.x/(1-A.s)*100}% ${A.y/(1-A.s)*100}%`; }
function showNight(){ css(); if(document.getElementById('town-night')) return; speechSynthesis && speechSynthesis.cancel();
  const n=document.createElement('div'); n.id='town-night'; n.style.backgroundImage=`url(${ROOT}/assets/map_night.jpg)`;
  const pets=T.animals.slice(-5).map(i=>`<div style="${animalStyle(i)}"></div>`).join('');
  n.innerHTML=`<div class="tn-box"><img class="r" src="${ROOT}/assets/outfits/pyjamas.webp" alt=""><div>
    <h1>晚安，${T.childName||TC.L('小朋友','friend')}！</h1><p>夜深了，小镇的动物们都睡了。</p><p>拜拜，明天再见！</p>
    <p style="font-size:17px;opacity:.75">Good night! See you tomorrow.</p><div class="zz">${pets}</div>${diaryBtn()}</div></div>
    <button class="parent">家长中心</button>`;
  document.body.appendChild(n);
  setTimeout(()=>speakZh(`夜深了，小镇的动物们都睡了。拜拜，明天再见！`),900);
  n.querySelector('.parent').onclick=async()=>{ if(!(await askPin())) return;
    if(typeof window.openParentFromNight==='function'){ n.remove(); window.openParentFromNight(); return; }
    try{ sessionStorage.setItem('parentOK',String(Date.now())); }catch(e){} location.href=ROOT+'/小镇.html#parent'; };
}
document.addEventListener('change',e=>{ if(!e.target.closest('#parent')) return; document.querySelectorAll('.tc-toast').forEach(t=>t.remove()); const t=document.createElement('div'); t.className='tc-toast'; t.textContent='✓ 已保存';
  t.style.cssText='position:fixed;left:50%;bottom:30px;transform:translateX(-50%);background:#1E7D6F;color:#fff;font:900 17px ui-rounded,system-ui,"PingFang SC";border-radius:999px;padding:10px 22px;z-index:99999;box-shadow:0 6px 20px rgba(0,0,0,.2)'; document.body.appendChild(t); setTimeout(()=>t.remove(),1400); });
// a game's parent page opened from the hub's parent centre: its back button returns to the parent centre
let FROM_HUB=false; try{ FROM_HUB=sessionStorage.getItem('parentFrom')==='hub'; sessionStorage.removeItem('parentFrom'); }catch(e){}
function hookParentBack(){ if(!FROM_HUB) return; const b=document.querySelector('#parent #pBack, #parent .topbar [data-go="home"]'); if(!b) return;
  b.textContent='← 家长中心'; b.addEventListener('click',e=>{ e.stopImmediatePropagation(); e.preventDefault(); try{ sessionStorage.setItem('parentOK',String(Date.now())); }catch(x){} location.href=ROOT+'/小镇.html#parent'; },true); }
if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',hookParentBack); else hookParentBack();
async function parentPass(){ try{ const ok=Date.now()-(+sessionStorage.getItem('parentOK')||0)<60000; sessionStorage.removeItem('parentOK'); if(ok) return true; }catch(e){} return askPin(); }
function diaryBtn(){ const done=(T.diary||[]).some(e=>e.d===today()); const unread=(T.notes||[]).some(n=>!n.read); return done?`<p style="margin-top:16px">今晚的日记写好啦</p>`:`<button class="diary" onclick="location.href='${ROOT}/小屋/日记.html'">回小屋写日记${unread?'':''}</button>`; }
// the diary opens once today's play time is used up (or after bedtime); with no time limit set, after 5:30 pm
function diaryOpen(){ if(overtime()) return true; if(!(T.settings&&T.settings.minutes)){ const d=new Date(); return d.getHours()*60+d.getMinutes()>=17*60+30; } return false; }
function afterReward(next){ if(overtime()){ showNight(); return true; } next&&next(); return false; }
function guard(){ if(overtime()){ showNight(); return true; } return false; }

/* ---------- PIN (shared by every game) ---------- */
function askPin(){ return new Promise(res=>{ css(); const setting=!T.pin; let entry='', first=null;
  const o=document.createElement('div'); o.style.cssText='position:fixed;inset:0;z-index:10000;background:rgba(40,30,60,.55);display:flex;align-items:center;justify-content:center;font-family:ui-rounded,system-ui,"PingFang SC"';
  o.innerHTML=`<div style="background:#fff;border-radius:26px;padding:24px 28px;text-align:center;width:340px;color:#3B3049"><div style="font-size:22px;font-weight:800" id="tp-t">${setting?'设置家长密码':'家长密码'}</div><div id="tp-s" style="color:#8A7F99;margin-top:6px;min-height:20px">${setting?'第一次使用，请设一个 4 位数字密码':''}</div><div id="tp-d" style="display:flex;gap:14px;justify-content:center;margin:16px 0"></div><div id="tp-k" style="display:grid;grid-template-columns:repeat(3,76px);gap:10px;justify-content:center"></div><button id="tp-c" style="margin-top:14px;border:none;background:#F1EAE2;border-radius:12px;padding:10px 18px;font-weight:700">取消</button></div>`;
  document.body.appendChild(o); const dots=()=>{ o.querySelector('#tp-d').innerHTML=[0,1,2,3].map(k=>`<i style="width:20px;height:20px;border-radius:50%;background:${k<entry.length?'#3B3049':'#EDE3D8'}"></i>`).join(''); };
  o.querySelector('#tp-k').innerHTML=[1,2,3,4,5,6,7,8,9,'',0,'⌫'].map(k=>`<button data-k="${k}" style="height:64px;border:none;border-radius:16px;background:#FFF6EC;font-size:26px;font-weight:800;${k===''?'visibility:hidden':''}">${k}</button>`).join('');
  dots(); const sub=o.querySelector('#tp-s'); const done=v=>{ o.remove(); res(v); };
  o.querySelector('#tp-k').onclick=e=>{ const k=e.target.dataset.k; if(k===undefined) return; if(k==='⌫') entry=entry.slice(0,-1); else if(entry.length<4) entry+=k; dots();
    if(entry.length===4) setTimeout(()=>{ if(setting){ if(first===null){ first=entry; entry=''; sub.textContent='再输一次确认'; dots(); } else if(first===entry){ T.pin=entry; saveNow(); done(true); } else { first=null; entry=''; sub.textContent='两次不一样，请重新设置'; dots(); } }
      else if(entry===T.pin) done(true); else { entry=''; sub.textContent='密码不对'; dots(); } },120); };
  o.querySelector('#tp-c').onclick=()=>done(false); }); }


/* ---------- language: 中文 / English ----------
   UI text is written in Chinese in the code; when English is chosen, a translator swaps every
   Chinese text node using i18n-en.js (exact matches + patterns). Parent areas always stay Chinese.
   Learning content that must stay Chinese (汉字, stories) is marked with data-zh or listed in window.I18N_SKIP. */
let LANG=(()=>{ try{ return localStorage.getItem('mlt_lang')||'en'; }catch(e){ return 'en'; } })();
const CJK=/[㐀-鿿]/;
function lang(){ return LANG; }
function setLang(l){ LANG=l; try{ localStorage.setItem('mlt_lang',l); }catch(e){} if(T){ T.settings.lang=l; save(); } }
function L(zh,en){ return LANG==='en'&&en!=null?en:zh; }
const I18N_SKIP_BASE='script,style,textarea,input,[data-zh],#parent,#pParent,#pMail .letter .txt,.tc-zh';
function trText(str){ const D=window.I18N_EN; if(!D) return null; const k=str.trim(); if(!k) return null;
  if(Object.prototype.hasOwnProperty.call(D.exact,k)) return str.replace(k,D.exact[k]);
  for(const [re,rep] of D.re){ re.lastIndex=0; if(re.test(k)){ re.lastIndex=0; let r=k.replace(re,rep); r=r.replace(/《[^》]*》|[\u3400-\u9fff]+/g,w=>w[0]==='《'?w:(Object.prototype.hasOwnProperty.call(D.exact,w)?D.exact[w]:w)); return str.replace(k,r); } }
  return null; }
const trDone=new WeakSet();
function skipEl(el){ const sel=I18N_SKIP_BASE+(window.I18N_SKIP?','+window.I18N_SKIP:''); return el&&el.closest&&el.closest(sel); }
function trNode(n){ if(LANG!=='en'||!window.I18N_EN) return;
  if(n.nodeType===3){ const v=n.nodeValue; if(!v||!CJK.test(v)||skipEl(n.parentElement)) return; const t=trText(v); if(t!=null&&t!==v) n.nodeValue=t; if((t==null||t===v||CJK.test(t))&&window.__onMissing) window.__onMissing(v.trim()); return; }
  if(n.nodeType!==1||skipEl(n)) return;
  ['placeholder','title','alt'].forEach(a=>{ const v=n.getAttribute&&n.getAttribute(a); if(v&&CJK.test(v)){ const t=trText(v); if(t!=null) n.setAttribute(a,t); } });
  const w=document.createTreeWalker(n,NodeFilter.SHOW_TEXT|NodeFilter.SHOW_ELEMENT); let x; const list=[];
  while((x=w.nextNode())) list.push(x);
  list.forEach(x=>{ if(x.nodeType===3) trNode(x); else ['placeholder','title'].forEach(a=>{ const v=x.getAttribute(a); if(v&&CJK.test(v)&&!skipEl(x)){ const t=trText(v); if(t!=null) x.setAttribute(a,t); } }); }); }
function startTranslator(){ if(LANG!=='en') return; document.documentElement.lang='en';
  const go=()=>{ trNode(document.body); if(document.title&&CJK.test(document.title)){ const t=trText(document.title); if(t) document.title=t; }
    new MutationObserver(ms=>{ for(const m of ms){ if(m.type==='characterData') trNode(m.target); else m.addedNodes.forEach(trNode); } }).observe(document.body,{childList:true,subtree:true,characterData:true}); };
  if(window.I18N_EN) go(); else { const sc=document.createElement('script'); sc.src=ROOT+'/i18n-en.js'; sc.onload=go; (document.head||document.documentElement).appendChild(sc); } }
if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',startTranslator); else startTranslator();

/* ---------- speech ----------
   1) pre-recorded files made on the Mac with the high-quality voices (Yue / Zoe) → 配音/<key>.m4a, listed in 配音/index.js
   2) otherwise Chrome's built-in voices (婷婷 / Karen …)
   Every new line cuts off the previous one, so fast tapping never piles up voices. */
function voiceKey(text,lang){ const s=(lang.startsWith('zh')?'zh':'en')+'|'+String(text).trim(); let h=0x811c9dc5; for(const ch of s){ h^=ch.codePointAt(0); h=Math.imul(h,0x01000193)>>>0; } return h.toString(16).padStart(8,'0'); }
const VOICE_INDEX=new Set(); window.__voiceIndex=k=>{ (k||[]).forEach(x=>VOICE_INDEX.add(x)); };
(function(){ const sc=document.createElement('script'); sc.src=ROOT+'/配音/index.js?'+Date.now(); sc.onerror=()=>{}; (document.head||document.documentElement).appendChild(sc); })();
const SPOKEN=new Set(); window.__spoken=SPOKEN; // lines the game wanted to say (helps generate missing audio)
let curAudio=null, speakSeq=0;
function stopSpeech(){ speakSeq++; try{ curAudio&&curAudio.pause(); }catch(e){} curAudio=null; if('speechSynthesis' in window) speechSynthesis.cancel(); }
function voiceFor(lang){ const vs=speechSynthesis.getVoices();
  const names= lang.startsWith('zh') ? ['婷婷','Tingting','语舒','Yu-shu'] : ['Karen','Samantha','Moira','Daniel'];
  for(const n of names){ const v=vs.find(v=>v.name.startsWith(n)); if(v) return v; }
  const pref=lang.startsWith('zh')?['zh-CN','zh-TW']:['en-NZ','en-AU','en-GB','en-US'];
  for(const p of pref){ const v=vs.find(v=>v.lang.replace('_','-')===p); if(v) return v; } return vs.find(v=>v.lang.startsWith(lang.slice(0,2))); }
function playFile(src,seq,slow){ return new Promise(res=>{ const a=new Audio(src); if(slow) a.playbackRate=0.75; curAudio=a; let done=false; const fin=ok=>{ if(done) return; done=true; res(ok); };
  a.onended=()=>fin(true); a.onerror=()=>fin(false); a.play().catch(()=>fin(false)); setTimeout(()=>fin(true),20000); }); }
async function speak(text,lang='zh-CN',rate=0.95,opts={}){ duck(true); try{ return await speak0(text,lang,rate,opts); } finally{ duck(false); } }
async function speak0(text,lang='zh-CN',rate=0.95,{interrupt=true,slow=false,keepZh=false}={}){ text=String(text??'').trim(); if(!text) return;
  if(lang.startsWith('zh')&&!CJK.test(text)&&/[A-Za-z]{2}/.test(text)){ lang='en-NZ'; rate=Math.min(rate,0.92); }
  if(LANG==='en'&&!keepZh&&CJK.test(text)){ let t=trText(text); if(t!=null) t=t.replace(/《[^》]*》/g,'').replace(/\s+([!.,?])/g,'$1'); if(t!=null&&!CJK.test(t)){ text=t; lang='en-NZ'; rate=Math.min(rate,0.92); } else if(window.__onMissing) window.__onMissing(text); }
  if(interrupt) stopSpeech(); const seq=++speakSeq; SPOKEN.add((lang.startsWith('zh')?'zh':'en')+'\t'+text); try{ window.__onSpeak&&window.__onSpeak((lang.startsWith('zh')?'zh':'en')+'\t'+text); }catch(e){}
  const k=voiceKey(text,lang);
  if(VOICE_INDEX.has(k)){ const ok=await playFile(ROOT+'/配音/'+k+'.m4a',seq,slow||rate<0.7); if(ok||seq!==speakSeq) return; }
  if(seq!==speakSeq) return;
  return new Promise(res=>{ if(!('speechSynthesis' in window)) return res(); const u=new SpeechSynthesisUtterance(text); const v=voiceFor(lang); if(v){u.voice=v;u.lang=v.lang;} else u.lang=lang; u.rate=rate; u.onend=u.onerror=()=>res(); speechSynthesis.speak(u); setTimeout(res,15000); }); }
/* ---------- newcomer tour + first-visit guides by each place's animal teacher ---------- */
const TEACHERS={owl:{zh:'猫头鹰老师',en:'Ms Owl',img:'owl.webp'},panda:{zh:'熊猫先生',en:'Mr Panda',img:'panda.webp'},baker:{zh:'猫咪面包师',en:'Baker Cat',img:'baker.webp'},
  squirrel:{zh:'松鼠店长',en:'Squirrel the shopkeeper',img:'teachers/squirrel.webp'},bunny:{zh:'兔兔姐姐',en:'Bunny',img:'teachers/bunny.webp'},puppy:{zh:'狗狗园长',en:'Puppy the park keeper',img:'teachers/puppy.webp'},
  kangaroo:{zh:'袋鼠教练',en:'Coach Roo',img:'teachers/kangaroo.webp'},lamb:{zh:'小羊',en:'Little Lamb',img:'teachers/lamb.webp'},mayor:{zh:'大象镇长',en:'Mayor Elephant',img:'teachers/mayor.webp'}};
const TOUR=[
 {id:'spelling',who:'owl',zh:'去图书馆拼一组单词',en:'Spell one set of words at the Library'},
 {id:'chinese',who:'panda',zh:'去书院读一本小书',en:'Read a little book at the Chinese School'},
 {id:'math',who:'baker',zh:'去面包店做一轮点心',en:'Bake one round of treats at the Bakery'},
 {id:'shop',who:'squirrel',zh:'在杂货店当一次小店员',en:'Work one shift at the Shop till'},
 {id:'home',who:'bunny',zh:'去我的家看看衣柜',en:'Look in your wardrobe at My Home'},
 {id:'park',who:'puppy',zh:'去宠物乐园看看动物朋友',en:'Visit your animal friends at the Pet Park'},
 {id:'gym',who:'kangaroo',zh:'去健身房跟着练一次',en:'Do one workout at the Gym'},
 {id:'diary',who:'lamb',zh:'去你的小屋看看',en:'Visit your room'}];
const TOUR_CENTS=50;
const GUIDES={
 spelling:{key:'spelling',who:'owl',endZh:'开始拼写！',endEn:"Let's spell!",cards:[
  {tzh:'欢迎来到图书馆！',ten:'Welcome to the Library!',zh:'在这里练习<b>英文拼写</b>。每次拼一组单词，拼完可以得到零花钱，还有一个小印章。',en:'Here you practise <b>English spelling</b>. Each round is one set of words. Finish it to earn pocket money and a stamp.'},
  {tzh:'先准备好纸和笔',ten:'Get paper and a pencil',zh:'开始前，请准备好<b>一张纸和一支笔</b>。单词不是在屏幕上打字，而是要<b>写在纸上</b>。',en:'Before you start, get <b>a piece of paper and a pencil</b>. You do not type the words. You <b>write them on paper</b>.'},
  {tzh:'听一听，写下来',ten:'Listen and write',zh:'点<b>喇叭</b>听单词，在纸上写下来，再点「I wrote it!」。听不清可以点「Slow」慢一点，或者点「Show sentence」看例句。',en:'Tap the <b>speaker</b> to hear a word, write it on your paper, then tap "I wrote it!". Tap "Slow" or "Show sentence" if you need help.'},
  {tzh:'最后核对答案',ten:'Check your answers',zh:'一组写完，屏幕上会出现正确的拼写。把纸放在旁边，<b>一个字母一个字母地核对</b>。写错的单词，再在纸上改写一遍。',en:'When the set is done, the right spellings appear. Put your paper next to the screen and <b>check every letter</b>. Write any wrong word again.'}]},
 chinese:{key:'chinese',who:'panda',endZh:'去读书！',endEn:"Let's read!",cards:[
  {tzh:'欢迎来到书院！',ten:'Welcome to the Chinese School!',zh:'书墙上有一本本中文小书。<b>读通一本，下一本才会打开</b>。',en:'The bookshelf is full of little Chinese books. <b>Finish one book to unlock the next.</b>'},
  {tzh:'先听故事',ten:'Listen to the story',zh:'打开书，点「听故事」听一遍。<b>不认识的字点一下</b>，它会变红。',en:'Open a book and tap "Listen" to hear the story. <b>Tap any character you don\'t know</b> and it turns red.'},
  {tzh:'学字，再玩小游戏',ten:'Learn, then play',zh:'我会用图片、拼音和例句教你认这些字，然后玩几个小游戏测一测。',en:'I will teach you those characters with a picture, pinyin and a sentence. Then a few little games check what you remember.'},
  {tzh:'读通拿奖励',ten:'Earn a reward',zh:'小测验通过就算读通啦，可以得到零花钱。以后我还会提醒你复习学过的字。',en:'Pass the little test to finish the book and earn pocket money. Later I will remind you to review old characters.'}]},
 math:{key:'math',who:'baker',endZh:'开店啦！',endEn:'Open the shop!',cards:[
  {tzh:'欢迎来到面包店！',ten:'Welcome to the Bakery!',zh:'我们一起做点心卖给客人，要用<b>数学</b>帮忙哦。',en:'Let\'s bake treats for our customers. We need <b>maths</b> to help!'},
  {tzh:'看订单',ten:'Read the order',zh:'客人会点单，比如「每盘 5 个，要 3 盘」。数一数、算一算，一共要做多少个。',en:'A customer orders, for example "5 on each tray, 3 trays". Count and work out how many to bake.'},
  {tzh:'输入答案',ten:'Type the answer',zh:'用数字键盘输入答案，再按 ✓。算错了没关系，我会陪你一起数。',en:'Type your answer on the number pad and press ✓. If it is wrong, that\'s OK, we will count together.'},
  {tzh:'赚零花钱',ten:'Earn pocket money',zh:'一轮订单做完，就能得到零花钱。做得越准，钱越多！',en:'Finish a round of orders to earn pocket money. The more you get right, the more you earn!'}]},
 shop:{key:'shop',who:'squirrel',endZh:'知道啦！',endEn:'Got it!',cards:[
  {tzh:'欢迎来到杂货店！',ten:'Welcome to the Shop!',zh:'这里可以<b>买东西</b>，也可以<b>当小店员赚钱</b>。',en:'Here you can <b>buy things</b> or <b>work as a shop helper</b> to earn money.'},
  {tzh:'当小店员',ten:'Work at the till',zh:'点<b>收银台</b>去打工：客人来买东西，你来算一共多少钱、要找多少零钱。',en:'Tap the <b>till</b> to work: customers buy things, and you work out the total and the change.'},
  {tzh:'用自己挣的钱买',ten:'Spend what you earn',zh:'衣服、饰品和小动物用品都要用自己挣的零花钱买。钱不够？再去打工吧！',en:'Clothes, jewellery and pet things cost pocket money you have earned. Not enough? Do another shift!'}]},
 home:{key:'home',who:'bunny',endZh:'好的！',endEn:'OK!',cards:[
  {tzh:'欢迎回家！',ten:'Welcome home!',zh:'这里有你的<b>衣柜</b>和<b>首饰盒</b>。',en:'This is your <b>wardrobe</b> and <b>jewellery box</b>.'},
  {tzh:'换衣服',ten:'Change clothes',zh:'点一件衣服就能换上，小镇地图上的你也会穿上它。新衣服可以去杂货店买。',en:'Tap an outfit to put it on. You will wear it on the town map too. Buy new clothes at the Shop.'},
  {tzh:'戴饰品',ten:'Wear jewellery',zh:'买来的饰品放在首饰盒里，点一下戴上，再点一下摘下。',en:'Jewellery you buy goes in the box. Tap to put it on, tap again to take it off.'}]},
 park:{key:'park',who:'puppy',endZh:'去看看！',endEn:"Let's look!",cards:[
  {tzh:'欢迎来到宠物乐园！',ten:'Welcome to the Pet Park!',zh:'你的<b>动物朋友</b>都住在这里。点一点它们，和它们打个招呼吧。',en:'Your <b>animal friends</b> live here. Tap them to say hello.'},
  {tzh:'集印章，孵新朋友',ten:'Collect stamps, hatch a friend',zh:'在图书馆每拼完一组单词，就能得到一个<b>印章</b>。集满印章可以<b>孵一个蛋</b>，认识一个新朋友！',en:'Each set of words you spell at the Library gives you a <b>stamp</b>. Fill the card to <b>hatch an egg</b> and meet a new friend!'},
  {tzh:'布置乐园',ten:'Decorate the park',zh:'在杂货店买的小动物用品，会放进乐园里。',en:'Pet things you buy at the Shop will appear in the park.'}]},
 gym:{key:'gym',who:'kangaroo',endZh:'动起来！',endEn:"Let's move!",cards:[
  {tzh:'欢迎来到健身房！',ten:'Welcome to the Gym!',zh:'跟着我一起动一动，身体会越来越棒。',en:'Move along with me and get stronger every day.'},
  {tzh:'先找一块空地',ten:'Find some space',zh:'开始前，看看周围有没有足够的空地，<b>别撞到桌子和椅子</b>哦。',en:'Before you start, make sure you have room to move. <b>Watch out for tables and chairs!</b>'},
  {tzh:'跟着做',ten:'Follow along',zh:'选好每个动作做几秒、做几轮，点「开始跟练」。屏幕上出现什么动作，就跟着做。',en:'Choose how many seconds and rounds, then tap "Start". Copy each move on the screen.'},
  {tzh:'学会新本领',ten:'Learn new skills',zh:'练得越多，「我的本领」里会点亮越多新动作。',en:'The more you practise, the more moves light up in "My skills".'}]},
 diary:{key:'diary',who:'lamb',endZh:'写日记吧',endEn:"Let's write",cards:[
  {tzh:'这是你的小屋',ten:'This is your room',zh:'每天的游戏时间用完后，回到这里<b>写一篇日记</b>，记下今天的心情和发生的事。',en:'When your play time is up each day, come here to <b>write a diary page</b> about your day and how you feel.'},
  {tzh:'写好后你来决定',ten:'You decide who reads it',zh:'写完以后你可以选：给爸爸妈妈看，还是<b>只给自己看</b>。',en:'When you finish, you choose: share it with Mum and Dad, or keep it <b>just for you</b>.'},
  {tzh:'枕头上的信',ten:'Letters on your pillow',zh:'爸爸妈妈有时会给你回信，信会放在<b>枕头上</b>，点一下就能拆开。',en:'Sometimes Mum or Dad write back. The letter waits <b>on your pillow</b>. Tap it to open.'},
  {tzh:'晚安',ten:'Good night',zh:'写完日记说「晚安」，今天的小镇时间就结束啦，明天再来玩。',en:'Say "Good night" after your diary, and town time is over for today. See you tomorrow!'}]},
 town:{key:'town',who:'mayor',endZh:'出发！',endEn:"Let's go!",cards:[
  {tzh:'欢迎来到动物小镇！',ten:'Welcome to My Little Town!',zh:'我是大象镇长。小镇里每座房子都是一个游戏，<b>点房子就能进去</b>。',en:'I am Mayor Elephant. Every building is a game. <b>Tap a building to go in.</b>'},
  {tzh:'新手任务',ten:'Newcomer tasks',zh:'先完成<b>新手任务</b>：每个地方都去玩一次，每完成一个得 $0.50，全部完成还送你一件漂亮的饰品！',en:'First, try the <b>newcomer tasks</b>: play each place once. Each one earns $0.50, and finishing them all wins a pretty accessory!'},
  {tzh:'每个地方都有老师',ten:'A teacher in every place',zh:'第一次进去时，那里的动物老师会告诉你怎么玩。忘了的话，点右下角的 <b>?</b> 再听一遍。',en:'The first time you go in, an animal teacher explains how to play. Forgot? Tap the <b>?</b> button to hear it again.'},
  {tzh:'每日任务',ten:'Daily tasks',zh:'以后每天还会有几个小任务，看左上角的「今日任务」。',en:'Every day there are a few little tasks too. Look for "Today\'s Tasks" at the top.'}]}};

function tourInit(){ if(T.tour) return; const veteran=Object.keys(T.tasks||{}).length>0||(T.diary||[]).length>0||Object.keys((T.zh&&T.zh.books)||{}).length>0||((T.bake&&T.bake.sessions)||[]).length>0;
  T.tour=veteran?{skip:true}:{start:today(),done:{}}; save(); }
function tourActive(){ return !!(T&&T.tour&&!T.tour.skip&&!T.tour.finished); }
function tourMark(id){ if(!tourActive()||T.tour.done[id]) return false; const t=TOUR.find(x=>x.id===id); if(!t) return false;
  T.tour.done[id]=today(); earn(TOUR_CENTS,'新手任务：'+t.zh); T.tour.just=id;
  if(TOUR.every(x=>T.tour.done[x.id])){ T.tour.finished=today(); T.tour.prize=1; } save(); return true; }
function teacherImg(who){ const t=TEACHERS[who]||TEACHERS.owl; return ROOT+'/assets/'+t.img; }
function teacherName(who){ const t=TEACHERS[who]||TEACHERS.owl; return L(t.zh,t.en); }
function guideCss(){ if(document.getElementById('tc-guide-css')) return; const s=document.createElement('style'); s.id='tc-guide-css'; s.textContent=`
#tc-guide{position:fixed;inset:0;z-index:2147482000;background:rgba(48,36,60,.45);display:flex;align-items:center;justify-content:center;padding:18px;font-family:ui-rounded,"SF Pro Rounded","PingFang SC",system-ui,sans-serif;color:#3B3049;animation:tcgIn .25s}
@keyframes tcgIn{from{opacity:0}}
#tc-guide .wrap{display:flex;align-items:flex-end;gap:6px;max-width:860px;width:100%}
#tc-guide .who{flex:0 0 auto;height:min(62vh,400px);animation:tcgBob 2.6s ease-in-out infinite;filter:drop-shadow(0 10px 14px rgba(0,0,0,.25))}
@keyframes tcgBob{50%{transform:translateY(-8px) rotate(-1.5deg)}}
#tc-guide .bub{position:relative;flex:1;background:#FFF8EE;border-radius:28px;padding:24px 28px 20px;box-shadow:0 12px 40px rgba(0,0,0,.25);margin-bottom:8vh;min-height:220px;display:flex;flex-direction:column}
#tc-guide .bub:before{content:'';position:absolute;left:-16px;bottom:46px;border:16px solid transparent;border-right-color:#FFF8EE;border-left:0}
#tc-guide .nm{font-size:15px;font-weight:900;color:#B07A3C;letter-spacing:.03em}
#tc-guide .ttl{font-size:26px;font-weight:900;margin:4px 0 8px}
#tc-guide .tx{font-size:20px;line-height:1.55;flex:1}
#tc-guide .tx b{color:#E2664A}
#tc-guide .ft{display:flex;align-items:center;gap:10px;margin-top:16px}
#tc-guide .dots{flex:1;display:flex;gap:6px}#tc-guide .dots i{width:10px;height:10px;border-radius:50%;background:#E8DCCD}#tc-guide .dots i.on{background:#E2664A}
#tc-guide button{font:inherit;font-weight:900;font-size:19px;border:none;border-radius:999px;padding:12px 24px;cursor:pointer}
#tc-guide .nx{background:#FF8A6B;color:#fff;box-shadow:0 4px 0 #D96A4C}#tc-guide .bk{background:#F1EAE2;color:#6B5A48}#tc-guide .sk{background:none;color:#8A7F99;font-size:15px;padding:8px 10px}
#tc-help{position:fixed;bottom:14px;z-index:8999;width:52px;height:52px;border-radius:50%;border:none;background:rgba(255,255,255,.95);box-shadow:0 4px 0 rgba(0,0,0,.08),0 4px 14px rgba(0,0,0,.12);font:900 26px ui-rounded,system-ui;color:#B07A3C;cursor:pointer}
`; document.head.appendChild(s); }
// cards: [{zh,en,tzh,ten}] ; returns a promise when the child closes it
function guideShow(def){ return new Promise(res=>{ guideCss(); document.getElementById('tc-guide')?.remove(); let i=0; const d=document.createElement('div'); d.id='tc-guide';
  const n=def.cards.length; const draw=()=>{ const c=def.cards[i];
    d.innerHTML=`<div class="wrap"><img class="who" src="${teacherImg(def.who)}" alt=""><div class="bub"><div class="nm">${teacherName(def.who)}</div><div class="ttl">${L(c.tzh,c.ten)}</div><div class="tx">${L(c.zh,c.en)}</div>
      <div class="ft"><div class="dots">${def.cards.map((_,k)=>`<i class="${k===i?'on':''}"></i>`).join('')}</div>${i>0?`<button class="bk">${L('上一步','Back')}</button>`:`<button class="sk">${L('跳过','Skip')}</button>`}<button class="nx">${i<n-1?L('下一步 →','Next →'):L(def.endZh||'开始玩！',def.endEn||"Let's play!")}</button></div></div></div>`;
    stopSpeech(); const plain=s=>s.replace(/<[^>]+>/g,''); if(LANG==='en') speak(plain(c.ten)+'. '+plain(c.en),'en-NZ',0.95); else speakZh(plain(c.tzh)+'。'+plain(c.zh),{keepZh:true});
    d.querySelector('.nx').onclick=()=>{ if(i<n-1){ i++; draw(); } else close(); };
    const bk=d.querySelector('.bk'); if(bk) bk.onclick=()=>{ i--; draw(); };
    const sk=d.querySelector('.sk'); if(sk) sk.onclick=close; };
  const close=()=>{ stopSpeech(); d.remove(); if(def.key&&T){ T.guideSeen=T.guideSeen||{}; T.guideSeen[def.key]=today(); save(); } res(); };
  document.body.appendChild(d); draw(); }); }
// first visit: show automatically (not for veterans); always add a "?" button to replay
function guide(def,{auto=true,btn=true}={}){ guideCss();
  if(btn&&!document.getElementById('tc-help')){ const b=document.createElement('button'); b.id='tc-help'; b.textContent='?'; b.title=L('怎么玩','How to play'); b.setAttribute('aria-label','How to play');
    const left=document.documentElement.dataset.musPos==='left'; b.style[left?'left':'right']='76px'; b.onclick=()=>guideShow(def); document.body.appendChild(b); }
  const seen=T&&T.guideSeen&&T.guideSeen[def.key]; const vet=T&&T.tour&&T.tour.skip;
  if(auto&&!seen&&!vet) return guideShow(def); return Promise.resolve(); }
/* ---------- background music: one looping track per place (assets/music/<name>.mp3) ---------- */
let BG=null, BGname=null, duckN=0, bgWant=null;
function musicOn(){ return T&&T.settings&&T.settings.music!==false; }
function musicVol(){ return T&&T.settings&&T.settings.musicVol!=null?T.settings.musicVol:0.35; }
function bgTarget(){ return musicOn()?musicVol()*(duckN>0?0.3:1):0; }
const _bgT=bgTarget;
function fadeTo(a,v,ms=600){ if(!a) return; clearInterval(a._f); const st=a.volume, t0=performance.now(); a._f=setInterval(()=>{ const k=Math.min(1,(performance.now()-t0)/ms); a.volume=Math.max(0,Math.min(1,st+(v-st)*k)); if(k>=1){ clearInterval(a._f); a._f=null; if(v===0&&a._stopAfter) a.pause(); } },40); }
function bgm(name){ bgWant=name; if(name===BGname&&BG){ if(BG.paused&&musicOn()) BG.play().catch(()=>{}); fadeTo(BG,bgTargetQ()); return; }
  if(BG){ const old=BG; old._stopAfter=true; fadeTo(old,0,700); } BG=null; BGname=name; if(!name) return;
  const file=(T&&T.settings&&T.settings.musicAlt&&T.settings.musicAlt[name])||name; const a=new Audio(ROOT+'/assets/music/'+file+'.mp3'); a.loop=true; a.volume=0; a.onerror=()=>{ if(BG===a){ BG=null; } }; BG=a;
  const start=()=>{ if(BG!==a) return; a.play().then(()=>fadeTo(a,bgTargetQ(),1200)).catch(()=>{ addEventListener('pointerdown',start,{once:true}); }); }; start(); }
function duck(on){ duckN=Math.max(0,duckN+(on?1:-1)); if(BG) fadeTo(BG,bgTargetQ(),250); }
function setMusic(on,vol){ if(!T) return; if(on!=null) T.settings.music=!!on; if(vol!=null) T.settings.musicVol=vol; save(); if(BG){ if(musicOn()&&BG.paused) BG.play().catch(()=>{}); fadeTo(BG,bgTargetQ(),300); } else if(bgWant&&musicOn()) bgm(bgWant); }
// quiet while she is listening to a dictation word, and inside the parent centre
const QUIET_SEL='#practice.on,#parent.on,#pParent.on';
function bgTargetQ(){ return document.querySelector(QUIET_SEL)?0:bgTarget(); }
setInterval(()=>{ if(BG&&!BG._f) { const v=bgTargetQ(); if(Math.abs(BG.volume-v)>0.01) fadeTo(BG,v,400); } },500);
// a little music button for the child (bottom-right on every page; data-mus-pos="left" on <html> moves it): tap → on/off and a volume slider
function musicWidget(){ if(document.getElementById('tc-mus')) return; const w=document.createElement('div'); w.id='tc-mus';
  w.innerHTML=`<button class="b" aria-label="music">${icon('music')}</button><div class="pop"><button class="t"></button><input type="range" min="0" max="0.8" step="0.05"></div>`;
  const st=document.createElement('style'); st.textContent=`#tc-mus{position:fixed;right:14px;bottom:14px;flex-direction:row-reverse;z-index:9000;display:flex;align-items:center;gap:8px;font-family:ui-rounded,system-ui,"PingFang SC"}
#tc-mus .b{width:52px;height:52px;border-radius:50%;border:none;background:rgba(255,255,255,.94);box-shadow:0 4px 0 rgba(0,0,0,.12);font-size:26px;cursor:pointer;display:flex;align-items:center;justify-content:center}
#tc-mus.off .b{opacity:.5}#tc-mus .pop{display:none;align-items:center;gap:10px;background:rgba(255,255,255,.96);border-radius:999px;padding:8px 14px;box-shadow:0 4px 14px rgba(0,0,0,.15)}
#tc-mus.open .pop{display:flex}#tc-mus .t{border:none;border-radius:999px;padding:6px 14px;font:800 16px inherit;background:#FFE3D8;cursor:pointer}
#tc-mus input{width:150px;accent-color:#E2683F}`; document.head.appendChild(st); document.body.appendChild(w); if(document.documentElement.dataset.musPos==='left'){ w.style.right='auto'; w.style.left='14px'; w.style.flexDirection='row'; }
  const t=w.querySelector('.t'), r=w.querySelector('input');
  const draw=()=>{ const on=musicOn(); w.classList.toggle('off',!on); t.textContent=L(on?'音乐：开':'音乐：关',on?'Music: on':'Music: off'); r.value=musicVol(); r.disabled=!on; };
  w.querySelector('.b').onclick=()=>{ w.classList.toggle('open'); draw(); };
  t.onclick=()=>{ setMusic(!musicOn()); draw(); }; r.oninput=()=>setMusic(null,+r.value);
  document.addEventListener('pointerdown',e=>{ if(!w.contains(e.target)) w.classList.remove('open'); }); draw(); }
ready.then(()=>{ if(document.body) musicWidget(); else addEventListener('DOMContentLoaded',musicWidget); });
const AREA_TRACK={town:'town',spelling:'games',chinese:'games',math:'games',gym:'games',diary:'diary'};
ready.then(()=>{ if(!window.__noAutoMusic) bgm(AREA_TRACK[AREA]||'town'); });
addEventListener('visibilitychange',()=>{ if(!BG) return; if(document.hidden) BG.pause(); else if(musicOn()) BG.play().catch(()=>{}); });
function speakZh(t,o){ return speak(t,'zh-CN',0.95,o); }
function speakEn(t,rate=0.9){ return speak(t,'en-NZ',rate); }
if('speechSynthesis' in window) speechSynthesis.getVoices();

/* ---------- picture icons (assets/icons/*.png) instead of emoji ---------- */
function icon(n,cls=''){ return `<img class="tci ${cls}" src="${ROOT}/assets/icons/${n}.png" alt="" draggable="false">`; }
function ico(x){ return /^[a-z]+$/.test(String(x))?icon(x):String(x); }
(()=>{ const t2=document.createElement('style'); t2.textContent='html{touch-action:manipulation;-webkit-tap-highlight-color:transparent;-webkit-text-size-adjust:100%} button,.btn,[data-k],img{-webkit-user-select:none;user-select:none;-webkit-touch-callout:none}'; document.head.appendChild(t2); })();
(()=>{ const st=document.createElement('style'); st.textContent='img.tci{height:1.2em!important;width:1.2em!important;max-width:none!important;object-fit:contain;vertical-align:-.25em;display:inline-block;pointer-events:none;background:none!important;box-shadow:none!important;border:0!important;border-radius:0!important;margin:0!important;padding:0!important;filter:none}img.tci.big{height:1em!important;width:1em!important;vertical-align:middle}'; (document.head||document.documentElement).appendChild(st); })();

if(ONLINE_SITE){ try{ navigator.serviceWorker.register(ROOT+'/sw.js',{scope:ROOT+'/'}).catch(()=>{}); }catch(e){} }
const OFF_CACHE='mlt-offline';
async function offlineStatus(){ if(!ONLINE_SITE||!window.caches) return {supported:false};
  let m=null; try{ m=JSON.parse(localStorage.getItem('mlt_offline')||'null'); }catch(e){}
  let est=null; try{ est=navigator.storage&&await navigator.storage.estimate(); }catch(e){}
  return {supported:true,have:m,standalone:matchMedia('(display-mode: standalone)').matches||navigator.standalone===true,usage:est&&est.usage}; }
async function offlineDownload(onProg){
  if(!ONLINE_SITE) throw new Error('只能在网站上下载离线包');
  try{ navigator.storage&&navigator.storage.persist&&await navigator.storage.persist(); }catch(e){}
  const base=new URL(ROOT+'/',location.href);
  const list=await (await fetch(new URL('files.json',base),{cache:'no-store'})).json();
  const cache=await caches.open(OFF_CACHE);
  let prev={}; try{ prev=JSON.parse(localStorage.getItem('mlt_offline_h')||'{}'); }catch(e){}
  const todo=list.files.filter(f=>prev[f.p]!==f.h);
  const total=list.files.reduce((a,f)=>a+f.s,0); let done=list.files.filter(f=>prev[f.p]===f.h).reduce((a,f)=>a+f.s,0);
  let i=0, fail=0; const now={...prev};
  async function worker(){ while(i<todo.length){ const f=todo[i++]; const url=new URL(f.p.split('/').map(encodeURIComponent).join('/'),base).href;
      for(let t=0;t<3;t++){ try{ const r=await fetch(url,{cache:'no-store'}); if(!r.ok) throw new Error(r.status); await cache.put(url,r); now[f.p]=f.h; break; }catch(e){ if(t===2) fail++; } }
      done+=f.s; onProg&&onProg(done,total);
      if(i%200===0) try{ localStorage.setItem('mlt_offline_h',JSON.stringify(now)); }catch(e){} } }
  await Promise.all(Array.from({length:6},worker));
  for(const p of Object.keys(now)) if(!list.files.find(f=>f.p===p)) delete now[p];
  try{ localStorage.setItem('mlt_offline_h',JSON.stringify(now)); localStorage.setItem('mlt_offline',JSON.stringify({ver:list.ver,at:new Date().toISOString(),n:list.files.length,fail})); }catch(e){}
  return {fail,n:list.files.length};
}

/* tip on touch devices held upright: the town is designed for landscape */
(()=>{ const coarse=matchMedia('(pointer:coarse)').matches||navigator.maxTouchPoints>1; if(!coarse) return;
  const tip=()=>{ const old=document.getElementById('tc-rot'); if(old) old.remove(); if(innerHeight<=innerWidth||Math.min(screen.width,screen.height)<600) return;
    const d=document.createElement('div'); d.id='tc-rot'; d.textContent=(typeof LANG!=='undefined'&&LANG==='zh')?'把 iPad 横过来玩，画面更大更清楚 ↻':'Turn the iPad sideways for a bigger picture ↻';
    d.style.cssText='position:fixed;left:50%;top:14px;transform:translateX(-50%);z-index:99999;background:rgba(40,30,50,.85);color:#fff;font:600 16px/1.3 system-ui,sans-serif;padding:10px 18px;border-radius:20px;pointer-events:none;transition:opacity .6s';
    document.body.appendChild(d); setTimeout(()=>{ d.style.opacity='0'; setTimeout(()=>d.remove(),700); },4500); };
  addEventListener('load',()=>setTimeout(tip,600)); addEventListener('orientationchange',()=>setTimeout(tip,400)); })();
/* ---------- full progress backup (all IndexedDB stores of this site + mlt_* localStorage) ---------- */
async function enc(v){
  if(v instanceof Blob){ const u=await new Promise(r=>{ const f=new FileReader(); f.onload=()=>r(f.result); f.readAsDataURL(v); }); return {__t:'blob',type:v.type,data:u}; }
  if(v instanceof ArrayBuffer){ return {__t:'ab',data:btoa(String.fromCharCode(...new Uint8Array(v)))}; }
  if(v instanceof Date) return {__t:'date',data:v.toISOString()};
  if(Array.isArray(v)){ const o=[]; for(const x of v) o.push(await enc(x)); return o; }
  if(v&&typeof v==='object'){ const o={}; for(const k of Object.keys(v)) o[k]=await enc(v[k]); return o; }
  return v;
}
async function dec(v){
  if(Array.isArray(v)){ const o=[]; for(const x of v) o.push(await dec(x)); return o; }
  if(v&&typeof v==='object'){
    if(v.__t==='blob') return await (await fetch(v.data)).blob();
    if(v.__t==='ab'){ const b=atob(v.data); const a=new Uint8Array(b.length); for(let i=0;i<b.length;i++) a[i]=b.charCodeAt(i); return a.buffer; }
    if(v.__t==='date') return new Date(v.data);
    const o={}; for(const k of Object.keys(v)) o[k]=await dec(v[k]); return o;
  }
  return v;
}
function idbOpen(name,ver){ return new Promise((res,rej)=>{ const r=ver?indexedDB.open(name,ver):indexedDB.open(name); r.onsuccess=()=>res(r.result); r.onerror=()=>rej(r.error); r.onupgradeneeded=()=>{}; }); }
const req=q=>new Promise((res,rej)=>{ q.onsuccess=()=>res(q.result); q.onerror=()=>rej(q.error); });
async function dbNames(){ let names=['animaltown','spellingpals']; try{ if(indexedDB.databases){ const l=await indexedDB.databases(); l.forEach(d=>{ if(d.name&&!names.includes(d.name)) names.push(d.name); }); } }catch(e){} return names; }
async function backupExport(){
  await saveNow();
  const out={app:'mylittletown-backup',ver:1,at:new Date().toISOString(),child:T.childName||'',dbs:{},ls:{}};
  for(const name of await dbNames()){
    let d; try{ d=await idbOpen(name); }catch(e){ continue; }
    const info={version:d.version,stores:{}};
    for(const sn of Array.from(d.objectStoreNames)){
      const st=d.transaction(sn).objectStore(sn);
      const keys=await req(st.getAllKeys()); const vals=await req(st.getAll());
      const rows=[]; for(let i=0;i<keys.length;i++) rows.push([keys[i],await enc(vals[i])]);
      info.stores[sn]={keyPath:st.keyPath,autoIncrement:st.autoIncrement,rows};
    }
    d.close(); out.dbs[name]=info;
  }
  try{ for(let i=0;i<localStorage.length;i++){ const k=localStorage.key(i); if(/^mlt_/.test(k)) out.ls[k]=localStorage.getItem(k); } }catch(e){}
  const b=new Blob([JSON.stringify(out)],{type:'application/json'});
  const a=document.createElement('a'); a.href=URL.createObjectURL(b);
  a.download=`动物小镇进度-${(T.childName||'').replace(/[^\w一-鿿]/g,'')||'backup'}-${today()}.json`;
  document.body.appendChild(a); a.click(); setTimeout(()=>{ URL.revokeObjectURL(a.href); a.remove(); },2000);
  return out;
}
async function backupImport(file){
  const data=JSON.parse(await file.text());
  if(!data||data.app!=='mylittletown-backup'||!data.dbs) throw new Error('bad-file');
  clearTimeout(saveTimer);
  if(dbp){ try{ (await dbp).close(); }catch(e){} dbp=null; }
  for(const [name,info] of Object.entries(data.dbs)){
    const d=await new Promise((res,rej)=>{ const r=indexedDB.open(name,info.version||1);
      r.onupgradeneeded=()=>{ for(const [sn,si] of Object.entries(info.stores)) if(!r.result.objectStoreNames.contains(sn)) r.result.createObjectStore(sn,si.keyPath?{keyPath:si.keyPath,autoIncrement:si.autoIncrement}:{autoIncrement:!!si.autoIncrement}); };
      r.onsuccess=()=>res(r.result); r.onerror=()=>rej(r.error); r.onblocked=()=>rej(new Error('blocked')); });
    for(const [sn,si] of Object.entries(info.stores)){
      if(!d.objectStoreNames.contains(sn)) continue;
      const rows=[]; for(const [k,v] of si.rows) rows.push([k,await dec(v)]);
      await new Promise((res,rej)=>{ const t=d.transaction(sn,'readwrite'); const st=t.objectStore(sn); st.clear(); for(const [k,v] of rows){ if(st.keyPath) st.put(v); else st.put(v,k); } t.oncomplete=()=>res(); t.onerror=()=>rej(t.error); });
    }
    d.close();
  }
  try{ for(const [k,v] of Object.entries(data.ls||{})) localStorage.setItem(k,v); }catch(e){}
  return data;
}
window.TownCore = { GUIDES, TOUR, TEACHERS, tourActive, tourMark, teacherImg, teacherName, guide, guideShow, offlineStatus, offlineDownload, ONLINE_SITE, backupExport, backupImport, diaryOpen, icon, ico, bgm, setMusic, musicOn, musicVol, setArea, addStamp, stampsToward, hatchShow, ready, get state(){ return T; }, save, saveNow, today, fmt, earn, spend, GAMES, GOALS, tasksToday, allDone, taskDone, eggsAvailable, STAMPS_PER_EGG,
  startTimer, usedSec, limitSec, remainingSec, overtime, guard, afterReward, showNight, showBanner, askPin, parentPass, lang, setLang, L, trText, speak, speakZh, speakEn, stopSpeech, voiceKey, animalStyle, ROOT };
})();
