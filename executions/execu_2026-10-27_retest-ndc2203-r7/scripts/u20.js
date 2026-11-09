const out = {};
await page.locator("[role='option']", { hasText: /^before$/ }).first().click({ force: true }); await sleep(1200); await shot('e6-before-compare');
out.compare = (await txt()).split('\n').filter(l => /current time|compare|a date|value/i.test(l)).slice(0, 8);
const cw = page.getByText(/current time/i).first(); if (await cw.count()) { await cw.click({ force: true }).catch(() => {}); await sleep(800); await shot('e6-current-time'); }
// description operators
await page.getByRole('button', { name: /Due Date/ }).first().click({ force: true }); await sleep(800);
const inp = page.locator("[role='listbox'] input, [cmdk-input], input[placeholder*='earch']").last(); await inp.fill('Description'); await sleep(800);
await page.locator("[role='option']", { hasText: /^Description$/ }).first().click({ force: true }); await sleep(1000);
const op = page.locator('button').filter({ hasText: /^(is|contains|equals|starts with)$/ }).last(); if (await op.count()) { await op.click({ force: true }); await sleep(900); out.textOps = await page.locator("[role='option']").allInnerTexts(); await shot('e4-text-operators'); await page.keyboard.press('Escape'); }
return fin(out);
