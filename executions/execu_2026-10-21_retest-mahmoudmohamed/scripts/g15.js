const L = '841043e1-c078-41f9-8d6e-dfd61bee45c3';
const t = (await txt()).split('Result')[1]?.slice(0, 1200);
await shot('1592-01-result');
const fl = encodeURIComponent(JSON.stringify([{ field: 'name', operator: 'contains', value: 'QA RT imp' }]));
const r = await api('GET', `/modules/${L}/records?page=1&per_page=50&filters=${fl}`);
const recs = arr(r.j?.data);
const mine = recs.map(r => { const g = k => (r.data.find(x => x.field === k) || {}).value?.value; return { id: r.id, name: g('name'), pct: g('percent_8_9'), ms: g('multi_select_3_9') }; });
return done({ t, s: r.s, mine });
