const D='f42cbafd-ab4e-4a6b-a40c-02c1d0ecb430';
const st={}; page.on('response', r => { const u=decodeURIComponent(r.url()); if (/\/modules\/[^/]+\/records\?/.test(u) && /"stage"/.test(u)) { const k=(/skip_total=true/.test(u)?'skip_total ':'')+'column '+r.status(); st[k]=(st[k]||0)+1; } });
const pct = (a,p) => { const s=[...a].sort((x,y)=>x-y); return s[Math.min(s.length-1, Math.ceil(p/100*s.length)-1)]; };
await page.goto(H+'/modules/'+D, { waitUntil:'domcontentloaded' }); for (let i=0;i<40;i++){ await sleep(2000); if (/records/.test(await text())) break; } await sleep(2000);
await page.getByRole('button', {name:'Kanban view', exact:true}).first().click(); await sleep(6000);
log('mode', /Probability \d+%/.test(await text()) ? 'kanban' : 'not kanban');
const hdr=[], cards=[], fails=[];
for (let i=0;i<9;i++){
  const t0=Date.now(); await page.goto(H+'/modules/'+D, { waitUntil:'commit' });
  let th=-1, tc=-1, tf=-1;
  for (let k=0;k<300;k++){ await sleep(150);
    const b = await page.evaluate(() => document.body.innerText).catch(()=> '');
    const el=(Date.now()-t0)/1000;
    if (th<0 && /Probability \d+%/.test(b) && /Amount\s+[\d,.]+/.test(b)) th=el;
    if (th>=0 && tc<0 && /Qualification[\s\S]*AEX-01/.test(b)) tc=el;
    if (th>=0 && tf<0 && /Could not load these records/.test(b)) tf=el;
    if (th>=0 && (tc>=0 || tf>=0)) break;
    if (el>45) break;
  }
  hdr.push(th); cards.push(tc); fails.push(tf);
  if (i===1) await shot('2137-kanban.png');
  await sleep(1000);
}
const h=hdr.slice(1).filter(x=>x>=0), c=cards.slice(1).filter(x=>x>=0);
return { headers:{ loads:hdr.slice(1), p50:h.length?pct(h,50):null, p95:h.length?pct(h,95):null }, firstCards:{ loads:cards.slice(1), p50:c.length?pct(c,50):null, p95:c.length?pct(c,95):null }, couldNotLoadAt: fails.slice(1), columnRequests: st };
