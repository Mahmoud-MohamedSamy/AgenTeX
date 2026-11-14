const A = 'c0e196f8-7ad6-4978-a910-7ae0bf8513ca', E2 = 'eaf5a661-14b7-4d93-828d-c44e018b0a6d';
const rr = await api('POST', '/workflow/rules', { moduleId: TM, departmentIds: [MK], name: 'QA GL W3 WF uses echo 2', isActive: false, mode: 'Recurring', trigger: { kind: 'RecordCreated' }, criteria: { kind: 'StringMatch', field: 'subject', operator: 'StartsWith', stringValue: 'QA GL W3 WF ', caseInsensitive: false }, actions: [{ order: 0, delaySeconds: 0, type: 'RunCustomAction', customActionId: E2, customActionInputs: { ref: 'QAREF-WF' } }] });
out.rule = rr.s + ' ' + (rr.s >= 300 ? rr.t.slice(0, 300) : ''); const rid = rr.j?.data?.id; if (rid) CREATED.push({ kind: 'wf_rule', id: rid, name: 'QA GL W3 WF uses echo 2' });
// prerequisite delete: A is needed by E2
const dA = await api('DELETE', '/workflow/custom-actions/' + A); out.delPrereq = dA.s + ' ' + dA.t.slice(0, 250);
// UI delete of E2 (used by rule)
await go('/settings/developer/custom-actions', 10000);
await page.getByRole('button', { name: 'Actions for QA GL W3 echo 2', exact: true }).click(); await sleep(1200); await page.getByRole('menuitem', { name: /^Delete/ }).click(); await sleep(2000);
const d = page.locator('[role=dialog],[role=alertdialog]').last(); out.delDlg = (await d.innerText().catch(() => '')).replace(/\s+/g, ' ').slice(0, 500); await shot('w3/W3-20-delete-used-by-rule');
await d.getByRole('button', { name: 'Delete', exact: true }).click(); await sleep(3000); out.delToast = (await page.locator('[data-sonner-toast],[role=status],[role=alert]').allInnerTexts().catch(() => [])).join(' | ');
out.e2After = (await api('GET', '/workflow/custom-actions/' + E2)).s;
if (rid) { const rl = D((await api('GET', '/workflow/rules?moduleId=' + TM)).j); const arrR = Array.isArray(rl) ? rl : (rl?.items || []); const me = arrR.find(x => x.id === rid); out.ruleAfter = me ? JSON.stringify({ isActive: me.isActive, actions: me.actions, status: me.status, warnings: me.warnings || me.issues }).slice(0, 500) : 'rule not in list (n=' + arrR.length + ')'; }
return fin({ out });
