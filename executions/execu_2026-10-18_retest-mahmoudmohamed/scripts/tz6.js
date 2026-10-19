const L = '841043e1-c078-41f9-8d6e-dfd61bee45c3';
const f = await api('GET', '/modules/' + L + '/fields'); const fl = arr(f.j.data);
const dt = fl.filter(x => x.datatypeKey === 'date_time').map(x => x.apiName + ' (' + (x.labels && x.labels.en) + ') sys=' + x.isSystemField);
const rec = await api('GET', '/modules/' + L + '/records?page=1&per_page=1'); const d = arr(rec.j.data)[0].data.filter(x => x.value.kind && /date/i.test(x.value.kind)).map(x => x.field + '=' + JSON.stringify(x.value));
return done({ dt, sample: d });
