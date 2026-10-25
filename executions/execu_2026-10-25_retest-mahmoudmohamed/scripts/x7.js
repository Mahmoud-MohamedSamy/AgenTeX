const out = {};
const open = async () => { await page.getByRole('button', { name: 'Table settings' }).click(); await sleep(700); await page.getByText('Manage Columns', { exact: true }).click(); await sleep(1500); return page.locator('[role=dialog]').last(); };
let d = await open(); await d.getByRole('button', { name: 'Hide Subject column' }).click(); await sleep(500); out.hideSubject = (await d.innerText()).match(/VISIBLE \(\d+\)/)?.[0]; await d.getByRole('button', { name: 'Apply' }).click(); await sleep(2000);
out.headersAfterHide = await page.locator('thead th').allInnerTexts(); await shot('1819-09-subject-hidden');
d = await open(); const show = d.getByRole('button', { name: 'Show Subject column' }); out.showButton = (await show.count()) ? (await show.isEnabled() ? 'enabled' : 'DISABLED') : 'absent';
if (out.showButton === 'enabled') { await show.click(); await sleep(400); await d.getByRole('button', { name: 'Apply' }).click(); await sleep(2000); } else { await d.getByRole('button', { name: 'Reset to default columns' }).click(); await sleep(500); await d.getByRole('button', { name: 'Apply' }).click().catch(() => {}); await sleep(2000); }
out.headersAfterShow = await page.locator('thead th').allInnerTexts();
// filter search clear
await page.getByRole('button', { name: 'Filter', exact: true }).click(); await sleep(1200); await page.getByRole('button', { name: 'Criteria field' }).first().click(); await sleep(900);
const fs = page.locator('input[placeholder*="earch"]').last(); await fs.fill('Sta'); await sleep(600);
out.filterSearchHasClear = await page.locator('button[aria-label*="lear" i]').evaluateAll(es => es.map(e => e.getAttribute('aria-label')));
await shot('1819-08-filter-search-x');
await page.keyboard.press('Escape'); await sleep(400);
const grp = page.getByRole('group', { name: 'Filter these records' }); if (await grp.count()) await grp.getByRole('button', { name: 'Clear filters' }).click().catch(() => {});
await page.getByRole('button', { name: 'Filter', exact: true }).click().catch(() => {}); await sleep(600);
return done(out);
