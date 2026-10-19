// NDC-1819 item 11: bucket totals and statuses straight from /workqueue/activities.
const out = {}; const T = 'a9d87b62-b704-4c2e-b2d5-1b745d7c2065';
const v = (r, f) => ((r.data || []).find(x => x.field === f) || { value: {} }).value.value;
for (const b of ['overdue', 'today_and_overdue', 'today_overdue', 'today', 'all', 'all_open', 'open']) {
  const r = await api('GET', '/workqueue/activities?module_id=' + T + '&bucket=' + b + '&page=1&per_page=200');
  if (r.s !== 200) { out[b] = r.s + ' ' + r.t.slice(0, 120); continue; }
  const rows = arr(r.j && r.j.data).map(x => x.record || x);
  out[b] = { total: JSON.stringify((r.j.meta || r.j.pagination || {}).total_count ?? rows.length), statuses: rows.reduce((a, x) => { const s = v(x, 'status'); a[s] = (a[s] || 0) + 1; return a; }, {}), sample: rows.slice(0, 3).map(x => v(x, 'subject') + '|' + v(x, 'status') + '|' + v(x, 'due_date') + '|' + v(x, 'priority')) };
}
return done(out);
