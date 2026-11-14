const seen = [];
await page.route(/\/api\/v1\/.*departments/, async r => { const res = await r.fetch(); let j; try { j = await res.json(); } catch (e) { return r.fulfill({ response: res }); }
  seen.push(r.request().url().split('/api/v1')[1].slice(0, 80));
  const empty = x => Array.isArray(x) ? [] : x && typeof x === 'object' ? Object.fromEntries(Object.entries(x).map(([k, v]) => [k, Array.isArray(v) ? [] : v])) : x;
  j.data = empty(j.data); if (j.meta && 'total' in j.meta) j.meta.total = 0; return r.fulfill({ response: res, json: j }); });
await go('/settings/automation/blueprints'); await sleep(6000);
log('calls', seen); log('b4', (await page.locator('main').last().innerText()).replace(/\s+/g,' ').slice(-300)); await shot('b4-no-departments');
