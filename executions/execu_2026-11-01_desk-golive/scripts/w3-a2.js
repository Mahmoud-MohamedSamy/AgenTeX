const PID = '4283701b-5654-4d3c-a168-7dd7a7860af4';
const dlg = () => page.locator('[role=dialog]').last();
const openNew = async () => { await go('/settings/automation/support-plans?department=' + MK, 9000); await page.getByRole('button', { name: /New Plan/i }).first().click(); await sleep(3000); };
const pick = async (label, opt) => { await dlg().getByRole('button', { name: label }).click(); await sleep(1200); const o = page.getByRole('option', { name: opt }).first(); if (await o.count()) await o.click(); else await page.getByText(opt, { exact: false }).last().click(); await sleep(800); };
const optsOf = async label => { await dlg().getByRole('button', { name: label }).click(); await sleep(1200); const t = await page.locator('[role=listbox],[role=menu]').last().innerText().catch(() => ''); await page.keyboard.press('Escape'); await sleep(500); return t.replace(/\s+/g, ' ').slice(0, 300); };
const save = async () => { await dlg().getByRole('button', { name: 'Save' }).click(); await sleep(3500); return { open: await dlg().count(), msg: (await dlg().innerText().catch(() => '')).replace(/\s+/g, ' ').match(/[^.]*(required|must|invalid|already|between|at least|greater|exist)[^.]*/gi) || [], toast: (await page.locator('[data-sonner-toast],[role=status],[role=alert]').allInnerTexts().catch(() => [])).join(' | ').slice(0, 300) }; };
// W3-04 empty name / no SLA
await openNew(); out.typeOpts = await optsOf('Plan Type'); out.cycleOpts = await optsOf('Credit Cycle');
out.w304_empty = await save(); await shot('w3/W3-04-empty');
await page.keyboard.press('Escape'); await sleep(800);
// W3-02 unlimited on screen
await openNew(); await dlg().locator('input').first().fill('QA GL W3 Unlimited'); await dlg().locator('textarea').fill('QA GL W3 plan, unlimited');
await pick('SLA policy', 'QA GL W3 SLA'); await pick('Plan Type', /unlimited/i);
out.w302_form = (await dlg().innerText()).replace(/\s+/g, ' ').slice(0, 600); out.w302 = await save(); await shot('w3/W3-02-after-save');
// W3-03 allowance 2 / monthly
await openNew(); await dlg().locator('input').first().fill('QA GL W3 Allowance'); await pick('SLA policy', 'QA GL W3 SLA');
await dlg().locator('input[type=number]').fill('2'); out.w303 = await save(); await shot('w3/W3-03-after-save');
const l = await api('GET', '/desk/sla/support-plans?department_id=' + MK); out.plans = (D(l.j) || []).map(p => { CREATED.push({ kind: 'support_plan', id: p.id, name: p.name }); return p; });
await go('/settings/automation/support-plans?department=' + MK, 8000); await shot('w3/W3-02-list');
return fin({ out });
