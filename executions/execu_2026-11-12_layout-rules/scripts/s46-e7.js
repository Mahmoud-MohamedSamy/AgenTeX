const mid = await modId(); const lid = I.layout; const out = {};
const cur = await getLayout(mid, lid); fs.writeFileSync(RUN + '/out/layout-pre-e7.json', JSON.stringify(cur));
const on = process.env.E7 !== 'off';
for (const v of Object.values(cur.views)) for (const s of v.layout.sections) for (const c of s.columns) for (const f of c.fields) if (f.fieldName === 'qa_lr_order') { f.required = on; f.config = { ...f.config, required: on }; }
const b = { ...cur }; delete b.id; for (const k of ['displayInHelpCenter','helpCenterDisplayName','departmentIds','defaultDepartmentIds','ticketStatuses','allowNonDepartmentAgents']) delete b[k];
out.put = SR(await api('PUT','/modules/'+mid+'/layouts/'+lid, b)).slice(0,300);
const g = await getLayout(mid, lid); out.now = g.views.CREATE.layout.sections.flatMap(s=>s.columns.flatMap(c=>c.fields)).find(f=>f.fieldName==='qa_lr_order').required;
return out;
