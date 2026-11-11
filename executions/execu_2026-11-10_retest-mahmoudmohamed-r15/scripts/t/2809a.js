const reqs=[]; page.on('response', async r=>{ const u=r.url(); if(/audit/.test(u) && r.request().method()==='GET') { let j=null; try{ j=await r.json(); }catch(e){} reqs.push({u:u.replace(/.*api\/v1/,''), s:r.status(), n: j&&Array.isArray(j.data)?j.data.length:null, apps: j&&Array.isArray(j.data)?[...new Set(j.data.map(x=>x.app_key))].join(','):null, targets: j&&Array.isArray(j.data)?[...new Set(j.data.map(x=>x.target_type))].slice(0,15).join(','):null}); } });
await page.goto(H + '/settings/security/audit-log', { waitUntil: 'domcontentloaded' });
for (let i=0;i<30;i++){ await sleep(2000); if (/Audit Log/.test(await text()) && /ndc-staging-owner|Today|ago/.test(await text())) break; } await sleep(4000);
await shot('2809-audit-log.png');
const t = await text(); const lines = t.split('\n').filter(l=>/global set|Global Set|QA RT15|lead|Lead|Macro|CLV|phone|Wonder Travel|field_draft|CRM/i.test(l)).slice(0,25);
log('suspect lines', lines);
log('reqs', reqs);
const s = page.getByPlaceholder(/Search/i).first(); if (await s.count()) { await s.fill('QA RT15 GS'); await page.keyboard.press('Enter'); await sleep(5000); log('search GS', (await text()).split('\n').filter(l=>/QA RT15 GS/.test(l)).slice(0,10)); await shot('2809-search-gs.png'); }
