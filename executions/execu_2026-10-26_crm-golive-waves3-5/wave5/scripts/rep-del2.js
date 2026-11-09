const out = {};
for (const [k, p] of [['report', '/reporting/reports/392b1cea-f75a-4d44-bb3e-1d3ef42f63c0'], ['dashboard', '/reporting/dashboards/8eb349aa-544e-4330-8785-1645fb3a36ad']]) {
  const g = await call('GET', p); const d = g.j.data.data || g.j.data; const rev = d.revision ?? d.row_version ?? d.version;
  const del = await call('DELETE', p + '?expected_revision=' + rev); out[k] = 'rev ' + rev + ' -> ' + del.s + ' ' + del.t.slice(0, 160); out[k + 'After'] = (await call('GET', p)).s;
}
return out;
