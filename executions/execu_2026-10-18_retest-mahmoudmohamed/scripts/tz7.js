const L = '841043e1-c078-41f9-8d6e-dfd61bee45c3'; const S = v => ({ kind: 'string', value: v }); const out = { made: [] };
const pts = [['QA RT tz L1', '2026-10-17T23:50:00+03:00'], ['QA RT tz L2', '2026-10-18T00:10:00+03:00'], ['QA RT tz L3', '2026-10-18T23:50:00+03:00'], ['QA RT tz L4', '2026-10-19T00:10:00+03:00']];
for (const [n, t] of pts) {
  let r = await api('POST', '/modules/' + L + '/records', { data: [{ field: 'first_name', value: S(n) }, { field: 'phone', value: S('01000002095') }, { field: 'single_line_3_9', value: S('QA RT') }, { field: 'date_time', value: { kind: 'datetime', value: t } }] });
  if (r.s >= 400) r = await api('POST', '/modules/' + L + '/records', { data: [{ field: 'first_name', value: S(n) }, { field: 'phone', value: S('01000002095') }, { field: 'single_line_3_9', value: S('QA RT') }, { field: 'date_time', value: S(t) }] });
  const id = r.j && r.j.data && r.j.data.id; let stored = '';
  if (id) { const g = await api('GET', '/modules/' + L + '/records/' + id); const d = (g.j.data.data || []).find(x => x.field === 'date_time'); stored = JSON.stringify(d && d.value); }
  out.made.push(n + ' ' + r.s + ' ' + (id || r.t.slice(0, 200)) + ' stored=' + stored);
}
return done(out);
