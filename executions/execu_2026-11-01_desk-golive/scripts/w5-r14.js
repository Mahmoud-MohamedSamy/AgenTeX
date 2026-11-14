const cs = '7e1ac409-58b0-41ab-97e1-0e7d5c8c5158', TM = '88e8ea44-1658-4df3-9930-d0902b91073d';
const cnt = async (extra) => { const f = [{ field: 'department', operator: 'equals', value: cs }, ...extra]; const r = await api('GET', '/modules/' + TM + '/records?page=1&per_page=1&filters=' + encodeURIComponent(JSON.stringify(f))); return r.s + ' ' + JSON.stringify(r.j && r.j.meta).slice(0, 160); };
out.all = await cnt([]); out.open = await cnt([{ field: 'status', operator: 'equals', value: 'Open' }]); out.closed = await cnt([{ field: 'status', operator: 'equals', value: 'Closed' }]);
out.allNoSpam = await cnt([{ field: 'is_spam', operator: 'is_false', value: null }, { field: 'is_archived', operator: 'is_false', value: null }]);
const rl = await api('GET', '/reporting/reports', undefined, { 'x-department-id': cs }); out.rl = rl.s + ' ' + rl.t.slice(0, 200);
const rr = await api('GET', '/reporting/reports/efa2c92a-7145-4b79-85e8-1de588d04ff0'); out.rep = rr.s + ' ' + rr.t.slice(0, 300);
return fin({ out });
