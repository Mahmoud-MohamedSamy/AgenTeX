const mid = await modId(); const L = await getLayout(mid, I.layout); const b = JSON.parse(JSON.stringify(L)); delete b.id; for (const k of ['displayInHelpCenter','helpCenterDisplayName','helpCenter','departmentIds','defaultDepartmentIds','ticketStatuses','allowNonDepartmentAgents']) delete b[k];
const want = ['sec-leads-1', 'sec-qa-rt18-a', 'sec-qa-rt18-b', 'sec-qa-rt18-main'];
for (const v of Object.values(b.views)) { const s = v.layout.sections; s.sort((x, y) => { const ix = want.indexOf(x.id), iy = want.indexOf(y.id); return (ix < 0 ? 99 : ix) - (iy < 0 ? 99 : iy); }); }
const r = await api('PUT', '/modules/' + mid + '/layouts/' + I.layout, b);
const g = await getLayout(mid, I.layout);
return { put: SR(r).slice(0, 300), order: Object.fromEntries(Object.entries(g.views).map(([k, v]) => [k, v.layout.sections.map(s => s.id).join(',')])), firstSecFields: g.views.CREATE.layout.sections[0].columns.flatMap(c => c.fields.map(f => f.fieldName)) };
