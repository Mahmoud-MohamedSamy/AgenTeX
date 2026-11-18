await go('/views/all/tickets', 9000);
const row = page.locator('main').last().locator('a,div', { hasText: 'QA AC MV3 access run' }).first();
out.rowTxt = (await row.innerText().catch(() => '')).replace(/\s+/g, ' ').slice(0, 200);
out.rowBtns = await page.locator('main').last().locator('button').evaluateAll(es => es.map(e => (e.getAttribute('aria-label') || e.innerText || '').trim()).filter(Boolean).slice(0, 60));
for (const v of ['Table View', 'Table']) { const b = page.getByText(/Classic View|Compact View|Table View/).first(); await b.click().catch(() => {}); await sleep(1200); const t = page.getByRole('menuitem', { name: /Table/ }).first(); if (await t.count()) { await t.click(); await sleep(5000); break; } }
out.table = (await mtxt()).slice(0, 800); await shot('access/b-list-table');
const depCell = page.getByText('Sales', { exact: true }).first(); out.depCell = await depCell.count(); if (out.depCell) { await depCell.click().catch(() => {}); await sleep(1500); out.afterClick = (await page.locator('[role=menu],[role=listbox],[role=dialog]').last().innerText().catch(() => '')).slice(0, 200); }
return fin({ out });
