out.api = {};
for (const p of ['/v2/flights/search?origin=CAI&destination=DXB&departureDate=2026-11-12&adults=1', '/v2/bookings', '/flights/search?origin=CAI&destination=DXB&departureDate=2026-11-12&adults=1', '/bookings'])
  { const r = await api('GET', p); out.api['GET /api/v1' + p.split('?')[0]] = r.s + ' ' + r.t.slice(0, 160); }
out.host = {};
for (const p of ['/v2/flights/search?origin=CAI&destination=DXB', '/v2/bookings', '/api/v2/flights/search', '/api/v2/bookings']) {
  out.host[p.split('?')[0]] = await page.evaluate(async u => { const r = await fetch(u, { credentials: 'include' }); const t = await r.text(); return r.status + ' ' + (r.headers.get('content-type') || '') + ' ' + (t.includes('<div id="root"') ? '(SPA index.html)' : t.slice(0, 120)); }, p); }
// UI routes
out.ui = {};
for (const p of ['/v2/flights/search', '/v2/bookings', '/flights', '/bookings']) { await page.goto(B + p, { waitUntil: 'domcontentloaded' }); await sleep(5000); out.ui[p] = page.url().replace(B, '') + ' | ' + (await page.innerText('main').catch(() => '')).replace(/\s+/g, ' ').slice(0, 80); }
await page.screenshot({ path: RAW + 'flights-redirect.png' });
// custom actions page (where the SkyRoutes "Search flights" / "Book offer" actions live in the build's demo data)
await page.goto(B + '/settings/developer/custom-actions', { waitUntil: 'domcontentloaded' });
for (let i = 0; i < 30; i++) { await sleep(1000); const t = await page.innerText('main').catch(() => ''); if (t.length > 80 && !/Loading/.test(t)) break; }
out.customActions = (await page.innerText('main')).replace(/\s+/g, ' ').slice(0, 900);
await page.screenshot({ path: RAW + 'custom-actions.png' });
out.capabilities = (await api('GET', '/capabilities')).t.slice(0, 600);
