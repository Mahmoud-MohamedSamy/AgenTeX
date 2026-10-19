const L = '841043e1-c078-41f9-8d6e-dfd61bee45c3';
const out = { created: [] }; const S = v => ({ kind: 'string', value: v });
for (const nm of ['QA RT del-wq', 'QA RT del-list']) {
  const r = await api('POST', '/modules/' + L + '/records', { data: [{ field: 'first_name', value: S(nm) }, { field: 'last_name', value: S('1821') }, { field: 'phone', value: S('01000001821') }, { field: 'single_line_3_9', value: S('QA RT') }] });
  out.created.push(r.s + ' ' + (r.j && r.j.data ? r.j.data.id : r.t.slice(0, 400)));
}
return done(out);
