// Group B2 (admin B) — C4 department storage on QA MF DeptMod, Z12 department layouts, E2E-2 setup on QA MF Open (layout QA MF L-Agent).
const DM = 'e8845f1d-1153-4c9c-b3a8-a74b08e078dc', QAD = 'a7265f03-326f-46ab-b009-f17bad4ad555', OPEN = '64625328-d671-4fe8-b323-b63b9d15a46c', LAG = '2765f377-5030-4512-8c29-43b133395d11';
await step('C4', async () => {
  const seen = []; const f = r => { const u = r.url(); if (u.includes(`/modules/${DM}/records`)) { const h = r.headers(); seen.push(r.method() + ' ' + u.replace(API, '').slice(0, 120) + ' hdr:' + Object.keys(h).filter(k => /dep|scope|org/i.test(k)).map(k => k + '=' + h[k]).join(',')); } };
  page.on('request', f); await go(`/modules/${DM}`, 7000); page.off('request', f);
  const depts = arr((await api('GET', '/desk/departments')).j.data).map(d => `${d.name}=${d.id.slice(0, 8)}`);
  const a = await mkRec(DM, { name: 'QA MF dept rec plain' }); const ga = a.id ? (await api('GET', `/modules/${DM}/records/${a.id}`)).j : null;
  const deptKeys = ga ? JSON.stringify(ga.data).match(/"[a-z_A-Z]*[dD]epartment[a-z_A-Z]*":[^,]{0,60}/g) : null;
  const b = await api('POST', `/modules/${DM}/records`, { data: [{ field: 'name', value: enc('QA MF dept rec hdr') }] }, { 'x-department-id': QAD });
  const c = await api('POST', `/modules/${DM}/records`, { data: [{ field: 'name', value: enc('QA MF dept rec field') }], department_id: QAD });
  const lst = arr((await api('GET', `/modules/${DM}/records?page_size=50`)).j.data).length; const lstH = arr((await api('GET', `/modules/${DM}/records?page_size=50`, undefined, { 'x-department-id': QAD })).j.data).length;
  const m = (await mods()).find(x => x.id === DM);
  rec('C4.admin', 'INFO', `module storageScope=${m && m.storageScope}; departments visible to admin B: ${depts.join(', ')}; list page requests: ${seen.join(' | ').slice(0, 300)}; plain create → ${a.s} ${a.err}; dept keys on record ${JSON.stringify(deptKeys)}; with x-department-id → ${b.s} ${((b.j && b.j.error && b.j.error.message) || '').slice(0, 80)}; with department_id in body → ${c.s}; list without header ${lst}, with QA dept header ${lstH}`, { recs: [a.id, b.j && b.j.data && b.j.data.id, c.j && c.j.data && c.j.data.id] });
});
await step('Z12', async () => {
  await go(`/settings/modules-and-fields/${M.tickets}`, 6000); await page.getByRole('tab', { name: 'Layouts' }).first().click().catch(() => { }); await sleep(2000);
  const t = (await txt()).replace(/\s+/g, ' '); const picker = /Department/i.test(t.slice(t.indexOf('Layouts'), t.indexOf('Layouts') + 600));
  const s = await shot('Z12-ticket-layouts');
  const out = [];
  for (const [n, id] of Object.entries({ tasks: M.tasks, calls: M.calls, events: M.events, contracts: M.contracts, products: M.products, tickets: M.tickets })) { const f = (await fieldsOf(id)).find(x => /^department/.test(x.fieldName)); out.push(`${n}: ${f ? f.fieldName + ' req=' + f.required + ' onLayouts=' + (f.layouts || []).length + ' removable=' + (f.isDeletable) : 'none'}`); }
  rec('Z12', 'MISSING', `Tickets Layouts tab has a department picker=${picker}; Department field per module: ${out.join('; ')}. Layouts remain per profile, not per department — still missing (retest when built)`, { shot: s });
});
await step('E2E-2.setup', async () => {
  const add = await addFields(OPEN, [{ fieldName: 'qa_e2e_kind', datatypeKey: 'pick_list', datatypeOptions: { allowed_values: ['Hardware', 'Software'] } }, { fieldName: 'qa_e2e_serial', datatypeKey: 'single_line' }]);
  const lay = await getLayout(OPEN, LAG); const F = (await fieldsOf(OPEN)).filter(f => ['qa_e2e_kind', 'qa_e2e_serial'].includes(f.fieldName));
  const b = JSON.parse(JSON.stringify(lay)); delete b.id;
  for (const v of ['CREATE', 'QUICK_CREATE', 'DETAIL']) { const ss = b.views[v] && b.views[v].layout && b.views[v].layout.sections; if (!ss) continue; if (!ss.some(s => s.label && s.label.en === 'QA MF E2E section')) ss.push({ id: 'qa-e2e-' + v.toLowerCase(), label: { en: 'QA MF E2E section' }, columns: [{ id: 'qa-e2e-' + v.toLowerCase() + '-c1', fields: F.map(f => JSON.parse(JSON.stringify(f))) }], tab_order: 'left_to_right' }); }
  const kind = F.find(f => f.fieldName === 'qa_e2e_kind'), ser = F.find(f => f.fieldName === 'qa_e2e_serial');
  b.dependencies = [{ id: 'qa-e2e-dep-1', parentFieldId: kind.id, parentValues: ['Hardware'], action: 'SHOW', childFieldIds: [ser.id] }, { id: 'qa-e2e-dep-2', parentFieldId: kind.id, parentValues: ['Hardware'], action: 'REQUIRE', childFieldIds: [ser.id] }];
  const p = await api('PUT', `/modules/${OPEN}/layouts/${LAG}`, b); const g = await getLayout(OPEN, LAG);
  const L2 = arr((await api('GET', `/modules/${OPEN}/layouts`)).j.data).map(l => `${l.name} access=${l.accessMode}`);
  rec('E2E-2.setup', 'INFO', `fields → ${add.s}; L-Agent save with new section + SHOW/REQUIRE rules → ${p.s} ${p.s >= 300 ? (p.t || '').slice(0, 200) : ''}; stored deps ${JSON.stringify(g.dependencies).slice(0, 300)}; sections ${g.views.CREATE.layout.sections.map(s => s.label && s.label.en).join(',')}; layouts ${L2.join(' ; ')}`);
});
return done();
