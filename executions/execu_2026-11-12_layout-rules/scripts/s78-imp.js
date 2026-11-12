const mid = await modId(); const out = {};
const csv = 'Full Name,QA LR1112 type,QA LR1112 order\nQA LR1112 imp1,Refund,\nQA LR1112 imp2,Refund,\nQA LR1112 imp3,Question,\n';
const fd = new FormData(); fd.append('file', new Blob([csv], { type: 'text/csv' }), 'qa-lr1112-import.csv');
const up = await rawForm('/modules/' + mid + '/import', fd); out.up = SR(up).slice(0, 100) + ' ' + JSON.stringify(up.j && up.j.data).slice(0, 400);
const id = up.j && up.j.data && (up.j.data.id || up.j.data.import_id || up.j.data.jobId); if (!id) return out; I.imp = id; SAVE(); LED('import job ' + id);
const f = await api('GET', '/modules/' + mid + '/import/' + id + '/fields?layout_id=' + I.layout); out.fields = SR(f).slice(0, 80) + ' ' + JSON.stringify(f.j.data).slice(0, 700);
return out;
