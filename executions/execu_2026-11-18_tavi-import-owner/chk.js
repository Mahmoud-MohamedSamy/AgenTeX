const r = await api('POST', '/modules/88e8ea44-1658-4df3-9930-d0902b91073d/records/search', { query: 'QA RT22 IMP', limit: 20 });
let rows = arr(r.j);
if (r.s >= 300 || !rows.length) { const r2 = await api('GET', '/modules/88e8ea44-1658-4df3-9930-d0902b91073d/records?search=' + encodeURIComponent('QA RT22 IMP') + '&limit=20'); rows = arr(r2.j); log({ s1: r.s, s2: r2.s }); }
const val = (rec, k) => { const d = rec.data || rec.values || rec; return d[k]; };
log(rows.map(x => ({ id: x.id, n: x.number || val(x, 'ticket_number'), subj: val(x, 'subject'), owner: x.owner_id || val(x, 'owner_id') || val(x, 'owner'), created: x.created_at })));
