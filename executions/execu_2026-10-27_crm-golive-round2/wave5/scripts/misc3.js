const LEADS = '841043e1-c078-41f9-8d6e-dfd61bee45c3', DEALS = 'f42cbafd-ab4e-4a6b-a40c-02c1d0ecb430';
const res = {};
await page.evaluate(() => localStorage.setItem('anyware_language', 'ar'));
await page.goto(H + '/modules/' + LEADS, { waitUntil: 'domcontentloaded' });
let t = ''; for (let i = 0; i < 45; i++) { await sleep(1000); t = (await page.innerText('main')).replace(/\s+/g, ' '); if (/سجل/.test(t) && !/التحميل/.test(t.slice(0, 50))) break; }
res.leadsAr = (t.match(/[\u0660-\u0669\d]+ ?سجل[^ ]*/) || ['no count'])[0] + ' | ' + (t.match(/ترتيب:[^|]{0,40}/) || ['no sort'])[0] + ' | english: ' + [...new Set(t.match(/\b(records?|Sort|desc|asc|created_at|Created Time|Descending)\b/g) || [])].join(',');
await shot('c16-ar-leads');
await page.goto(H + '/modules/' + DEALS, { waitUntil: 'domcontentloaded' });
for (let i = 0; i < 45; i++) { await sleep(1000); t = (await page.innerText('main')).replace(/\s+/g, ' '); if (/سجل/.test(t)) break; }
res.dealsAr = (t.match(/[\u0660-\u0669\d]+ ?سجل[^ ]*/) || ['no count'])[0] + ' | ' + t.slice(0, 200);
res.aria = await page.$$eval('[aria-label]', es => [...new Set(es.map(e => e.getAttribute('aria-label')))].filter(a => /Layout|التخطيط/.test(a)).slice(0, 5));
await shot('c16-ar-deals');
await page.evaluate(() => localStorage.setItem('anyware_language', 'en'));
return res;
