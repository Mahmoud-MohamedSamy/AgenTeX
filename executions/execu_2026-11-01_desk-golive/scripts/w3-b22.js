const all = D((await api('GET', '/workflow/custom-actions')).j); const E2 = all.find(a => a.name === 'QA GL W3 echo 2').id; out.E2 = E2;
const rr = await api('POST', '/workflow/rules', { moduleId: TM, departmentIds: [MK], name: 'QA GL W3 WF uses echo 2', isActive: false, mode: 'Recurring', trigger: { kind: 'RecordCreated' }, criteria: { kind: 'StringMatch', field: 'subject', operator: 'StartsWith', stringValue: 'QA GL W3 WF ', caseInsensitive: false }, actions: [{ order: 0, delaySeconds: 0, type: 'RunCustomAction', customActionId: E2, customActionInputs: {} }] });
out.rule = rr.s + ' ' + (rr.s >= 300 ? rr.t.slice(0, 300) : ''); const rid = rr.j?.data?.id; if (rid) CREATED.push({ kind: 'wf_rule', id: rid, name: 'QA GL W3 WF uses echo 2' }); out.rid = rid;
await go('/settings/developer/custom-actions', 10000);
out.row = (await page.locator('#main-content tr').filter({ hasText: 'QA GL W3 echo 2' }).first().innerText()).replace(/\s+/g, ' ');
await page.getByRole('button', { name: 'Actions for QA GL W3 echo 2', exact: true }).click(); await sleep(1200); out.menu = (await page.locator('[role=menu]').last().innerText()).replace(/\s+/g, ' ');
await page.getByRole('menuitem', { name: /^Delete/ }).click(); await sleep(2000); const d = page.locator('[role=dialog],[role=alertdialog]').last(); out.delDlg = (await d.innerText().catch(() => '')).replace(/\s+/g, ' ').slice(0, 500); await shot('w3/W3-20-delete-used-action');
await page.keyboard.press('Escape'); await sleep(800);
return fin({ out });
