const A = 'c0e196f8-7ad6-4978-a910-7ae0bf8513ca', SRC = '56a69b17-df26-4ecc-a5f6-77c95f75f39c', T1 = '3ecf52a9-f3cd-41c6-a60f-931582cac7cd', WH = 'da6d011e-6d09-4645-a3ed-c828bc374e37';
const a2 = await api('POST', '/workflow/custom-actions', { sourceId: SRC, name: 'QA GL W3 echo 2', description: 'QA GL W3 depends on echo', method: 'POST', path: '/' + WH + '/second/{ref}', targetApps: ['desk'], usageGuide: '', inputBindings: [{ name: 'ref', location: 'path', required: true, handling: 'runtime' }, { name: 'note', location: 'body', required: true, handling: 'from_dependency' }], dependencies: [{ prerequisiteActionId: A, mappings: [{ fromPath: 'echo', toLocation: 'body', toName: 'note', template: 'dep={value}' }] }], errorMappings: [], outputMappings: [] });
out.create = a2.s + ' ' + (a2.s >= 300 ? a2.t.slice(0, 400) : ''); const id2 = a2.j?.data?.id; if (id2) CREATED.push({ kind: 'custom_action', id: id2, name: 'QA GL W3 echo 2' });
out.pub = (await api('POST', '/workflow/custom-actions/' + id2 + '/publish')).s;
// circular: make A depend on echo 2
const a = D((await api('GET', '/workflow/custom-actions/' + A)).j); const c = await api('PATCH', '/workflow/custom-actions/' + A, { dependencies: [{ prerequisiteActionId: id2, mappings: [] }], version: a.version }); out.circular = c.s + ' ' + c.t.slice(0, 250);
const r = await api('POST', '/workflow/custom-actions/' + id2 + '/run', { runtimeInputs: { ref: 'QAREF-DEP' }, context: { app: 'desk', moduleId: TM, recordId: T1, label: 'x' } });
out.run = r.s + ' ' + JSON.stringify((D(r.j)?.steps || []).map(s => [s.actionName, s.url, s.requestBody, s.outcome, s.error])).slice(0, 900);
await go('/views/all/tickets/' + T1, 12000); await page.locator('#main-content').getByRole('button', { name: 'Actions', exact: true }).click(); await sleep(1200); out.menu = (await page.locator('[role=menu]').last().innerText()).replace(/\s+/g, ' ');
await page.getByRole('menuitem', { name: 'QA GL W3 echo 2' }).click(); await sleep(2500); const d = page.locator('[role=dialog]').last(); out.dlg = (await d.innerText()).replace(/\s+/g, ' ').slice(0, 300);
await d.locator('input:visible').first().fill('QAREF-DEP-UI'); await d.getByRole('button', { name: /^Run/ }).last().click(); await sleep(8000); const det = d.getByText(/Run details/).first(); if (await det.count()) { await det.click(); await sleep(1500); }
out.ui = (await d.innerText()).replace(/\s+/g, ' ').replace(/qa-gl-w3-dummy-secret-999/g, '<SECRET>').slice(0, 900); await shot('w3/W3-17-dependency-run');
return fin({ out });
