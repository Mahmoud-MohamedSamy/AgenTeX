await go('/analytics/reports/view/efa2c92a-7145-4b79-85e8-1de588d04ff0', 9000);
await page.getByRole('button', { name: 'Export', exact: true }).click(); await sleep(1500);
const d = page.locator('[role=dialog]').last(); out.full = (await d.innerText()).replace(/\s+/g, ' ').slice(300, 1200);
out.ctl = await d.locator('button, input, [role=radio], select').evaluateAll(es => es.map(e => e.tagName + ':' + (e.getAttribute('aria-label') || e.innerText || e.value || '').trim().slice(0, 40)));
const dl = page.waitForEvent('download', { timeout: 45000 }).catch(() => null);
await d.getByRole('button', { name: /^Export$|^Download$/ }).last().click().catch(e => out.eErr = e.message.slice(0, 80));
const f = await dl; if (f) { await f.saveAs(RUN + '/wave5/raw/W5-27-' + f.suggestedFilename()); out.file = f.suggestedFilename(); } else { out.file = 'none'; out.after = (await page.locator('body').innerText()).replace(/\s+/g, ' ').slice(-400); }
await shot('w5/W5-27-export-done');
// schedule dialog
await page.keyboard.press('Escape'); await sleep(800);
await page.getByRole('button', { name: 'Report actions' }).click(); await sleep(1200); await page.getByRole('menuitem', { name: /Schedule/ }).click(); await sleep(2500);
out.sched = (await dtxt()).slice(0, 800); await shot('w5/W5-27-schedule'); await page.keyboard.press('Escape');
return fin({ out });
