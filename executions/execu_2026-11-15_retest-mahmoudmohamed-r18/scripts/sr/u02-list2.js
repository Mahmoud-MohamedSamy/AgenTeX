const out = {};
await go('/settings/automation/scoring-rules?module=' + MID, 9000);
// search
const s = page.getByPlaceholder('Search by name or description'); await s.fill('K2'); await sleep(1500);
out.searchRows = (await page.locator('tbody tr').allInnerTexts()).map(x => x.split('\n')[0]);
await shot('2934-3-search.png'); await s.fill(''); await sleep(1000);
// status filter
await page.getByText('All statuses').first().click(); await sleep(700); out.statusOpts = await page.getByRole('option').allInnerTexts();
const inact = page.getByRole('option', { name: /inactive|off/i }).first(); if (await inact.count()) { await inact.click(); await sleep(1500); }
out.inactiveRows = (await page.locator('tbody tr').allInnerTexts()).map(x => x.split('\n')[0]);
await shot('2934-4-status-filter.png');
// clone K1
await go('/settings/automation/scoring-rules?module=' + MID, 8000);
const row = page.locator('tbody tr').filter({ hasText: 'QA RT18 SR K1' }).first(); await row.locator('button').last().click(); await sleep(800);
await page.getByRole('menuitem', { name: 'Clone' }).click(); await sleep(2500);
out.afterClone = (await bodyText()).match(/.{0,200}(Clone|copy|Copy).{0,300}/g)?.slice(0, 3);
await shot('2934-5-clone.png');
const dr = page.getByTestId('scoring-rule-drawer'); out.drawer = await dr.count();
if (out.drawer) { out.drawerText = (await dr.innerText()).replace(/\s+/g, ' ').slice(0, 700); out.nameVal = await dr.getByLabel(/Rule name/).inputValue().catch(() => null); }
return out;
