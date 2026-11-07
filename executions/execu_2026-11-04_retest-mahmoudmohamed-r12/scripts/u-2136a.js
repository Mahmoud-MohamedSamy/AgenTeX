// NDC-2136 r12: first-page time for Leads and Transactions (Deals) in LIST view — navigation → first data row visible; /records response time. 1 warm-up + 8 timed loads each.
const st = {}; const MODS = { Leads: '841043e1-c078-41f9-8d6e-dfd61bee45c3', Deals: 'f42cbafd-ab4e-4a6b-a40c-02c1d0ecb430' };
let recMs = []; page.on('requestfinished', async r => { if (/\/records\?/.test(r.url()) && r.request ? true : r.method() === 'GET') { try { const t = r.timing(); recMs.push(Math.round(t.responseEnd)); } catch (e) { } } });
const stats = a => { const s = [...a].sort((x, y) => x - y); if (!s.length) return { n: 0 }; return { n: s.length, p50: s[Math.floor(s.length / 2)], p95: s[Math.min(s.length - 1, Math.ceil(0.95 * s.length) - 1)], min: s[0], max: s[s.length - 1] }; };
const rowVisible = () => page.locator('table tbody tr').first().isVisible().catch(() => false);
for (const [name, id] of Object.entries(MODS)) {
  await page.goto(`${H}/modules/${id}`, { waitUntil: 'commit', timeout: 180000 }); for (let k = 0; k < 60; k++) { await sleep(2000); if (/records/.test(await text())) break; } await sleep(3000);
  const btns = await page.getByRole('button').evaluateAll(a => a.map(b => (b.getAttribute('aria-label') || b.title || '').trim()).filter(x => /view|list|kanban|table|split/i.test(x)));
  st[name + '_viewButtons'] = btns;
  if (!(await rowVisible())) { const lb = page.getByRole('button', { name: /^(List|List view|Table view|Table)$/i }); if (await lb.count()) { await lb.first().click(); await sleep(6000); } }
  st[name + '_listOk'] = await rowVisible(); await shot(`2136-a-${name}-list.png`);
  const loads = []; recMs = [];
  for (let i = 0; i < 9; i++) {
    const t0 = Date.now(); await page.goto(`${H}/modules/${id}`, { waitUntil: 'commit', timeout: 180000 });
    let ok = false; for (let k = 0; k < 900; k++) { if (await rowVisible()) { ok = true; break; } await sleep(100); }
    if (i > 0) loads.push(ok ? Date.now() - t0 : -1);
  }
  st[name] = { loads, ...stats(loads.filter(x => x > 0)), recordsApi: stats(recMs) };
}
return st;
