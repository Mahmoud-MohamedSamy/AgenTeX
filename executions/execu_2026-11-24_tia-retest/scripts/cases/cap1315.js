const R = {}; const P = '[data-testid="tia-panel"]', L = '[data-testid="tia-launcher"]';
const box = async loc => { const b = await loc.boundingBox().catch(() => null); return b && [Math.round(b.x), Math.round(b.y), Math.round(b.width), Math.round(b.height)]; };
// 13a: profiles
await go('/settings'); await sleep(3000);
await page.getByText('Profiles', { exact: true }).first().click(); await sleep(4000);
await page.getByText('CRM Admin', { exact: true }).first().click(); await sleep(5000);
R.url13a = page.url();
const t = await text(); R.hasTiaText = t.includes('Chat with Tia');
const row = page.getByText('Chat with Tia', { exact: true }).first();
if (await row.count()) { await row.scrollIntoViewIfNeeded(); await sleep(1000); R.rowBox = await box(row); const cb = row.locator('xpath=ancestor::*[.//input[@type="checkbox"] or .//*[@role="switch" or @role="checkbox"]][1]').locator('input[type=checkbox], [role=switch], [role=checkbox]').first(); R.cbBox = await box(cb); R.cbState = await cb.evaluate(e => e.getAttribute('aria-checked') ?? String(e.checked)).catch(() => 'n/a'); const sec = row.locator('xpath=ancestor::*[self::section or self::table or contains(@class,"card")][1]'); R.secBox = await box(sec); }
await shot('A13-crm-admin-profile');
// 13b: Who can use Tia text in Edit → Additional Settings
await go('/settings/integrations/tia'); await page.waitForFunction(() => document.body.innerText.includes('Tia switch'), null, { timeout: 90000 }).catch(() => {}); await sleep(2500);
await page.locator('[data-testid="tia-summary-card"] button', { hasText: 'Edit' }).click(); await sleep(2500);
const dlg = page.locator('[role=dialog]').last(); await dlg.locator('[role=tab], button', { hasText: /^Additional Settings$/ }).first().click(); await sleep(1500);
const who = dlg.getByText(/admin profiles have the "Chat with Tia" permission/).first(); await who.scrollIntoViewIfNeeded().catch(() => {}); await sleep(800); R.whoBox = await box(who);
await shot('A13-who-can-use-tia');
await dlg.locator('button', { hasText: /^Cancel$/ }).first().click(); await sleep(1200);
const c = page.locator('[role=dialog] button, [role=alertdialog] button', { hasText: /Discard|Leave/i }); if (await c.count()) { await c.first().click(); await sleep(800); }
// 15: focus leaves the panel
await go('/'); await sleep(3500); await page.locator(L).click(); await sleep(1500);
await page.locator(`${P} textarea`).focus(); await page.keyboard.press('Shift+Tab'); await sleep(500);
R.focusOutside = await page.evaluate(p => !document.activeElement?.closest(p), P);
R.focusDesc = await page.evaluate(() => { const a = document.activeElement; return a ? a.tagName + ' ' + (a.getAttribute('aria-label') || a.innerText || '').trim().slice(0, 40) : ''; });
R.focusBox = await page.evaluate(() => { const r = document.activeElement?.getBoundingClientRect(); return r && [Math.round(r.x), Math.round(r.y), Math.round(r.width), Math.round(r.height)]; });
R.panelBox = await box(page.locator(P));
await page.keyboard.press('Escape'); await sleep(800); R.stillOpen = await page.locator(P).isVisible().catch(() => false);
await shot('A15-focus-outside-panel');
R.viewport = page.viewportSize();
return R;
