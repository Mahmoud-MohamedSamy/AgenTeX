// Read-only: departments, activity module fields/layouts, counts, ticket counts
const out = {};
out.myDepts = (await api('GET', '/desk/agents/me/departments')).j;
out.depts = ((await api('GET', '/desk/departments')).j || {}).data;
out.sendAsEmailDepts = (await api('GET', '/desk/tickets/send-as-email/departments')).t;
for (const k of ['tasks', 'calls', 'events', 'tickets']) {
  const f = await fieldsOf(M[k]);
  out[k] = { fields: f.map(x => ({ n: x.fieldName, t: x.dataType || x.type, req: x.required, ro: x.readOnly || x.isReadOnly, sys: x.isSystem, opts: (x.options || x.picklistValues || (x.config && x.config.options) || []).map(o => o.value || o.label || o).slice(0, 15), def: x.defaultValue })),
    count: ((await api('GET', `/modules/${M[k]}/records?page=1&per_page=1`)).j || {}).meta,
    layouts: arr((await api('GET', `/modules/${M[k]}/layouts`)).j.data).map(l => ({ id: l.id, name: l.name, def: l.isDefault })) };
}
return done(out);
