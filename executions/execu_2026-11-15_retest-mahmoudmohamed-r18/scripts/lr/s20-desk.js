const out = {}; const ms = arr((await api('GET', '/modules')).j.data); out.st = ms.length; const m = ms.find(x => x.moduleKey === 'desk_tickets'); if (!m) return { keys: ms.map(x => x.moduleKey).slice(0, 30) };
const mid = m.id; const L = arr((await api('GET', '/modules/' + mid + '/layouts')).j.data); const lay = L.find(x => x.isDefault) || L[0]; out.lay = lay.name;
const full = await getLayout(mid, lay.id); const onLay = full.views[Object.keys(full.views)[0]].layout.sections.flatMap(s => s.columns.flatMap(c => c.fields));
const F = await fieldsOf(mid); const pf = onLay.find(f => f.datatypeKey === 'pick_list' && !f.isSystemManaged) || onLay.find(f => f.datatypeKey === 'pick_list'); out.pf = pf && pf.fieldName;
const pv = (F.find(f => f.fieldName === pf.fieldName).datatypeOptions.allowed_values || [])[0]; out.pv = pv;
let targets = onLay.filter(f => f.fieldName !== pf.fieldName && !f.isSystemManaged).map(f => f.fieldName); out.nTargets = targets.length;
const mk = async n => { const acts = targets.slice(0, n).map(t => show([t])); const r = await api('POST', '/modules/' + mid + '/layout-rules', { name: P + ' desk cap ' + n, layoutId: lay.id, primaryField: pf.fieldName, status: 'disabled', departmentIds: full.departmentIds, branches: [br(eq(pf.fieldName, typeof pv === 'object' ? pv.value : pv), acts)] }); if (r.j && r.j.data && r.j.data.id) { LED('layout rule "QA RT18 desk cap ' + n + '" ' + r.j.data.id + ' (Desk Tickets) — deleted right away'); await api('DELETE', '/modules/' + mid + '/layout-rules/' + r.j.data.id); } return SR(r).slice(0, 300); };
const T2 = targets.slice(); targets.length = 0; for (let i = 0; i < 60; i++) targets.push(T2[i % 17] || T2[0]); out.c25 = await mk(25); out.c26 = await mk(26); out.c41 = await mk(41);
return out;
