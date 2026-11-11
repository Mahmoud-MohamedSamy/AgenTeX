const reqs = []; page.on('request', r => { const u = r.url(); if (/api\/v1\/desk\/skill/.test(u)) reqs.push(r.method() + ' ' + u.replace(/^.*api\/v1/, '')); });
await page.goto(H + '/settings', { waitUntil: 'domcontentloaded' });
for (let i = 0; i < 40; i++) { await sleep(2000); if (/Data Administration/.test(await text())) break; } await sleep(2000);
await page.getByText('Skills', { exact: true }).first().click(); await sleep(9000);
log(page.url()); const t = await text(); const i = t.indexOf('Skills', t.indexOf('Email Providers')); log(t.slice(i, i + 1500));
log(reqs.slice(0, 15)); await shot('2805-skills-page.png');
