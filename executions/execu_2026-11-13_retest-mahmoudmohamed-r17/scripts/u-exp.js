await page.goto(H + '/settings', { waitUntil: 'domcontentloaded' });
for (let i = 0; i < 40; i++) { await sleep(2000); if (/Data Administration/.test(await text())) break; } await sleep(2000);
await page.getByText('Export', { exact: true }).first().click(); await sleep(7000);
log(page.url()); const t = await text(); log(t.slice(t.indexOf('Email Providers') + 15, t.indexOf('Email Providers') + 2000));
log(await page.$$eval('button', bs => bs.map(b => (b.innerText || b.getAttribute('aria-label') || '').trim()).filter(Boolean).slice(-30)));
await shot('2846-export-page.png');
