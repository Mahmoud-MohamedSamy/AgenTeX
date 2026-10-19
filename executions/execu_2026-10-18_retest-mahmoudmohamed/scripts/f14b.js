// NDC-1819 items 4 and 10: filter field search narrows the list; row ⋮ Edit / Delete (cancelled) on QA RT tz L3.
const out = {};
await page.goto(H + '/workqueue', { waitUntil: 'commit', timeout: 120000 }); for (let i = 0; i < 40 && !(await page.getByRole('button', { name: /^My Leads/ }).count()); i++) await sleep(1000);
await page.getByRole('button', { name: /^My Leads/ }).first().click(); for (let i = 0; i < 30 && (await page.locator('main thead th').count()) < 5; i++) await sleep(1000); await sleep(2500);
const row = page.locator('main tbody tr', { hasText: 'QA RT tz L3' }).first(); for (let i = 0; i < 30 && !(await row.count()); i++) await sleep(1000); await row.hover(); await sleep(600);
await row.getByRole('button').first().click(); await sleep(900);
out.menu = await page.locator('[role=menu] [role^=menuitem]').allInnerTexts();
await page.getByRole('menuitem', { name: /^Edit/ }).click(); await sleep(4000);
out.afterEdit = { url: page.url(), dlg: (await page.locator('[role=dialog]').last().innerText().catch(() => '')).replace(/\s+/g, ' ').slice(0, 200) };
await shot('NDC-1819-f-row-edit');
if (await page.locator('[role=dialog]').count()) { await page.keyboard.press('Escape'); await sleep(800); }
await page.goto(H + '/workqueue', { waitUntil: 'commit', timeout: 120000 }); for (let i = 0; i < 40 && !(await page.getByRole('button', { name: /^My Leads/ }).count()); i++) await sleep(1000); await page.getByRole('button', { name: /^My Leads/ }).first().click();
try {
const row2 = page.locator('main tbody tr', { hasText: 'QA RT tz L3' }).first(); for (let i = 0; i < 40 && !(await row2.count()); i++) await sleep(1000); await row2.hover(); await sleep(600);
await row2.getByRole('button').first().click(); await sleep(900);
await page.getByRole('menuitem', { name: /^Delete/ }).click(); await sleep(1500);
out.deleteDlg = (await page.locator('[role=alertdialog], [role=dialog]').last().innerText().catch(() => '')).replace(/\s+/g, ' ').slice(0, 250);
await shot('NDC-1819-f-row-delete-confirm');
await page.locator('[role=alertdialog], [role=dialog]').last().getByRole('button', { name: /Cancel/ }).click(); await sleep(2000);
out.l3Still = await page.locator('main tbody tr', { hasText: 'QA RT tz L3' }).count();
} catch (e) { out.err = String(e).slice(0, 200); }
return done(out);
