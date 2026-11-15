const mid = await modId(); const out = {}; const f = x => FP + x;
const L = await getLayout(mid, I.layout); const b = JSON.parse(JSON.stringify(L)); delete b.id; for (const k of ['displayInHelpCenter','helpCenterDisplayName','helpCenter','departmentIds','defaultDepartmentIds','ticketStatuses','allowNonDepartmentAgents']) delete b[k];
for (const v of Object.values(b.views)) v.layout.sections = v.layout.sections.filter(s => s.id !== 'sec-qa-rt18-b');
const u = await api('PUT', '/modules/' + mid + '/layouts/' + I.layout, b); out.J6put = SR(u).slice(0, 400); if (u.s < 300) LED('changed layout QA RT18 Layout: deleted section Sec B (J6) (Leads)');
// J8: remove option 'Other' from type
const F = (await fieldsOf(mid)).find(x => x.fieldName === f('type')); out.typeOpts = JSON.stringify(F.datatypeOptions);
const nv = (F.datatypeOptions.allowed_values || []).filter(x => (x.value || x) !== 'Other');
let p = await api('PATCH', '/modules/' + mid + '/fields/' + F.id, { datatypeOptions: { ...F.datatypeOptions, allowed_values: nv } }); out.J8patch = SR(p).slice(0, 400);
if (p.s >= 400 && p.s !== 422) { p = await api('PUT', '/modules/' + mid + '/fields/' + F.id, { ...F, datatypeOptions: { ...F.datatypeOptions, allowed_values: nv } }); out.J8put = SR(p).slice(0, 400); }
if (p.s < 300) LED('changed field qa_rt18_type: removed option Other (J8) (Leads)');
out.typeOptsAfter = JSON.stringify((await fieldsOf(mid)).find(x => x.fieldName === f('type')).datatypeOptions.allowed_values);
for (const k of ['rBasic', 'rRadio', 'rVip']) { const g = (await getRule(mid, I[k])).j.data; out[k] = g.status + ' stale=' + JSON.stringify(g.staleTargets).slice(0, 500) + ' err=' + JSON.stringify(g.definitionError); }
return out;
