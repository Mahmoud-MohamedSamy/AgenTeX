const tid = id => page.locator(`[data-testid="${id}"]`);
const R = {};
await go('/settings/integrations/tia'); await page.waitForFunction(() => document.body.innerText.includes('Tia switch'), null, { timeout: 90000 }).catch(() => {}); await sleep(2500);
await tid('tia-summary-card').locator('button', { hasText: 'Edit' }).click(); await sleep(2500);
const dlg = page.locator('[role=dialog]').last();
await dlg.locator('[role=tab], button', { hasText: /^Tools$/ }).first().click(); await sleep(1500);
const cnt = async () => ((await dlg.innerText()).match(/Added Tools\s*(\d+)/) || [])[1];
R.before = await cnt();
await dlg.locator('button', { hasText: /Add Tools/ }).first().click(); await sleep(2000);
const item = page.getByText('Propose running an action', { exact: true }).first();
R.itemTag = await item.evaluate(e => e.tagName + ' ' + (e.closest('button,[role=option],[role=menuitem],label')?.tagName || '')).catch(() => 'n/a');
await item.click().catch(e => R.err = String(e).slice(0, 80)); await sleep(2000);
R.after = await cnt();
const t = await dlg.innerText(); R.msgs = t.split('\n').filter(l => /choose which|custom action|no actions|actions before|Allowed actions|Select.*action/i.test(l)).slice(0, 10);
R.addedSection = t.split('\n').slice(0, 30).join(' / ').slice(0, 900);
await shot('N2-02-run-action-on', { fullPage: true });
R.saveDisabled = await dlg.locator('button', { hasText: /^Save Draft$/ }).isDisabled().catch(() => 'n/a');
// cancel, never save
await dlg.locator('button', { hasText: /^Cancel$/ }).first().click().catch(() => {}); await sleep(1500);
const c = page.locator('[role=dialog] button, [role=alertdialog] button', { hasText: /Discard|Leave/i }); if (await c.count()) { await c.first().click(); await sleep(1000); }
R.closed = !(await page.locator('[role=dialog]').count());
await page.reload(); await sleep(5000); R.notLive = (await text()).includes('not live yet');
return R;
