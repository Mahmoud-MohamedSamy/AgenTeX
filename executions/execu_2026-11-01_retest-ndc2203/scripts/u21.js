const out = {};
await page.getByText('A date and time', { exact: true }).first().click({ force: true }); await sleep(900);
out.compareOpts = await page.locator("[role='option']").allInnerTexts();
const ct = page.locator("[role='option']", { hasText: /current time/i }).first(); if (await ct.count()) { await ct.click({ force: true }); await sleep(900); }
await shot('e6-current-time');
await page.getByText('Due Date', { exact: true }).first().click({ force: true }); await sleep(800);
const inp = page.locator("[role='listbox'] input, [cmdk-input], input[placeholder*='earch']").last(); await inp.fill('Description'); await sleep(800);
await page.locator("[role='option']", { hasText: /^Description$/ }).first().click({ force: true }); await sleep(1000);
const row = (await txt()).split('\n'); const i = row.findIndex(l => l === 'Description');
await page.getByText(row[i + 1], { exact: true }).last().click({ force: true }).catch(() => {}); await sleep(900);
out.textOps = await page.locator("[role='option']").allInnerTexts(); await shot('e4-text-operators');
return fin(out);
