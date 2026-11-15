const mid = await modId(); const L = I.layout; const o = {}; const cm = await modId('contacts');
// main rule used by UI tickets
if (false) { const r = await mkRule(mid, { name: P + ' text no BAD', description: 'original', layoutId: L, primaryField: 'qa_rt18v_text', branches: [B(C('startsWith', 'qa_rt18v_text', 'BAD'), 'QA RT18 text cannot start with BAD')] }); o.rText = SR(r).slice(0, 200); if (r.j && r.j.data) { I.rText = r.j.data.id; SAVE(); } }
// 3020 K3
{ const id = I.rK3;
  const g = await getRule(cm, id); const d = await delRule(cm, id); const still = await getRule(mid, id);
  const pu = await putRule(cm, id, { ...still.j.data, description: 'via contacts' }); const still2 = await getRule(mid, id);
  const unk = await delRule(mid, '00000000-0000-0000-0000-00000000abcd');
  o.k3 = { getOther: SR(g).slice(0, 120), delOther: SR(d).slice(0, 160), getLeads: still.s, putOther: SR(pu).slice(0, 120), descAfter: still2.j && still2.j.data.description, delUnknown: SR(unk).slice(0, 100) }; }
// 3014 J2
{ const d0 = { fieldName: 'qa_rt18v_j2', datatypeKey: 'single_line', labels: { en: P + ' v j2' }, datatypeOptions: {}, required: false, unique: false, uniquePeerModuleIds: [] };
  const f = (await fieldsOf(mid)).find(x => x.fieldName === 'qa_rt18v_j2');
  const r = await mkRule(mid, { name: P + ' J2 rule', layoutId: L, primaryField: 'qa_rt18v_email', branches: [B(C('isNull', 'qa_rt18v_email'), 'QA RT18 J2 email required when j2 = y', { when: C('eq', 'qa_rt18v_j2', 'y') })] }); if (!(r.j && r.j.data)) return { j2rule: SR(r) }; I.rJ2 = r.j.data.id; SAVE();
  const pre = await mkRec(mid, { first_name: 'QA', last_name: P + ' J2 pre', qa_rt18v_j2: 'y' }, L);
  const del = await api('DELETE', '/modules/' + mid + '/fields/' + f.id);
  const st = await ruleState(mid, I.rJ2); const still = (await fieldsOf(mid)).some(x => x.fieldName === 'qa_rt18v_j2');
  o.j2 = { preCheck: pre.s + ' ' + pre.err.slice(0, 120), delete: SR(del).slice(0, 400), fieldStill: still, rule: st }; }
// 3015 J6
{ const Ls = arr((await api('GET', '/modules/' + mid + '/layouts')).j.data); const def = Ls.find(x => x.isDefault); const full = await getLayout(mid, def.id);
  const c = await api('POST', '/modules/' + mid + '/layouts', { name: P + ' J6 Layout', description: 'QA J6', views: Object.fromEntries(Object.entries(full.views || {}).map(([k, v]) => [k, { layout: v.layout }])), status: full.status, accessMode: full.accessMode, assignedProfiles: full.assignedProfiles });
  const lid = c.j && c.j.data && c.j.data.id; LED('layout "QA RT18 J6 Layout" ' + lid + ' (Leads)'); I.lJ6 = lid; SAVE();
  const r = await mkRule(mid, { name: P + ' J6 rule', layoutId: lid, primaryField: 'first_name', branches: [B(C('eq', 'first_name', 'J6BAD'), 'QA J6')] }); I.rJ6 = r.j && r.j.data && r.j.data.id; SAVE(); o.j6rule = SR(r).slice(0, 150);
  const d = await api('DELETE', '/modules/' + mid + '/layouts/' + lid); const st = I.rJ6 ? await ruleState(mid, I.rJ6) : '-';
  const inList = (await rules(mid)).find(x => x.id === I.rJ6); const layStill = await api('GET', '/modules/' + mid + '/layouts/' + lid);
  o.j6 = { delete: SR(d).slice(0, 400), layoutGet: layStill.s, rule: st, listed: inList ? inList.status + ' ce=' + inList.conditionError : 'not listed' }; }
return o;
