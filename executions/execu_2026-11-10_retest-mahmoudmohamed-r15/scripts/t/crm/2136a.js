const mods = { Leads:'841043e1-c078-41f9-8d6e-dfd61bee45c3', Transactions:'f42cbafd-ab4e-4a6b-a40c-02c1d0ecb430' };
const errs=[]; page.on('response', r => { if (/api\/v1\/modules\/.*\/records\?/.test(r.url()) && r.status()>=400) errs.push(r.status()+' '+r.url().replace(/^https:\/\/[^/]+/,'').slice(0,160)); });
const pct = (a,p) => { const s=[...a].sort((x,y)=>x-y); const i=Math.min(s.length-1, Math.ceil(p/100*s.length)-1); return s[i]; };
const res={};
for (const [name,id] of Object.entries(mods)) {
  const times=[]; let viewInfo='';
  for (let i=0;i<11;i++){
    const t0=Date.now(); await page.goto(H+'/modules/'+id, { waitUntil:'commit' });
    try { await page.waitForFunction(() => { const r=document.querySelector('tbody tr td'); return r && document.querySelectorAll('tbody tr').length>1 && !/Loading/.test(document.querySelector('tbody').innerText); }, null, { timeout: 60000, polling: 100 }); times.push((Date.now()-t0)/1000); }
    catch(e) { times.push(-1); }
    if (i===0) { viewInfo = ((await text()).match(/\d[\d,]* records/)||[''])[0] + ' ' + (await page.locator('button', {hasText:/All |view/i}).first().innerText().catch(()=>'')); await shot('NDC-2136-'+name+'.png'); }
    await sleep(1500);
  }
  const m = times.slice(1).filter(x=>x>=0);
  res[name] = { warmup: times[0], loads: times.slice(1), p50: pct(m,50), p95: pct(m,95), max: Math.max(...m), info: viewInfo };
}
res.errors = errs.slice(0,10);
return res;
