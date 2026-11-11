await page.goto(H + '/settings', { waitUntil: 'domcontentloaded' });
for (let i = 0; i < 40; i++) { await sleep(2000); if (/Data Administration/.test(await text())) break; } await sleep(2000);
await page.getByText('Audit Log', { exact: true }).first().click(); await sleep(9000);
log(page.url()); const t = await text(); const i = t.indexOf('Audit Log', t.indexOf('Email Providers')); log(t.slice(i, i + 2500));
await shot('2846-audit.png');
