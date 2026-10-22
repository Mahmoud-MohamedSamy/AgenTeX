const L = '841043e1-c078-41f9-8d6e-dfd61bee45c3';
const out = {};
for (const v of ['QA RT csv 1', 'QA RT csv 2, quoted']) { const fl = encodeURIComponent(JSON.stringify([{ field: 'name', operator: 'equals', value: v }])); const r = await api('GET', `/modules/${L}/records?page=1&per_page=5&filters=${fl}`); out[v] = r.s + ' ' + arr(r.j?.data).map(x => x.id + ' ' + x.source + ' pct=' + (x.data.find(f => f.field === 'percent_8_9') || {}).value?.value).join(';'); }
return done(out);
