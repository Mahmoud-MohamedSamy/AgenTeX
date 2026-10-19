const L = '841043e1-c078-41f9-8d6e-dfd61bee45c3'; const U1 = '45ffbc5b-7859-4c21-be9e-7b5f30747ca2'; const out = {};
const val = (r, f) => { const d = (r.data || []).find(x => x.field === f); return d ? d.value.value : undefined; };
const r = await api('GET', '/modules/' + L + '/records?page=1&per_page=100&filters=' + encodeURIComponent(JSON.stringify([{ field: 'owner', operator: 'equals', value: U1 }, { field: 'company', operator: 'is_not_empty' }])));
out.s = r.s; const rl = arr(r.j && r.j.data); out.n = rl.length;
out.cands = rl.slice(0, 5).map(x => ({ id: x.id, name: val(x, 'first_name'), company: val(x, 'company') }));
const vs = await api('GET', '/modules/' + L + '/views?kind=list'); const vl = arr(vs.j && vs.j.data && vs.j.data.views);
out.oldK7 = vl.filter(v => /k7|QA CV|QA RT/i.test(v.name)).map(v => v.name + ' ' + v.id + ' ' + v.visibility);
return done(out);
