await go('/'); await sleep(3000); await page.getByRole('link', { name: 'Tickets', exact: true }).first().click(); await sleep(6000);
log('list url', page.url().replace(H, ''));
const row = page.getByText('QA BP JU ticket one').first(); log('row found', await row.count());
if (await row.count()) { await row.click(); await sleep(7000); }
log('ticket url', page.url().replace(H, ''));
const b = (await text()).replace(/\s+/g, ' '); const i = b.search(/QA BP JU ticket one/); log('page', b.slice(i, i + 1500));
await shot('j1-ticket');
log('bp testids', await page.locator('[data-testid*=blueprint]').evaluateAll(a => a.map(x => x.getAttribute('data-testid') + ':' + x.innerText.replace(/\s+/g, ' ').slice(0, 160))));
