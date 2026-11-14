await page.goto(H + '/settings', { waitUntil: 'domcontentloaded' });
for (let i = 0; i < 40; i++) { await sleep(2000); if (/Data Administration/.test(await text())) break; } await sleep(2000);
await page.getByText('Bulk Actions Log', { exact: true }).first().click(); await sleep(9000);
log(page.url()); const t = await text(); const i = t.indexOf('Bulk Actions Log', t.indexOf('Email Providers')); log(t.slice(i, i + 1800));
await shot(process.env.TAG + '.png');
