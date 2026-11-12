const mid = await modId(); const out = {}; const id = '24b0ee6b-c4bc-491f-bce3-5376eaad67e0'; I.imp = id; SAVE(); LED('import session ' + id);
const m = await api('PUT', '/modules/' + mid + '/import/' + id + '/mapping', { mode: 'add', match_field_key: null, layout_id: I.layout, mapping: [{ header: 'Full Name', field: 'first_name' }, { header: 'QA LR1112 type', field: 'qa_lr_type' }, { header: 'QA LR1112 order', field: 'qa_lr_order' }], options: { skip_empty: true, replace_empty: null, notify_email: false, assign_to_user_id: null, trigger_automation: false, assignment_rule_id: null } });
out.map = SR(m).slice(0, 300);
const v = await api('POST', '/modules/' + mid + '/import/' + id + '/validate'); out.validate = SR(v).slice(0, 80) + ' ' + JSON.stringify(v.j && v.j.data).slice(0, 500);
const is = await api('GET', '/modules/' + mid + '/import/' + id + '/issues?page=1&size=20'); out.issues = JSON.stringify(is.j && is.j.data).slice(0, 600);
return out;
