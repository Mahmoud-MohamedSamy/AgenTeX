const P = '[data-testid="tia-panel"]', L = '[data-testid="tia-launcher"]';
const R = {};
await go('/modules/841043e1-c078-41f9-8d6e-dfd61bee45c3'); await sleep(6000);
const first = { getAttribute: async () => '/modules/841043e1-c078-41f9-8d6e-dfd61bee45c3/records/9378e25b-c39c-4aa3-a93c-48cc17edbeac' };
if (R.rec) { await go(R.rec); await sleep(5000); }
await page.locator('button', { hasText: /^Edit$/ }).first().click().catch(e => R.editErr = String(e).slice(0, 80)); await sleep(3000);
R.dialogs = await page.locator('[role=dialog]').count(); R.url = page.url().replace(/[?#].*/, '');
await page.locator(L).click({ timeout: 5000 }).catch(e => R.launcherErr = String(e).slice(0, 160)); await sleep(1500);
R.panel = await page.locator(P).isVisible().catch(() => false);
R.dialogs2 = await page.locator('[role=dialog]').count();
if (R.panel) { R.topAtPanel = await page.evaluate(p => { const el = document.querySelector(p); const r = el.getBoundingClientRect(); const t = document.elementFromPoint(r.x + r.width / 2, r.y + r.height - 60); return el.contains(t) ? 'panel on top' : 'other on top: ' + t?.tagName; }, P);
  await page.locator(`${P} textarea`).click({ timeout: 4000 }).catch(e => R.panelClickErr = String(e).slice(0, 100)); R.panelFocus = await page.evaluate(p => !!document.activeElement?.closest(p), P); }
const inp = page.locator('[role=dialog]:not([data-testid="tia-panel"]) input[type=text], [role=dialog]:not([data-testid="tia-panel"]) input:not([type])').first(); R.formInputs = await inp.count();
if (R.formInputs) { await inp.click({ timeout: 4000 }).catch(e => R.formClickErr = String(e).slice(0, 100)); R.formFocus = await page.evaluate(() => document.activeElement?.closest('[role=dialog]')?.getAttribute('data-testid') || document.activeElement?.tagName); }
await shot('H-25-panel-over-edit-dialog');
return R;
