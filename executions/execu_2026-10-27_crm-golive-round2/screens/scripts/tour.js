const L = '841043e1-c078-41f9-8d6e-dfd61bee45c3';
const routes = ['/', '/modules/' + L, '/modules/' + L + '/records/new', '/settings', '/reports', '/dashboards', '/workqueue', '/v2/flights/search', '/v2/bookings', '/calendar'];
out.r = [];
for (const r of routes) {
  const calls = []; const h = q => { const u = q.url(); if (u.includes('/api/v1/')) calls.push(q.method() + ' ' + u.split('/api/v1')[1].slice(0, 90)); };
  page.on('request', h);
  const t0 = Date.now();
  await page.goto(B + r, { waitUntil: 'domcontentloaded', timeout: 60000 });
  await sleep(9000);
  page.off('request', h);
  const t = await page.evaluate(() => { const m = document.querySelector('main') || document.body; return m.innerText.replace(/\s+/g, ' ').slice(0, 400); });
  out.r.push({ r, url: page.url().replace(B, ''), t, calls: [...new Set(calls)].slice(0, 25) });
  await page.screenshot({ path: RAW + 'tour' + r.replace(/[\/]/g, '_').slice(0, 40) + '.png' });
}
