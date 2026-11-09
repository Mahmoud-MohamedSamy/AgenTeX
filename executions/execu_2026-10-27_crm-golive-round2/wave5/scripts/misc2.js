const LEADS = '841043e1-c078-41f9-8d6e-dfd61bee45c3', DEALS = 'f42cbafd-ab4e-4a6b-a40c-02c1d0ecb430';
const res = {};
const bad = []; const on = r => { if (r.status() >= 400 || r.url().includes('/records')) bad.push(r.status() + ' ' + r.request().method() + ' ' + r.url().replace(/^.*\/api\/v1/, '').slice(0, 80)); }; page.on('response', on);
const t0 = Date.now(); await page.goto(H + '/modules/' + LEADS, { waitUntil: 'domcontentloaded' });
let t = ''; for (let i = 0; i < 45; i++) { await sleep(1000); t = (await page.innerText('main')).replace(/\s+/g, ' '); if (/\d+ records/.test(t)) break; }
res.leadsEn = { secs: (Date.now() - t0) / 1000, head: t.slice(0, 200) }; page.off('response', on); res.net = bad.slice(0, 10);
await shot('leads-en');
await page.goto(H + '/settings/modules-and-fields/' + LEADS, { waitUntil: 'domcontentloaded' }); await sleep(4000);
await page.locator('main button, main [role=tab], main a', { hasText: /Lead Conversion/ }).first().click(); 
for (let i = 0; i < 30; i++) { await sleep(1000); t = (await page.innerText('main')).replace(/\s+/g, ' '); if (!/Summary Loading/.test(t)) break; }
res.conv = t.slice(t.indexOf('Lead Conversion Mapping'), t.indexOf('Lead Conversion Mapping') + 1500);
await shot('c01-1229-conversion');
return res;
