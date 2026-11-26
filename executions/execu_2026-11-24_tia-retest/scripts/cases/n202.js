const tid = id => page.locator(`[data-testid="${id}"]`);
const R = {};
await go('/settings/integrations/tia'); await page.waitForFunction(() => document.body.innerText.includes('Tia switch'), null, { timeout: 90000 }).catch(() => {}); await sleep(2500);
await tid('tia-summary-card').locator('button', { hasText: 'Edit' }).click(); await sleep(2500);
let dlg = page.locator('[role=dialog]').last();
await dlg.locator('[role=tab], button', { hasText: /^Tools$/ }).first().click(); await sleep(1500);
await dlg.locator('button', { hasText: /Add Tools/ }).first().click(); await sleep(2500);
const top = page.locator('[role=dialog]').last(); const t = await top.innerText();
R.picker = t.replace(/\n+/g, ' / ').slice(0, 2500);
R.actionLines = t.split('\n').filter(l => /action/i.test(l)).slice(0, 15);
await shot('N2-02-add-tools');
const row = top.locator('label, li, div', { hasText: /Propose running|Run (a|an) (custom )?action|custom action/i }).last();
R.rowCount = await row.count();
if (R.rowCount) { const cb = row.locator('input[type=checkbox], [role=checkbox], button').first(); R.rowDisabled = await cb.isDisabled().catch(() => 'n/a'); R.rowText = (await row.innerText()).replace(/\n+/g, ' / ').slice(0, 300);
  if (R.rowDisabled === false) { await cb.click().catch(() => {}); await sleep(1000); const add = top.locator('button', { hasText: /^(Add|Add tools|Add \d+ tools?|Done)$/i }).first(); if (await add.count()) { await add.click(); await sleep(1500); } dlg = page.locator('[role=dialog]').last(); R.afterAdd = (await dlg.innerText()).split('\n').filter(l => /action|choose|deploy/i.test(l)).slice(0, 12); await shot('N2-02-run-action-added'); R.saveDisabled = await dlg.locator('button', { hasText: /^Save Draft$/ }).isDisabled().catch(() => 'n/a'); } }
// back out without saving
for (let i = 0; i < 3; i++) { await page.keyboard.press('Escape'); await sleep(800); const c = page.locator('[role=dialog] button, [role=alertdialog] button', { hasText: /^(Cancel|Discard|Leave and discard|Leave)$/ }); if (await c.count()) { await c.last().click().catch(() => {}); await sleep(1000); } if (!(await page.locator('[role=dialog]').count())) break; }
R.closed = !(await page.locator('[role=dialog]').count());
await page.reload(); await sleep(5000); R.notLive = (await text()).includes('not live yet');
return R;
