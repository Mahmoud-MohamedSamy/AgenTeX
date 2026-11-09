const call = (m, u, b) => page.evaluate(async ([m, u, b]) => { const tok = decodeURIComponent((document.cookie.match(/aw_staging_access_token=([^;]+)/) || [, ''])[1]);
  const r = await fetch(u, { method: m, headers: { Authorization: 'Bearer ' + tok, 'x-tenant-id': 'a7a7a7a7-0000-0000-0000-000000000004', 'x-app-key': 'crm', 'content-type': 'application/json' }, body: b ? JSON.stringify(b) : undefined }); return r.status + ' ' + (await r.text()).slice(0, 250); }, [m, u, b]);
out.r = {};
out.r['GET /api/v2/flights/search'] = await call('GET', '/api/v2/flights/search?origin=CAI&destination=DXB&departureDate=2026-11-12&adults=1');
out.r['GET /api/v2/bookings'] = await call('GET', '/api/v2/bookings');
out.r['GET /api/v2/anything'] = await call('GET', '/api/v2/qa-r2sc-nonexistent');
out.r['GET /api/v2/modules'] = await call('GET', '/api/v2/modules');
out.r['POST /api/v2/bookings {}'] = await call('POST', '/api/v2/bookings', {});
// custom actions tabs: Actions / API sources
await page.locator('main button:has-text("API sources"), main [role=tab]:has-text("API sources")').first().click().catch(e => out.e = String(e.message).slice(0, 60)); await sleep(3000);
out.sources = (await page.innerText('main')).replace(/\s+/g, ' ').match(/Custom Actions.{0,600}/)?.[0];
await page.screenshot({ path: RAW + 'custom-actions-sources.png' });
