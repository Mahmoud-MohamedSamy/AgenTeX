const o = {}; await page.setViewportSize({ width: 1600, height: 900 });
await page.goto(H + '/settings/modules-and-fields/88e8ea44-1658-4df3-9930-d0902b91073d', { waitUntil: 'commit', timeout: 120000 }).catch(() => {});
for (let i = 0; i < 40; i++) { await sleep(2000); const t = await txt().catch(() => ''); if (/QA NDC ADM/.test(t)) break; }
await page.locator('button[aria-label="Open menu for QA NDC ADM"]').click().catch(e => o.e = e.message.slice(0, 60)); await sleep(1200);
await page.locator('text=/^Layout Properties$/').first().click().catch(e => o.e2 = e.message.slice(0, 60)); await sleep(2500);
const dlg = page.locator('[role=dialog]');
await dlg.locator('label', { hasText: /^QA NDC Accounting/ }).first().click().catch(e => o.e3 = e.message.slice(0, 60)); await sleep(800);
await dlg.locator('button', { hasText: /^Save$/ }).click().catch(e => o.e4 = e.message.slice(0, 60)); await sleep(3500);
o.row = await page.$$eval('tr', trs => trs.map(t => t.innerText.replace(/\s+/g, ' ').trim()).filter(t => /^QA NDC ADM/.test(t)));
o.toggle = await page.locator('button[aria-label="Toggle QA NDC ADM status"]').getAttribute('aria-checked').catch(() => null);
// statuses back to organisation list for Manual Invoice
await page.goto(H + '/settings/modules-and-fields', { waitUntil: 'commit' }).catch(() => {});
for (let i = 0; i < 40; i++) { await sleep(2000); const t = await txt().catch(() => ''); if (/Ticket Status/.test(t)) break; }
await page.locator('a, button', { hasText: /Ticket Status/i }).first().click(); await sleep(6000);
const dep = page.locator('select').filter({ has: page.locator('option', { hasText: 'Choose a department' }) }).first();
await dep.selectOption({ label: 'QA NDC Manual Invoice' }); await sleep(2500);
await page.locator('select').filter({ has: page.locator('option', { hasText: /Choose a layout/ }) }).first().selectOption({ label: 'QA NDC Manual Invoice' }); await sleep(3000);
await page.getByText("Use the organization's statuses (all of them)", { exact: true }).click().catch(e => o.e5 = e.message.slice(0, 60)); await sleep(1000);
const saves = page.locator('button', { hasText: /^Save$/ }); await saves.nth((await saves.count()) - 1).click().catch(e => o.e6 = e.message.slice(0, 60)); await sleep(4000);
o.shot = await shot('rt/cleanup-statuses');
return JSON.stringify(o);
