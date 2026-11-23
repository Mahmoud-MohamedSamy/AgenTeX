const fs=require('fs'); const OUT='C:/Users/Dell/AppData/Local/Temp/claude/f6c7cad13fb47571/64533306-cf5e-4d09-aa5c-24702973a047/scratchpad/r20vr-bundle';
const base='https://staging-desk.taviportal.com';
(async()=>{ const seen=new Set(); const q=['/']; let n=0;
 while(q.length&&n<400){ const p=q.shift(); if(seen.has(p))continue; seen.add(p); let t; try{ const r=await fetch(base+p); if(r.status!==200) continue; t=await r.text(); }catch(e){continue;} n++;
  if(p.endsWith('.js')) fs.writeFileSync(OUT+'/'+p.replace(/[\/]/g,'_'),t);
  for(const m of t.matchAll(/["'(]((?:\/|\.\/)?(?:assets|_next\/static|static)\/[^"')\s]+?\.js)["')]/g)){ let u=m[1].startsWith('/')?m[1]:'/'+m[1].replace(/^\.\//,''); if(!seen.has(u)) q.push(u);} 
  for(const m of t.matchAll(/"(\/_next\/static\/chunks\/[^"]+?\.js)"/g)) q.push(m[1]);
 } console.log('fetched',n); })();
