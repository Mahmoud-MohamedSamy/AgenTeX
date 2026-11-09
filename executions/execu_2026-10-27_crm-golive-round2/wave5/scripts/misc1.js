const LEADS = '841043e1-c078-41f9-8d6e-dfd61bee45c3', DEALS = 'f42cbafd-ab4e-4a6b-a40c-02c1d0ecb430';
const res = {};
// C11 / NDC-2386: direct load and reload
for (const k of ['direct', 'reload']) { const t0 = Date.now(); if (k === 'direct') await page.goto(H + '/settings/pipelines', { waitUntil: 'domcontentloaded' }); else await page.reload({ waitUntil: 'domcontentloaded' });
  let t = ''; for (let i = 0; i < 30; i++) { await sleep(1000); t = (await page.innerText('main')).replace(/\s+/g, ' '); if (!/Loading board/.test(t) && /Pipeline/.test(t) && /Standard|Stage|Qualification/i.test(t)) break; }
  res['pipelines_' + k] = { secs: (Date.now() - t0) / 1000, loading: /Loading board/.test(t), text: t.slice(t.indexOf('Manage Pipelines'), t.indexOf('Manage Pipelines') + 400) }; }
await shot('c11-pipelines');
// Arabic Leads list + Deals board (NDC-2130 / 2131)
await page.evaluate(() => localStorage.setItem('anyware_language', 'ar'));
await page.goto(H + '/modules/' + LEADS, { waitUntil: 'domcontentloaded' }); await sleep(12000);
let t = (await page.innerText('main')).replace(/\s+/g, ' '); res.leadsAr = (t.match(/[\u0660-\u0669]+ سجل[^ ]*/) || ['no count'])[0] + ' | ' + (t.match(/ترتيب[^|]{0,40}/) || ['no sort'])[0] + ' | english: ' + [...new Set(t.match(/\b(records?|Sort|desc|asc|created_at)\b/g) || [])].join(',');
await shot('c16-ar-leads');
await page.goto(H + '/modules/' + DEALS + '?view=kanban', { waitUntil: 'domcontentloaded' }); await sleep(12000);
t = (await page.innerText('main')).replace(/\s+/g, ' '); res.dealsAr = t.slice(0, 300);
res.dealsLayoutAria = await page.$$eval('[aria-label]', es => [...new Set(es.map(e => e.getAttribute('aria-label')))].filter(a => /Layout|التخطيط|Pipeline|المسار/.test(a)).slice(0, 8));
await shot('c16-ar-deals');
await page.evaluate(() => localStorage.setItem('anyware_language', 'en'));
// NDC-1229: Leads > Lead Conversion Mapping (read only)
await page.goto(H + '/settings/modules-and-fields/' + LEADS, { waitUntil: 'domcontentloaded' }); await sleep(5000);
const tabs = await page.$$eval('main button, main [role=tab], main a', bs => bs.map(b => b.innerText.trim()).filter(x => x && x.length < 40));
res.leadsTabs = [...new Set(tabs)].filter(x => /Conversion|Mapping/i.test(x));
const tab = page.locator('main button, main [role=tab], main a', { hasText: /Lead Conversion/ }).first();
if (await tab.count()) { await tab.click(); await sleep(4000); const x = (await page.innerText('main')).replace(/\s+/g, ' '); res.conv = x.slice(x.indexOf('Lead Conversion'), x.indexOf('Lead Conversion') + 1200); await shot('c01-1229-conversion'); }
return res;
