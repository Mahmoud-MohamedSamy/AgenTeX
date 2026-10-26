await api('GET', '/desk/integrations/crm/status'); await go('/settings/integrations/crm', 15000);
await page.getByText('Sync History', { exact: true }).first().click(); await sleep(5000); await shot('2399-r2-06-sync-history');
const h = (await txt()).split('\n').filter(l => /initial|customer|contract|skipped|attention|added|updated|08:05|10:05|11:05/i.test(l)).slice(0, 12);
const tabs = await page.getByRole('tab').evaluateAll(t => t.map(x => x.innerText.trim()));
let fl = [];
const ft = page.getByRole('tab', { name: /fail/i }); if (await ft.count()) { await ft.first().click(); await sleep(4000); await shot('2399-r2-07-failure-log'); fl = (await txt()).split('\n').filter(l => /mandatory|linked|parked|failure|record/i.test(l)).slice(0, 8); }
return done({ h, tabs, fl });
