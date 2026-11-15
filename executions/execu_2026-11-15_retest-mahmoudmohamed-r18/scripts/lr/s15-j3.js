const mid = await modId(); const out = {}; const f = x => FP + x;
const L = await getLayout(mid, I.layout); const b = JSON.parse(JSON.stringify(L)); delete b.id; for (const k of ['displayInHelpCenter','helpCenterDisplayName','helpCenter','departmentIds','defaultDepartmentIds','ticketStatuses','allowNonDepartmentAgents']) delete b[k];
for (const v of Object.values(b.views)) for (const s of v.layout.sections) for (const c of s.columns) c.fields = c.fields.filter(x => x.fieldName !== f('date'));
const u = await api('PUT', '/modules/' + mid + '/layouts/' + I.layout, b); out.put = SR(u).slice(0, 400); LED('changed layout QA RT18 Layout: removed field qa_rt18_date (J3) (Leads)');
for (const k of ['rVip', 'rBasic', 'rRadio']) { const g = (await getRule(mid, I[k])).j.data; out[k] = g.status + ' err=' + JSON.stringify(g.definitionError || null).slice(0, 300) + ' warn=' + JSON.stringify(g.warnings || g.issues || null).slice(0, 300); }
out.keys = Object.keys((await getRule(mid, I.rVip)).j.data).join(',');
return out;
