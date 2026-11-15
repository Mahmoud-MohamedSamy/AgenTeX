const out = {}; const m = arr((await api('GET', '/modules')).j.data).find(x => x.moduleKey === 'desk_tickets'); const mid = m.id;
const L = arr((await api('GET', '/modules/' + mid + '/layouts')).j.data); const lay = L.find(x => x.isDefault) || L[0]; const full = await getLayout(mid, lay.id);
const onLay = full.views[Object.keys(full.views)[0]].layout.sections.flatMap(s => s.columns.flatMap(c => c.fields));
out.types = [...new Set(onLay.map(f => f.datatypeKey))];
const tgt = onLay.find(f => f.datatypeKey === 'single_line' && !f.isSystemManaged) || onLay.find(f => f.datatypeKey === 'single_line');
for (const dt of ['single_line', 'number', 'date', 'email', 'date_time', 'phone', 'multi_line']) { const pf = onLay.find(f => f.datatypeKey === dt && f.fieldName !== tgt.fieldName); if (!pf) { out[dt] = 'no field of this type on Standard'; continue; }
  const r = await api('POST', '/modules/' + mid + '/layout-rules', { name: P + ' desk pf ' + dt, layoutId: lay.id, primaryField: pf.fieldName, status: 'disabled', departmentIds: full.departmentIds, branches: [br({ op: 'isNotEmpty', field: pf.fieldName }, [show([tgt.fieldName])])] });
  out[dt] = pf.fieldName + ' -> ' + SR(r).slice(0, 220); if (r.j && r.j.data && r.j.data.id) { LED('layout rule "QA RT18 desk pf ' + dt + '" ' + r.j.data.id + ' (Desk Tickets) — deleted right away'); await api('DELETE', '/modules/' + mid + '/layout-rules/' + r.j.data.id); } }
return out;
