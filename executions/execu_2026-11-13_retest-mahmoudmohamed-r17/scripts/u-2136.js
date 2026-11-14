const mods = { Leads:['841043e1-c078-41f9-8d6e-dfd61bee45c3','All Leads'] };
const pct = (a,p) => { const s=[...a].sort((x,y)=>x-y); return s[Math.min(s.length-1, Math.ceil(p/100*s.length)-1)]; };
const res={};
for (const [name,[id,allName]] of Object.entries(mods)) {
  await page.goto(H+'/modules/'+id+'?view=31de7169-d1c1-44af-adad-73c7d711719c', { waitUntil:'domcontentloaded' }); for (let i=0;i<40;i++){ await sleep(2000); if (/[1-9][d,]* records/.test(await text())) break; }
  await sleep(3000);
  const t1 = await text();
  if (!t1.includes(allName)) { await page.getByText(/^Choose a view$|^QA RT17 2807 view$/).first().click().catch(e=>log('chooser',String(e).slice(0,60))); await sleep(2000); const o = page.getByText(allName, {exact:true}).last(); log('opt', await o.count()); await o.click().catch(e=>log('pick',String(e).slice(0,60))); await sleep(6000); }
  log(name, 'view', (await text()).includes(allName), ((await text()).match(/[\d,]+ records/)||[''])[0]);
  const times=[];
  for (let i=0;i<11;i++){
    const t0=Date.now(); await page.goto(H+'/modules/'+id, { waitUntil:'commit' });
    try { await page.waitForFunction(() => { const r=document.querySelector('tbody tr'); if(!r) return false; const cells=[...r.querySelectorAll('td')].map(td=>td.innerText.trim()).filter(Boolean); return cells.length>=2 && !/Loading|No records|Could not load/i.test(document.querySelector('tbody').innerText); }, null, { timeout: 60000, polling: 100 }); times.push((Date.now()-t0)/1000); }
    catch(e) { times.push(-1); }
    if (i===1) await shot('2136-'+name+'-list.png');
    await sleep(1500);
  }
  const m = times.slice(1).filter(x=>x>=0);
  res[name] = { warmup: times[0], loads: times.slice(1), p50: m.length?pct(m,50):null, p95: m.length?pct(m,95):null, failed: times.slice(1).filter(x=>x<0).length, records: ((await text()).match(/[\d,]+ records/)||[''])[0] };
}
return res;
