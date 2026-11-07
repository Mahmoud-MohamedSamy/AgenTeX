const o = {}; const ACC = 'c0e05c3e-aa51-47ef-be50-53fd4c6edcb1';
const r = await api('o', 'POST', `desk:/modules/${X.TK}/records`, { data: [{ field: 'subject', value: { kind: 'string', value: 'QA RT12 2796 accounting no layout' } }, { field: 'department', value: { kind: 'string', value: ACC } }, { field: 'status', value: { kind: 'string', value: 'Open' } }] });
o.create = X.err(r) + ' ' + (r.s >= 400 ? r.t.slice(0, 300) : ''); const id = r.j?.data?.id; if (id) ledger('ticket "QA RT12 2796 accounting no layout" ' + id + ' (QA NDC Accounting)');
const g = await api('o', 'GET', `desk:/modules/${X.TK}/records/${id}`); o.layout = g.j?.data?.layout_id || g.j?.data?.layoutId; o.id = id;
return o;
