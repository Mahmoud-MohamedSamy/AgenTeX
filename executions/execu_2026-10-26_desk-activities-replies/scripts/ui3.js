// Read-only: /activities with a long wait; view menu, toolbar, rows
const calls = []; const f = r => { const u = r.url(); if (u.includes('/api/v1/') && !/heartbeat|presence|\/iam\/|notifications/.test(u)) calls.push(r.method() + ' ' + u.replace(API, '').slice(0, 220)); }; page.on('request', f);
const out = {};
await go('/activities', 5000);
for (let i = 0; i < 40; i++) { const t = await txt(); if (!/^\s*$/.test(t) && (await page.locator('main [role=row], main li, main table').count()) > 0) break; await sleep(1000); }
await sleep(3000);
out.url = page.url(); out.text = (await txt()).slice(0, 4000); out.calls = [...new Set(calls)]; out.shot = await shot('tavi-activities-list-2');
out.buttons = await page.$$eval('main button, main [role=tab], main [role=combobox]', bs => bs.map(b => (b.getAttribute('aria-label') || b.innerText || '').trim().slice(0, 50)).filter(Boolean));
page.off('request', f);
return done(out);
