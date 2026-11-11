const mods = { Leads:['841043e1-c078-41f9-8d6e-dfd61bee45c3','All Leads'], Transactions:['f42cbafd-ab4e-4a6b-a40c-02c1d0ecb430','All Transactions'] };
const errs=[]; page.on('response', r => { if (/api\/v1\/modules\/.*\/records\?/.test(r.url()) && r.status()>=400) errs.push(r.status()+' '+decodeURIComponent(r.url().replace(/^https:\/\/[^/]+/,'')).slice(0,220)); });
const pct = (a,p) => { const s=[...a].sort((x,y)=>x-y); return s[Math.min(s.length-1, Math.ceil(p/100*s.length)-1)]; };
const res={};
for (const [name,[id,allName]] of Object.entries(mods)) {
  await page.goto(H+'/modules/'+id, { waitUntil:'domcontentloaded' }); for (let i=0;i<40;i++){ await sleep(2000); if (/records/.test(await text())) break; }
  await sleep(2000);
  const lv = page.getByRole('button', {name:'List view'}); if (await lv.count()) { await lv.first().click(); await sleep(4000); }
  const cur = await text();
  if (!new RegExp(allName).test(cur.slice(0, 3000))) { await page.locator('button', {hasText:/QA RT15 2807 view|Kanban View|All /}).first().click().catch(()=>{}); await sleep(1500); await page.getByText(allName, {exact:true}).last().click().catch(e=>log('viewpick', String(e).slice(0,60))); await sleep(5000); }
  log(name, 'mode/view', ((await text()).match(new RegExp(allName))||['?'])[0], ((await text()).match(/[\d,]+ records/)||[''])[0]);
  const times=[];
  for (let i=0;i<11;i++){
    const t0=Date.now(); await page.goto(H+'/modules/'+id, { waitUntil:'commit' });
    try { await page.waitForFunction(() => { const rows=[...document.querySelectorAll('tbody tr')]; return rows.length>2 && rows[0].querySelectorAll('td').length>3 && !/Loading|No records|Could not load/i.test(document.querySelector('tbody').innerText); }, null, { timeout: 60000, polling: 100 }); times.push((Date.now()-t0)/1000); }
    catch(e) { times.push(-1); }
    if (i===1) await shot('NDC-2136-'+name+'-list.png');
    await sleep(1500);
  }
  const m = times.slice(1).filter(x=>x>=0);
  res[name] = { warmup: times[0], loads: times.slice(1), p50: m.length?pct(m,50):null, p95: m.length?pct(m,95):null, failed: times.slice(1).filter(x=>x<0).length };
}
res.errors = [...new Set(errs)].slice(0,6);
return res;
