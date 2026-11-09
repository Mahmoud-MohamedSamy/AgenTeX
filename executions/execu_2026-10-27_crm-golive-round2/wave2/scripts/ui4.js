const wait = ms => page.waitForTimeout(ms);
const dlg = page.locator('[role=dialog]');
await dlg.getByText('No splits chosen yet').click(); await wait(1500);
out.afterPencil = (await page.innerText('body')).replace(/\s+/g, ' ').slice(-700);
const opts = page.locator('[role=dialog] [role=option], [role=dialog] [role=checkbox], [role=dialog] input[type=checkbox]');
out.optCount = await opts.count();
for (let i = 0; i < Math.min(2, out.optCount); i++) await opts.nth(i).click().catch(() => {});
await wait(800);
for (const label of ['Done', 'Apply', 'OK', 'Select']) { const b = page.locator(`[role=dialog] button:has-text("${label}")`); if (await b.count()) { await b.last().click().catch(() => {}); break; } }
await wait(800);
for (const f of ['Full Name', 'Phone']) await dlg.getByText(f, { exact: true }).first().click().catch(() => {});
await wait(500);
await page.screenshot({ path: RAW + 'split-dialog-filled.png' });
await page.locator('[role=dialog] button:has-text("Save")').last().click(); await wait(6000);
out.dialogOpen = await page.locator('[role=dialog]').count();
out.splitResult = (await page.innerText('main')).replace(/\s+/g, ' ').slice(0, 600);
await page.screenshot({ path: RAW + 'split-view-result.png' });
