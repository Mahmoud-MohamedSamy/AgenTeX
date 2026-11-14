const PA = '1623a133-8cc1-4dc2-8f93-c6483f9cd2f9', PU = 'cf48ae47-db59-48c3-b787-3c48bd20ea75', K = 'c5a8482a-0bce-4fb0-94b5-ee7b939e72ac';
const MC = page.locator('#main-content'); const dlg = () => page.locator('[role=dialog],[role=alertdialog]').last();
const toast = async () => (await page.locator('[data-sonner-toast],[role=status],[role=alert]').allInnerTexts().catch(() => [])).join(' | ').slice(0, 300);
const menuOn = async (name, item) => { await go('/settings/automation/support-plans?department=' + MK, 10000); await MC.locator('tr').filter({ hasText: name }).first().locator('button').last().click(); await sleep(1200); await page.getByRole('menuitem', { name: item }).click(); await sleep(2500); };
// W3-09 delete in use (menu item disabled, seen in a11 run 1)
out.delApi = (await api('DELETE', '/desk/sla/support-plans/' + PA)).t.slice(0, 250);
out.stillThere = !!(D((await api('GET', '/desk/sla/support-plans?department_id=' + MK)).j) || []).find(p => p.id === PA);
// W3-08 discontinue
await menuOn('QA GL W3 Allowance', 'Discontinue'); out.discDlg = (await dlg().innerText().catch(() => '')).replace(/\s+/g, ' ').slice(0, 400); await shot('w3/W3-08-discontinue-dialog');
const db = dlg().getByRole('button', { name: /^Discontinue/ }); if (await db.count()) { await db.last().click(); await sleep(3000); } out.discToast = await toast();
await go('/settings/automation/support-plans?department=' + MK, 9000); await MC.getByText('Discontinued', { exact: true }).first().click(); await sleep(2500); out.discTab = (await MC.innerText()).replace(/\s+/g, ' ').match(/Discontinued[\s\S]{0,400}$/)?.[0]?.slice(0, 400); await shot('w3/W3-08-discontinued-tab');
const kr = await get(KM, K); out.contractAfter = { plan: kr.support_plan_name, status: kr.status };
const T1 = await api('GET', '/desk/tickets/3ecf52a9-f3cd-41c6-a60f-931582cac7cd/sla'); out.t1cov = JSON.stringify(D(T1.j)?.coverage).slice(0, 300);
await go('/modules/' + KM + '/records/new', 10000); await MC.getByRole('button', { name: 'Department' }).click(); await sleep(1000); await page.getByRole('option', { name: 'Marketing' }).first().click(); await sleep(1500);
await MC.getByRole('button', { name: 'Support Plan' }).click(); await sleep(2000); out.pickerAfter = (await page.locator('[role=listbox]').last().innerText().catch(() => '')).replace(/\s+/g, ' ').slice(0, 400); await shot('w3/W3-08-picker-after'); await page.keyboard.press('Escape');
// contract API with discontinued plan
const kd = await mk(KM, 'contract', 'QA GL W3 Contract disc', { contract_name: 'QA GL W3 Contract disc', account_id: '03e7893b-dc27-4a01-be0e-ac2f955a3b8d', start_date: '2026-11-13', end_date: '2027-01-31', support_plan: PA, department: MK }); out.kDisc = kd;
return fin({ out });
