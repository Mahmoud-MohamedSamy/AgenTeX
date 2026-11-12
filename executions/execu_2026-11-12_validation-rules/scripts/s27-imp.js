// G10: import 2 rows into the QA layout, one breaks R1 (text starts with BAD)
const mid = await modId(); const out = {};
const csv = 'Full Name,Last Name,QA VR1112 text,QA VR1112 phone\nQA VR1112 imp ok,QA VR1112 imp,fine-import,+201001234567\nQA VR1112 imp bad,QA VR1112 imp,BAD-import,+201001234567\n';
const fd = new FormData(); fd.append('file', new Blob([csv], { type: 'text/csv' }), 'qa-vr1112-import.csv');
const up = await rawForm('/modules/' + mid + '/import', fd); const id = up.j && up.j.data && (up.j.data.session_id || up.j.data.id); out.up = SR(up).slice(0, 120);
if (!id) return out; I.imp = id; SAVE(); LED('import session ' + id);
const m = await api('PUT', '/modules/' + mid + '/import/' + id + '/mapping', { mode: 'add', match_field_key: null, layout_id: I.layout, mapping: [{ header: 'Full Name', field: 'first_name' }, { header: 'Last Name', field: 'last_name' }, { header: 'QA VR1112 text', field: 'qa_vr_text' }, { header: 'QA VR1112 phone', field: 'qa_vr_phone' }], options: { skip_empty: true, replace_empty: null, notify_email: false, assign_to_user_id: null, trigger_automation: false, assignment_rule_id: null } });
out.map = SR(m).slice(0, 200);
const v = await api('POST', '/modules/' + mid + '/import/' + id + '/validate'); out.validate = SR(v).slice(0, 60) + ' ' + JSON.stringify(v.j && v.j.data).slice(0, 400);
const is = await api('GET', '/modules/' + mid + '/import/' + id + '/issues?page=1&size=20'); out.issues = JSON.stringify(is.j && is.j.data).slice(0, 500);
const e = await api('POST', '/modules/' + mid + '/import/' + id + '/execute'); out.exec = SR(e).slice(0, 150);
for (let k = 0; k < 20; k++) { await sleep(3000); const s = await api('GET', '/modules/' + mid + '/import/' + id); const d = s.j && s.j.data; out.status = d && (d.status + ' ' + JSON.stringify(d.counts || d.summary || d.result || d.stats || '').slice(0, 300)); if (d && /complet|done|fail|error|finished/i.test(d.status)) break; }
const sr = await api('POST', '/modules/' + mid + '/records/search', { criteria: { field: 'first_name', op: 'startsWith', value: 'QA VR1112 imp' } }); out.found = arr(sr.j && sr.j.data).map(r => (r.data || []).filter(x => /first_name|qa_vr_text/.test(x.field)).map(x => x.value.value).join('/'));
RES('G10', 'INFO', `import 2 rows (one with text BAD-import): validate ${out.validate.slice(0, 160)} | issues ${out.issues.slice(0, 160)} | result ${out.status} | records now: ${JSON.stringify(out.found)}`);
return out;
