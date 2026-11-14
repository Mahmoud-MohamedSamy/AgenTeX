const urls = new Set(); page.on('request', r => { const u = r.url(); if (/api\/v1/.test(u) && /view/i.test(u)) urls.add(r.method() + ' ' + u.replace(/^.*api\/v1/, '').slice(0, 140)); });
await page.goto(H + '/views', { waitUntil: 'domcontentloaded' });
for (let i = 0; i < 30; i++) { await sleep(2000); if (/All Tickets/.test(await text())) break; }
await sleep(3000);
log([...urls]);
