const LEADS = '841043e1-c078-41f9-8d6e-dfd61bee45c3';
const res = { runs: [] };
for (const lang of ['ar', 'en', 'ar']) {
  await page.evaluate(l => localStorage.setItem('anyware_language', l), lang);
  const net = []; const on = r => { if (/\/records|\/views|query/.test(r.url())) net.push(r.status() + ' ' + r.request().method() + ' ' + r.url().replace(/^.*\/api\/v1/, '').slice(0, 90) + ' ' + Math.round((Date.now() - t0) / 100) / 10 + 's'); }; 
  const t0 = Date.now(); page.on('response', on);
  await page.goto(H + '/modules/' + LEADS, { waitUntil: 'domcontentloaded' });
  let t = '', at = -1; for (let i = 0; i < 60; i++) { await sleep(1000); t = (await page.innerText('main')).replace(/\s+/g, ' '); if (/\d+ records|[\u0660-\u0669]+ سجل/.test(t)) { at = (Date.now() - t0) / 1000; break; } }
  page.off('response', on);
  res.runs.push({ lang, countAt: at, count: (t.match(/[\d\u0660-\u0669]+ (records|سجل\S*)/) || ['none'])[0], empty: /لا توجد سجلات|No records/.test(t), net: net.slice(0, 8) });
  await shot('leads-' + lang + '-' + res.runs.length);
}
await page.evaluate(() => localStorage.setItem('anyware_language', 'en'));
return res;
