const out = {};
await page.goto(H + `/modules/${made.mod}/records/new`, { waitUntil: 'domcontentloaded' });
for (let i = 0; i < 60; i++) { await sleep(2000); if (/Inputs \(one field per type\)/i.test(await text())) break; } await sleep(3000);
await page.getByPlaceholder('Name').first().fill('QA FX Matrix UI create'); await sleep(300);
await page.getByLabel('In Number', { exact: true }).first().fill('4').catch(e => out.numErr = e.message.split('\n')[0]);
await page.getByRole('button', { name: /^Save$/ }).first().click(); await sleep(7000);
out.url = page.url(); out.toast = (await page.locator('[data-sonner-toast], li[role=status], [role=alert]').allInnerTexts().catch(() => [])).join(' | ').slice(0, 250);
out.rollupError = /rollup_summary' and cannot be set/i.test(await text()); await shot('ui-create-save');
log(out); fs.writeFileSync(RUN + '/out/ui-create-save.json', JSON.stringify(out, null, 1));
