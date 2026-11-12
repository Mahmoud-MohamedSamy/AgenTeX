const mid = await modId(); const out = {};
const r = await mkRec(mid, { first_name: P + ' rec F9', qa_lr_filter: 'X', qa_lr_text: 'orig' }, I.layout); out.mk = r.s + ' ' + r.err; LED('record F9 ' + r.id); I.F9 = r.id; SAVE();
const p = await api('PATCH', '/modules/' + mid + '/records/' + r.id, { data: [{ field: 'qa_lr_text', value: { kind: 'string', value: 'api change' } }] }); out.patch = SR(p).slice(0, 200);
const m = await api('POST', '/modules/' + mid + '/records/mass-update', { record_ids: [r.id], data: [{ field: 'qa_lr_text', value: { kind: 'string', value: 'mass change' } }] }); out.mass = SR(m).slice(0, 200);
await new Promise(res => setTimeout(res, 3000)); const g = (await api('GET', '/modules/' + mid + '/records/' + r.id)).j.data.data.find(x => x.field === 'qa_lr_text'); out.final = JSON.stringify(g && g.value);
// buttons / links available
out.buttons = SR(await api('GET', '/modules/' + mid + '/buttons')).slice(0, 80) + ' ' + JSON.stringify((await api('GET', '/modules/' + mid + '/buttons')).j.data || '').slice(0, 300);
out.links = SR(await api('GET', '/modules/' + mid + '/links')).slice(0, 80) + ' ' + JSON.stringify((await api('GET', '/modules/' + mid + '/links')).j.data || '').slice(0, 300);
return out;
