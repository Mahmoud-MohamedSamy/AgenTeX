const order = async () => (await page.locator('tbody tr').allInnerTexts()).map(r => (r.match(/QA RT wq (t\d+)/) || ['', '?'])[1]).join(',');
const before = await order();
await page.getByRole('button', { name: 'Column options: Subject', exact: true }).click(); await sleep(700); await page.getByRole('menuitemradio', { name: /Sort descending/ }).or(page.getByRole('menuitem', { name: /Sort descending/ })).first().click(); await sleep(3000);
const desc = await order();
const prefs1 = (await api('GET', '/modules/a9d87b62-b704-4c2e-b2d5-1b745d7c2065/list-preferences')).j?.data?.prefs;
const res = [];
for (let i = 1; i <= 2; i++) { await page.reload({ waitUntil: 'commit' }); for (let k = 0; k < 30; k++) { await sleep(1000); if (/Total Records \d+/.test(await page.locator('body').innerText().catch(() => ''))) break; } await sleep(2000); res.push(await order()); }
await shot('1819-04-sort-after-reload');
const hdr = await page.locator('thead th').nth(2).getAttribute('aria-sort');
return done({ before, desc, afterReloads: res, ariaSort: hdr, sortPref: JSON.stringify(Object.fromEntries(Object.entries(prefs1 || {}).filter(([k]) => /sort/i.test(k)))) });
