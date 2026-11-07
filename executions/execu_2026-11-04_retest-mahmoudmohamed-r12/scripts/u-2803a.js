const fs = require('fs'); const out = []; const o = {};
page.on('response', async r => { const u = r.url(); if (!/\/api\/v1\/desk\/.*templ|ticket-templates/.test(u)) return; out.push({ m: r.request().method(), u: u.replace(/^https:\/\/[^/]+/, ''), s: r.status(), b: (await r.text().catch(() => '')).slice(0, 3000) }); });
await page.goto(H + '/settings', { waitUntil: 'commit', timeout: 120000 }); for (let i = 0; i < 60; i++) { await sleep(3000); if (/Ticket Templates/.test(await text())) break; } await page.getByText('Ticket Templates', { exact: true }).first().click();
for (let i = 0; i < 60; i++) { await sleep(3000); if (/Ticket Templates/.test(await text()) && /New template/i.test(await text())) break; } await sleep(4000);
await shot('2803-a-list.png', { fullPage: true }); const t = await text(); o.list = t.slice(t.lastIndexOf('Ticket Templates'), t.lastIndexOf('Ticket Templates') + 1500); o.url = page.url();
await page.getByRole('button', { name: /New template/i }).first().click(); await sleep(5000);
await shot('2803-b-new.png', { fullPage: true }); const t2 = await text(); o.form = t2.slice(t2.lastIndexOf('New template'), t2.lastIndexOf('New template') + 2500);
fs.writeFileSync('../2803-net.json', JSON.stringify(out, null, 1)); o.calls = out.map(x => x.m + ' ' + x.s + ' ' + x.u.slice(0, 150));
return o;
