async (page) => { const R = {}; const fails = []; page.on('response', r => { if (r.status() >= 500 && /\/api\//.test(r.url())) fails.push(r.status() + ' ' + r.url().replace(/^https:\/\/[^/]+/, '').slice(0, 160)); });
  for (const [k, m] of [['leads', '841043e1-c078-41f9-8d6e-dfd61bee45c3'], ['deals', 'f42cbafd-ab4e-4a6b-a40c-02c1d0ecb430']]) {
    await page.goto(HOST + '/modules/' + m + '/records', { waitUntil: 'domcontentloaded' }); await sleep(6000); if (await relogin()) { await page.goto(HOST + '/modules/' + m + '/records'); await sleep(6000); }
    await page.getByRole('button', { name: 'Kanban view' }).or(page.getByRole('link', { name: 'Kanban view' })).first().click(); await sleep(8000);
    R[k] = (await bodyText()).match(/Could not load[^.]*\.?/gi)?.length || 0; await shot('crm-kanban-' + k, false); }
  R.fails = [...new Set(fails)].slice(0, 6); return R; }
