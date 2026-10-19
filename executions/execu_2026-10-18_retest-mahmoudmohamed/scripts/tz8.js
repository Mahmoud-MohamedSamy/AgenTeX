const L = '841043e1-c078-41f9-8d6e-dfd61bee45c3'; const out = {};
const nm = r => ((r.data || []).find(f => f.field === 'first_name') || { value: {} }).value.value;
for (const op of ['today', 'yesterday', 'tomorrow']) {
  const flt = [{ field: 'first_name', operator: 'starts_with', value: 'QA RT tz' }, { field: 'date_time', operator: op }];
  const r = await api('GET', '/modules/' + L + '/records?page=1&per_page=20&filters=' + encodeURIComponent(JSON.stringify(flt)));
  out[op] = r.s + ' ' + (r.s < 400 ? JSON.stringify(arr(r.j && r.j.data).map(nm).sort()) : r.t.slice(0, 250));
}
return done(out);
