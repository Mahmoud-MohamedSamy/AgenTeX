const P = '[data-testid="tia-panel"]', L = '[data-testid="tia-launcher"]'; const R = {};
await go('/views'); await sleep(6000);
await page.locator('text=/^Send quote$/').first().click().catch(e => R.openErr = String(e).slice(0, 80)); await sleep(6000);
R.url = page.url().replace(/[?#].*/, '');
await page.mouse.click(632, 125).catch(e => R.actErr = String(e).slice(0, 80)); await sleep(1500);
R.menu = (await page.locator('[role=menu] [role=menuitem], [role=menuitem]').allInnerTexts().catch(() => [])).map(s => s.trim()).slice(0, 20);
const pick = page.locator('[role=menuitem]', { hasText: /Merge|Clone|Move|Split|Share|Change owner|Assign/i }).first(); R.picked = (await pick.innerText().catch(() => '')).trim();
if (R.picked) { await pick.click(); await sleep(2500); }
R.dialogs = await page.locator('[role=dialog]:not([data-testid="tia-panel"]), [role=alertdialog]').count();
await page.locator(L).click({ timeout: 6000 }).catch(e => R.launcherErr = String(e).slice(0, 160)); await sleep(1500);
R.panel = await page.locator(P).isVisible().catch(() => false);
if (R.panel) { R.top = await page.evaluate(p => { const el = document.querySelector(p); const r = el.getBoundingClientRect(); const t = document.elementFromPoint(r.x + r.width / 2, r.y + r.height - 60); return el.contains(t) ? 'panel on top' : 'other on top: ' + (t?.closest('[role=dialog]') ? 'dialog' : t?.tagName); }, P); await page.locator(`${P} textarea`).click({ timeout: 4000 }).catch(e => R.panelErr = String(e).slice(0, 100)); R.panelFocus = await page.evaluate(p => !!document.activeElement?.closest(p), P); }
const dlg = page.locator('[role=dialog]:not([data-testid="tia-panel"]), [role=alertdialog]').first();
if (await dlg.count()) { const b = dlg.locator('input, button').first(); await b.click({ timeout: 4000 }).catch(e => R.dlgErr = String(e).slice(0, 100)); R.dlgFocus = await page.evaluate(() => !!document.activeElement?.closest('[role=dialog]:not([data-testid="tia-panel"]), [role=alertdialog]')); }
await shot('H-25-panel-and-ticket-dialog');
await page.keyboard.press('Escape'); await sleep(500); await page.keyboard.press('Escape');
return R;
