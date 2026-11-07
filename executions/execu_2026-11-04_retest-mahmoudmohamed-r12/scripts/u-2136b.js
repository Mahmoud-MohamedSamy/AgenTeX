const o = { calls: [] }; const L = '841043e1-c078-41f9-8d6e-dfd61bee45c3';
page.on('response', async r => { const u = r.url(); if (/\/records\?/.test(u)) o.calls.push(r.status() + (/skip_total=true/.test(u) ? ' skip_total' : '')); });
await page.goto(H + '/modules/' + L, { waitUntil: 'commit', timeout: 120000 }); for (let i = 0; i < 60; i++) { await sleep(1000); if (/\d+ records/.test(await text())) break; } await sleep(5000);
o.count = ((await text()).match(/\d[\d,]* records/) || [''])[0]; o.rows = await page.locator('table tbody tr').count(); o.toast = /unexpected error/i.test(await text()); await shot('2136-b-leads-now.png');
return o;
