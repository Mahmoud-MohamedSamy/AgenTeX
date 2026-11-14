const PA = '1623a133-8cc1-4dc2-8f93-c6483f9cd2f9', PU = 'cf48ae47-db59-48c3-b787-3c48bd20ea75';
const pols = D((await api('GET', '/desk/sla/policies?department_id=' + MK)).j) || []; const P2 = (pols.find(p => p.name === 'QA GL W3 SLA 2') || {}).id; out.P2 = P2;
const body = { department_id: MK, name: 'QA GL W3 Allowance', description: null, type: 'allowance', allowance: 50, cycle: 'monthly', carry_forward: false, allow_additional_usage: false, policy_id: P2, row_version: 1 };
for (const m of ['PATCH', 'PUT']) { const r = await api(m, '/desk/sla/support-plans/' + PA, body); out['api_' + m] = r.s + ' ' + r.t.slice(0, 260); if (r.s < 300) break; }
const g = D((await api('GET', '/desk/sla/support-plans?department_id=' + MK)).j).find(p => p.id === PA); out.paAfter = { allowance: g.allowance, policy: g.policy?.name, rv: g.row_version };
const dlg = () => page.locator('[role=dialog]').last(); const MC = page.locator('#main-content');
// edit unused plan (Unlimited): change SLA to SLA 2
await go('/settings/automation/support-plans?department=' + MK, 10000); await MC.getByText('QA GL W3 Unlimited', { exact: true }).first().click(); await sleep(2500);
out.unlNote = (await dlg().innerText()).replace(/\s+/g, ' ').slice(0, 200);
await dlg().getByRole('button', { name: 'SLA policy' }).click(); await sleep(1000); await page.getByRole('option', { name: 'QA GL W3 SLA 2' }).first().click().catch(() => page.getByText('QA GL W3 SLA 2').last().click()); await sleep(600);
await dlg().getByRole('button', { name: 'Save' }).click(); await sleep(3000); out.unlToast = (await page.locator('[data-sonner-toast],[role=status],[role=alert]').allInnerTexts().catch(() => [])).join(' | ');
const gu = D((await api('GET', '/desk/sla/support-plans?department_id=' + MK)).j).find(p => p.id === PU); out.unlAfter = gu.policy?.name;
// replacement flow
await go('/settings/automation/support-plans?department=' + MK, 10000); await MC.getByText('QA GL W3 Allowance', { exact: true }).first().click(); await sleep(2500);
await dlg().getByRole('button', { name: 'Create replacement' }).click(); await sleep(2500);
out.replForm = (await dlg().innerText()).replace(/\s+/g, ' ').slice(0, 700); await shot('w3/W3-07-replacement-form');
await page.keyboard.press('Escape'); await sleep(1000);
// row menu
await go('/settings/automation/support-plans?department=' + MK, 10000);
const row = MC.locator('tr').filter({ hasText: 'QA GL W3 V2' }).first(); await row.locator('button').last().click().catch(e => out.kErr = String(e.message).slice(0, 80)); await sleep(1500);
out.menu = (await page.locator('[role=menu]').last().innerText().catch(() => 'no menu')).replace(/\s+/g, ' '); await shot('w3/W3-08-row-menu'); await page.keyboard.press('Escape');
const rowA = MC.locator('tr').filter({ hasText: 'QA GL W3 Allowance' }).first(); await rowA.locator('button').last().click().catch(() => {}); await sleep(1500);
out.menuInUse = (await page.locator('[role=menu]').last().innerText().catch(() => 'no menu')).replace(/\s+/g, ' '); await page.keyboard.press('Escape');
return fin({ out });
