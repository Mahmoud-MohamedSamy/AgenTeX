const mid = await modId();
const r = await api('POST', '/modules/' + mid + '/layout-rules', { name: P + ' H4 layout rule', layoutId: I.layout, primaryField: 'qa_vr_pick', status: 'active', branches: [{ condition: { op: 'eq', field: 'qa_vr_pick', value: 'Open' }, actions: [{ type: 'show_fields', fields: ['qa_vr_text'] }] }] });
if (r.j && r.j.data) { I.h4lr = r.j.data.id; SAVE(); LED('layout rule H4 ' + r.j.data.id); }
return SR(r).slice(0, 300);
