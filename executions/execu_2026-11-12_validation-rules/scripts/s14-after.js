// J1 delete checked field, J2 delete field used in "Applies when", J4 remove a pick-list value used in a rule, J6 delete a layout that has rules
const mid = await modId(); const L = I.layout; const isDesk = APP === 'desk'; const sfx = isDesk ? '-desk' : '';
const mkField = async (name, dt, vals) => { const d = { fieldName: 'qa_vr_' + name, datatypeKey: dt, labels: { en: P + ' ' + name }, datatypeOptions: vals ? { allowed_values: vals } : {}, ...(vals ? { config: { allowed_values: vals } } : {}), required: false, unique: false, uniquePeerModuleIds: [] }; const r = await api('POST', '/modules/' + mid + '/fields', { fields: [d] }); const f = (await fieldsOf(mid)).find(x => x.fieldName === d.fieldName); if (f) LED('field ' + f.fieldName + ' ' + f.id); return f; };
const delField = async f => api('DELETE', '/modules/' + mid + '/fields/' + f.id);
const ruleState = async id => { const g = await getRule(mid, id); return g.s === 200 ? `status=${g.j.data.status} conditionError=${g.j.data.conditionError} warnings=${JSON.stringify(g.j.data.warnings)}` : 'GET ' + g.s; };
// J1
{ const f = await mkField('j1', 'single_line'); const r = await mkRule(mid, { name: P + ' J1 rule', layoutId: L, primaryField: f.fieldName, branches: [B(C('eq', f.fieldName, 'x'), 'QA J1')] });
  const d = await delField(f); const st = r.s < 300 ? await ruleState(r.j.data.id) : 'rule ' + r.s;
  RES('J1' + sfx, d.s >= 400 ? 'PASS' : 'CHECK', `delete field checked by an active rule -> ${SR(d).slice(0, 250)}; rule after: ${st}`);
  if (d.s >= 400 && r.s < 300) { await delRule(mid, r.j.data.id); const d2 = await delField(f); LED('J1 field deleted after rule ' + d2.s); } }
// J2
{ const f = await mkField('j2', 'single_line'); const r = await mkRule(mid, { name: P + ' J2 rule', layoutId: L, primaryField: 'qa_vr_long', branches: [B(C('isNull', 'qa_vr_long'), 'QA J2', { when: C('eq', f.fieldName, 'y') })] });
  const d = await delField(f); const st = r.s < 300 ? await ruleState(r.j.data.id) : 'rule ' + r.s;
  let save = ''; if (d.s < 300) { const x = await mkRec(mid, { ...I.base, qa_vr_text: 'j2' }, L); save = ` | record save after -> ${x.s} ${x.err.slice(0, 120)}`; }
  RES('J2' + sfx, d.s >= 400 ? 'PASS' : 'CHECK', `delete field used only in 'Applies when' -> ${SR(d).slice(0, 250)}; rule after: ${st}${save}`);
  if (r.s < 300) await delRule(mid, r.j.data.id); if (d.s >= 400) await delField(f); }
// J4 pick-list value used in a rule: remove 'Done' from qa_vr_pick
{ const r = await mkRule(mid, { name: P + ' J4 rule', layoutId: L, primaryField: 'qa_vr_radio', branches: [B(C('eq', 'qa_vr_radio', 'No'), 'QA J4')] });
  const f = (await fieldsOf(mid)).find(x => x.fieldName === 'qa_vr_radio');
  const body = { ...f, datatypeOptions: { ...(f.datatypeOptions || {}), allowed_values: ['Yes', 'Maybe'] }, config: { ...(f.config || {}), allowed_values: ['Yes', 'Maybe'] } };
  const u = await api('PUT', '/modules/' + mid + '/fields/' + f.id, body); const st = r.s < 300 ? await ruleState(r.j.data.id) : 'rule ' + r.s;
  const f2 = (await fieldsOf(mid)).find(x => x.fieldName === 'qa_vr_radio');
  RES('J4' + sfx, 'CHECK', `rename/remove radio value 'No' used by an active rule -> ${SR(u).slice(0, 250)}; values now ${JSON.stringify((f2.datatypeOptions || {}).allowed_values || (f2.config || {}).allowed_values)}; rule after: ${st}`);
  if (u.s < 300) { const back = await api('PUT', '/modules/' + mid + '/fields/' + f.id, { ...f2, datatypeOptions: f.datatypeOptions, config: f.config }); LED('J4 radio values restored ' + back.s); }
  if (r.s < 300) await delRule(mid, r.j.data.id); }
// J6 delete a layout that has rules
{ const Ls = arr((await api('GET', '/modules/' + mid + '/layouts')).j.data); const def = Ls.find(x => x.isDefault) || Ls[0]; const full = await getLayout(mid, def.id);
  const body = { name: P + ' J6 Layout', description: 'QA J6', views: Object.fromEntries(Object.entries(full.views || {}).map(([k, v]) => [k, { layout: v.layout }])), status: full.status, accessMode: full.accessMode, assignedProfiles: full.assignedProfiles };
  if (isDesk) Object.assign(body, { departmentIds: full.departmentIds, defaultDepartmentIds: full.defaultDepartmentIds, ticketStatuses: full.ticketStatuses, displayInHelpCenter: false });
  const c = await api('POST', '/modules/' + mid + '/layouts', body); const lid = c.j && c.j.data && c.j.data.id;
  if (!lid) RES('J6' + sfx, 'BLOCKED', 'could not create temp layout ' + SR(c).slice(0, 200));
  else { LED('layout J6 ' + lid); const r = await mkRule(mid, { name: P + ' J6 rule', layoutId: lid, primaryField: 'qa_vr_long', branches: [B(C('eq', 'qa_vr_long', 6), 'QA J6')] });
    const d = await api('DELETE', '/modules/' + mid + '/layouts/' + lid); const st = r.s < 300 ? await ruleState(r.j.data.id) : 'rule ' + r.s;
    const inList = (await rules(mid)).some(x => x.name === P + ' J6 rule');
    RES('J6' + sfx, d.s >= 400 || !inList || /disabled|conditionError=(?!null)/.test(st) ? 'PASS' : 'FAIL', `delete layout that has an active rule -> ${SR(d).slice(0, 200)}; rule after: ${st}; still listed: ${inList}`);
    if (d.s >= 400 && r.s < 300) { await delRule(mid, r.j.data.id); const d2 = await api('DELETE', '/modules/' + mid + '/layouts/' + lid); LED('J6 layout deleted after rule ' + d2.s); }
    else if (inList && r.s < 300) await delRule(mid, r.j.data.id); } }
return 'done';
