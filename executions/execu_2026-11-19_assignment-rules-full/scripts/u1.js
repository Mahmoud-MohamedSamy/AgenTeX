await page.goto(H + '/settings/automation/assignment-rules', { waitUntil: 'commit' });
await page.getByText('Direct Assignment').first().waitFor({ timeout: 150000 }); await sleep(5000);
await shot('AR-UI-01-direct-list.png');
await page.getByRole('button', { name: /New Rule/ }).first().click(); await sleep(4000);
await shot('AR-UI-02-direct-new.png', { fullPage: true });
log((await text()).replace(/\s+/g, ' ').slice(0, 2500));
