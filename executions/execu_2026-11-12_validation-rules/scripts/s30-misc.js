const mid = await modId(); const L = I.layout; const isDesk = APP === 'desk'; const sfx = isDesk ? '-desk' : '';
// I5 conditions per rule
{ const res = [];
  for (const n of [20, 50, 101]) { const br = Array.from({ length: n }, (_, i) => B(C('eq', 'qa_vr_long', i + 1), 'QA I5 ' + i)); const r = await mkRule(mid, { name: P + ' I5 ' + n, layoutId: L, primaryField: 'qa_vr_long', branches: br }); res.push(n + ':' + SR(r).slice(0, 120)); if (r.s < 300) await delRule(mid, r.j.data.id); }
  RES('I5' + sfx, 'INFO', 'conditions per rule -> ' + res.join(' | ')); }
// I4 rules per layout: count of distinct fields allowed (one active rule per field) - try 12 rules on different fields quickly
{ const fs_ = ['qa_vr_num', 'qa_vr_dec', 'qa_vr_cur', 'qa_vr_pct', 'qa_vr_long', 'qa_vr_date', 'qa_vr_dt', 'qa_vr_multi', 'qa_vr_radio', 'qa_vr_chk'];
  const made = []; let fail = '';
  for (const f of fs_) { const r = await mkRule(mid, { name: P + ' I4 ' + f, layoutId: L, primaryField: f, branches: [B(C('isNotNull', f), 'QA I4')], status: 'disabled' }); if (r.s < 300) made.push(r.j.data.id); else { fail = f + ' ' + SR(r).slice(0, 150); } }
  const total = (await rules(mid)).length; for (const id of made) await delRule(mid, id);
  RES('I4' + sfx, 'INFO', `created ${made.length} more rules on one layout (one per field) without a limit; module had ${total} rules at peak${fail ? '; refused: ' + fail : ''}`); }
// D22 'any' (has any value / always)
{ const r = await mkRule(mid, { name: P + ' D22 any', layoutId: L, primaryField: 'qa_vr_long', branches: [B({ op: 'any', field: 'qa_vr_long' }, 'QA D22 always')] });
  let s = 'op any -> ' + SR(r).slice(0, 160); if (r.s < 300) { const a = await mkRec(mid, { ...I.base, qa_vr_long: 5, qa_vr_phone: '+201001234567' }, L); const b = await mkRec(mid, { ...I.base, qa_vr_phone: '+201001234567' }, L); s += ` | value 5 -> ${a.s}; empty -> ${b.s}`; await delRule(mid, r.j.data.id); }
  RES('D22' + sfx, 'INFO', s); }
// H2 rule order
{ const o = await api('GET', VR(mid) + '/order'); const p = await api('PUT', VR(mid) + '/order', { ids: [] }); RES('H2' + sfx, 'INFO', `no rule-order API (GET /order ${o.s}, PUT /order ${p.s}); one active rule per field per layout, so order between rules only matters across fields (each field's rule runs; E8 shows all messages)`); }
// J3 remove the checked field from the layout
{ const r = await mkRule(mid, { name: P + ' J3 cur', layoutId: L, primaryField: 'qa_vr_cur', branches: [B(C('gt', 'qa_vr_cur', 999999), 'QA J3')] });
  const full = await getLayout(mid, L); const orig = JSON.parse(JSON.stringify(full.views));
  const views = {}; for (const [k, v] of Object.entries(full.views)) { const lo = JSON.parse(JSON.stringify(v.layout)); for (const s of lo.sections) for (const c of s.columns) c.fields = c.fields.filter(f => (f.fieldName || f.apiName) !== 'qa_vr_cur'); views[k] = { layout: lo }; }
  const body = { name: full.name, description: full.description, views, status: full.status, accessMode: full.accessMode, assignedProfiles: full.assignedProfiles, rowVersion: full.rowVersion };
  if (isDesk) Object.assign(body, { departmentIds: full.departmentIds, defaultDepartmentIds: full.defaultDepartmentIds, ticketStatuses: full.ticketStatuses, displayInHelpCenter: full.displayInHelpCenter });
  const u = await api('PUT', '/modules/' + mid + '/layouts/' + L, body);
  const st = r.s < 300 ? (await getRule(mid, r.j.data.id)).j.data : null;
  RES('J3' + sfx, 'INFO', `remove checked field from the rule's layout -> ${SR(u).slice(0, 250)}; rule after: status=${st && st.status} conditionError=${st && st.conditionError} warnings=${st && JSON.stringify(st.warnings)}`);
  if (u.s < 300) { const now = await getLayout(mid, L); const back = await api('PUT', '/modules/' + mid + '/layouts/' + L, { ...body, views: Object.fromEntries(Object.entries(orig).map(([k, v]) => [k, { layout: v.layout }])), rowVersion: now.rowVersion }); LED('J3 layout restored ' + back.s); }
  if (r.s < 300) await delRule(mid, r.j.data.id); }
return 'done';
