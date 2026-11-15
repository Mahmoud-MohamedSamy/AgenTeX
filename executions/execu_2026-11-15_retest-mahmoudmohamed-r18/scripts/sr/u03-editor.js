const out = {};
await go('/settings/automation/scoring-rules?module=' + MID, 9000);
// clone K1 and save
let row = page.locator('tbody tr').filter({ hasText: 'QA RT18 SR K1' }).first(); await row.locator('button').last().click(); await sleep(800);
await page.getByRole('menuitem', { name: 'Clone' }).click(); await sleep(2500);
let dr = page.getByTestId('scoring-rule-drawer');
const resp = page.waitForResponse(r => /\/scoring-rules$/.test(r.url()) && r.request().method() === 'POST', { timeout: 15000 }).catch(() => null);
await dr.getByRole('button', { name: /^Create$/ }).click(); const rr = await resp; out.cloneCreate = rr ? rr.status() : 'no POST';
if (rr && rr.status() < 300) { const j = await rr.json(); LED('scoring rule "Copy of QA RT18 SR K1" ' + j.data.id + ' (Leads, UI clone)'); out.cloneEntries = JSON.stringify(j.data.entries); }
await sleep(2500); out.listHasCopy = (await bodyText()).includes('Copy of QA RT18 SR K1');
await shot('2934-6-clone-saved.png');
// K2b editor (removed value)
row = page.locator('tbody tr').filter({ hasText: 'QA RT18 SR K2b' }).first(); await row.getByText('QA RT18 SR K2b').first().click(); await sleep(2500);
dr = page.getByTestId('scoring-rule-drawer'); out.k2bDrawer = (await dr.innerText()).replace(/\s+/g, ' ').slice(0, 900);
await shot('2936-3-rule-editor.png');
await page.keyboard.press('Escape'); await sleep(1000);
// new rule: layout / criteria controls? and J6 focus
await go('/settings/automation/scoring-rules?module=' + MID, 8000);
await page.getByRole('button', { name: /New Scoring Rule/ }).first().click(); await sleep(2000);
dr = page.getByTestId('scoring-rule-drawer'); out.newDrawer = (await dr.innerText()).replace(/\s+/g, ' ').slice(0, 900);
out.hasLayout = /layout/i.test(out.newDrawer); out.hasCriteria = /criteria|which records|applies/i.test(out.newDrawer);
await shot('2934-7-new-editor.png');
const cb = dr.getByRole('button', { name: /^Create$/ }); await cb.focus(); await page.keyboard.press('Enter'); await sleep(1200);
out.focusAfter = await active(); out.invalid = await dr.locator('[aria-invalid=true]').count(); out.required = (await dr.innerText()).match(/Required\.?/g)?.length;
out.nameFocused = await dr.getByLabel(/Rule name/).evaluate(e => e === document.activeElement).catch(() => 'n/a');
out.nameBox = await box(dr.getByLabel(/Rule name/));
await shot('2944-1-after-create.png');
// mouse click variant
await dr.getByRole('button', { name: /^Create$/ }).click(); await sleep(1200); out.focusAfterClick = await active();
await page.keyboard.press('Escape');
return out;
