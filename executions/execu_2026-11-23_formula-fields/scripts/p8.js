const M = made.mod;
for (const dir of ['asc', 'desc']) {
  const r = await api('GET', `/modules/${M}/records?limit=200&sort_by=qa_fx_ui_double&sort_dir=${dir}`);
  const rows = L(r.j?.data).map(x => flat(x.data)).filter(v => v.qa_fx_ui_double !== undefined && v.qa_fx_ui_double !== null);
  log(dir, E(r), rows.map(v => v.qa_fx_ui_double).join(','));
}
const f = await api('GET', `/modules/${M}/records?limit=200&filters=` + encodeURIComponent(JSON.stringify([{ field: 'qa_fx_ui_double', operator: 'gt', value: 10 }])));
log('filter > 10', E(f), L(f.j?.data).map(x => flat(x.data)).map(v => v.name + '=' + v.qa_fx_ui_double).join(', '));
