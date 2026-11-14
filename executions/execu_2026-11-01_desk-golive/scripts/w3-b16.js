const A = 'c0e196f8-7ad6-4978-a910-7ae0bf8513ca', T1 = '3ecf52a9-f3cd-41c6-a60f-931582cac7cd';
const all = D((await api('GET', '/workflow/custom-actions')).j) || []; const list = Array.isArray(all) ? all : (all.items || []);
const nd = list.find(a => a.name === 'NDC agency profile'); out.ndcDeps = nd ? JSON.stringify({ dependencies: nd.dependencies, inputBindings: nd.inputBindings }).slice(0, 900) : 'not found, n=' + list.length;
const login = list.find(a => /NDC login/.test(a.name)); out.ndcLoginOut = login ? JSON.stringify(login.outputMappings).slice(0, 400) : '';
const a = D((await api('GET', '/workflow/custom-actions/' + A)).j);
const ib = a.inputBindings.map(b => b.name === 'note' ? { ...b, handling: 'from_variable', variableName: 'qa_gl_w3_secret' } : b.name === 'count' ? { ...b, handling: 'fixed', fixedValue: '7' } : b);
const p = await api('PATCH', '/workflow/custom-actions/' + A, { inputBindings: ib, version: a.version }); out.patch = p.s + ' ' + (p.s >= 300 ? p.t.slice(0, 300) : '');
const r = await api('POST', '/workflow/custom-actions/' + A + '/run', { runtimeInputs: { ref: 'QAREF-VAR' }, context: { app: 'desk', moduleId: TM, recordId: T1, label: 'x' } });
out.run = r.s + ' ' + r.t.replace(/qa-gl-w3-dummy-secret-999/g, '<<PLAINTEXT SECRET>>').slice(0, 700);
// screen run dialog: does it still ask for note?
await go('/views/all/tickets/' + T1, 12000); await page.locator('#main-content').getByRole('button', { name: 'Actions', exact: true }).click(); await sleep(1200); await page.getByRole('menuitem', { name: 'QA GL W3 echo' }).click(); await sleep(2500);
const d = page.locator('[role=dialog]').last(); out.dlg = (await d.innerText()).replace(/\s+/g, ' ').slice(0, 300); await d.locator('input:visible').first().fill('QAREF-VAR-UI'); await d.getByRole('button', { name: /^Run/ }).last().click(); await sleep(6000);
const det = d.getByText('Run details (1 step)').first(); if (await det.count()) { await det.click(); await sleep(1500); } const st = d.getByText('Details', { exact: true }).last(); if (await st.count()) { await st.click(); await sleep(1500); }
out.uiDetails = (await d.innerText()).replace(/\s+/g, ' ').replace(/qa-gl-w3-dummy-secret-999/g, '<<PLAINTEXT SECRET>>').slice(0, 1200); await shot('w3/W3-16-run-details');
return fin({ out });
