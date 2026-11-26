const P = '[data-testid="tia-panel"]', L = '[data-testid="tia-launcher"]';
const R = {};
await go('/views'); await sleep(5000);
await page.mouse.click(965, 28); await sleep(3000);
R.afterPlus = { url: page.url().replace(/[?#].*/, ''), dialogs: await page.locator('[role=dialog]').count(), menu: (await page.locator('[role=menu], [role=listbox]').allInnerTexts().catch(() => [])).join(' | ').slice(0, 200) };
const mi = page.locator('[role=menuitem], [role=option], button', { hasText: /^(Ticket|New ticket|Create ticket)$/i }).first(); if (await mi.count()) { await mi.click(); await sleep(3000); }
R.dlgCount = await page.locator('[role=dialog]').count(); R.url2 = page.url().replace(/[?#].*/, '');
await page.locator(L).click({ timeout: 5000 }).catch(e => R.launcherErr = String(e).slice(0, 120)); await sleep(1500);
R.panel = await page.locator(P).isVisible().catch(() => false);
R.topAtPanel = await page.evaluate(p => { const el = document.querySelector(p); if (!el) return 'no panel'; const r = el.getBoundingClientRect(); const t = document.elementFromPoint(r.x + r.width / 2, r.y + r.height - 60); return el.contains(t) ? 'panel on top' : (t ? 'other on top: ' + t.tagName : 'none'); }, P);
const formInput = page.locator('[role=dialog] input, form input').first(); R.formInput = await formInput.count();
if (R.panel) { await page.locator(`${P} textarea`).click().catch(e => R.panelTypeErr = String(e).slice(0, 80)); R.panelFocus = await page.evaluate(p => !!document.activeElement?.closest(p), P); }
if (R.formInput) { await formInput.click({ timeout: 4000 }).catch(e => R.formClickErr = String(e).slice(0, 80)); R.formFocus = await page.evaluate(() => document.activeElement?.tagName); }
await shot('H-25-panel-over-dialog');
await page.keyboard.press('Escape');
return R;
