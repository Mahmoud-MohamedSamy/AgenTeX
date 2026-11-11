const D='f42cbafd-ab4e-4a6b-a40c-02c1d0ecb430'; const V='568be7a1-729a-4ecc-976c-59296c7af9b2';
const st={}; page.on('response', r => { const u=r.url(); if (/\/modules\/[^/]+\/records\?/.test(u)) { const k=(/skip_total=true/.test(u)?'skip_total':'normal')+' '+r.status(); st[k]=(st[k]||0)+1; } });
const pct = (a,p) => { const s=[...a].sort((x,y)=>x-y); return s[Math.min(s.length-1, Math.ceil(p/100*s.length)-1)]; };
const hdr=[], cards=[];
for (let i=0;i<9;i++){
  const t0=Date.now(); await page.goto(H+'/modules/'+D+'?view='+V, { waitUntil:'commit' });
  let th=-1, tc=-1;
  for (let k=0;k<400;k++){ await sleep(150);
    const s = await page.evaluate(() => { const b=document.body.innerText; return { h: /Qualification|Needs Analysis|qualification/i.test(b) && /(EGP|\$|USD|Amount|Total)/.test(b), c: document.querySelectorAll('[data-kanban-card], [data-testid*=card], [class*=kanban-card], [class*=KanbanCard]').length, err: /unexpected error/i.test(b), empty: (b.match(/No records|No cards|Nothing here/gi)||[]).length }; }).catch(()=>({}));
    const el=(Date.now()-t0)/1000;
    if (th<0 && s.h) th=el;
    if (tc<0 && s.c>0) tc=el;
    if (th>=0 && (tc>=0 || el>30)) { if (i===0) { st.cardsSel=s.c; st.err=s.err; st.empty=s.empty; } break; }
  }
  hdr.push(th); cards.push(tc);
  if (i===0) await shot('NDC-2137-kanban.png');
  await sleep(1000);
}
await shot('NDC-2137-kanban-last.png');
const h=hdr.slice(1).filter(x=>x>=0), c=cards.slice(1).filter(x=>x>=0);
return { headers:{ loads:hdr.slice(1), p50:pct(h,50), p95:pct(h,95)}, cards:{ loads:cards.slice(1), p50:c.length?pct(c,50):null, p95:c.length?pct(c,95):null }, requests: st };
