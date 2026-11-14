const T1 = '3ecf52a9-f3cd-41c6-a60f-931582cac7cd';
const me = await api('GET', '/iam/me'); out.me = me.s + ' ' + JSON.stringify(D(me.j)?.email || D(me.j)?.user?.email || '').slice(0, 60);
const t = await api('GET', '/desk/tickets/' + T1); out.ticket = t.s;
const l = await api('GET', '/workflow/custom-actions'); const arr2 = D(l.j); out.list = l.s + ' n=' + (Array.isArray(arr2) ? arr2.length : JSON.stringify(arr2).slice(0, 100)) + ' qa=' + (Array.isArray(arr2) ? arr2.filter(a => /QA GL W3/.test(a.name)).map(a => a.name).join(',') : '');
const r1 = await api('POST', '/workflow/custom-actions/c0e196f8-7ad6-4978-a910-7ae0bf8513ca/run', { runtimeInputs: { ref: 'QAREF-AGENTC' }, context: { app: 'desk', moduleId: TM, recordId: T1, label: 'x' } }); out.runRestricted = r1.s + ' ' + r1.t.slice(0, 250);
if (t.s < 300) { await go('/views/all/tickets/' + T1, 12000); const b = page.locator('#main-content').getByRole('button', { name: 'Actions', exact: true }); out.hasActionsBtn = await b.count(); if (out.hasActionsBtn) { await b.click(); await sleep(1500); out.menu = (await page.locator('[role=menu]').last().innerText().catch(() => '')).replace(/\s+/g, ' '); } await shot('w3/W3-18-agentC-ticket'); }
await go('/settings/developer/custom-actions', 9000); out.setupPage = page.url().replace(H, '') + ' :: ' + (await mtxt()).slice(0, 200);
return fin({ out });
