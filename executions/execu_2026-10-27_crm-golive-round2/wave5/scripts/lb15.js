const res = {};
const panel = page.locator('xpath=//*[normalize-space(text())="Field Properties"]/ancestor::*[.//button[normalize-space(.)="Apply"]][1]').first();
await panel.locator('input[placeholder^="e.g. ^[A-Z]"]').fill('^QA[0-9]+$');
// conditional visibility toggle (NDC-1230)
const sw = panel.locator('button[role=switch], input[type=checkbox]');
res.switches = await sw.count();
await panel.locator('text=Conditional visibility').first().click().catch(() => {}); await sleep(800);
const toggles = await panel.locator('button[role=switch]').evaluateAll(b => b.map(x => x.getAttribute('aria-checked') + ':' + (x.getAttribute('aria-label') || '')));
res.toggles = toggles;
// turn on the last switch (conditional visibility) if off
const n = await panel.locator('button[role=switch]').count();
if (n) { const last = panel.locator('button[role=switch]').nth(n - 1); if ((await last.getAttribute('aria-checked')) !== 'true') await last.click(); await sleep(1000); }
res.after = (await panel.innerText()).replace(/\s+/g, ' ').slice(0, 1000);
const sels = panel.locator('select'); res.selOpts = []; for (let i = 0; i < await sels.count(); i++) res.selOpts.push(await sels.nth(i).evaluate(s => [...s.options].map(o => o.text).join('/')));
const ctl = panel.locator('button, [role=combobox]', { hasText: /Select field/ }).first();
if (await ctl.count()) { await ctl.click(); await sleep(1000); res.ctlOpts = await page.$$eval('[role=option], [cmdk-item]', os => os.map(o => o.innerText.trim())); await page.keyboard.press('Escape'); }
await shot('c01-1230-controlling');
return res;
