const D = 'f42cbafd-ab4e-4a6b-a40c-02c1d0ecb430';
const r = await api('POST', '/modules/' + D + '/records/query', { pageSize: 50 });
let recs = arr(r.j && r.j.data); if (!recs.length) { const g = await api('GET', '/modules/' + D + '/records?pageSize=50'); recs = arr(g.j && g.j.data); }
const withAmt = recs.find(x => JSON.stringify(x).includes('"amount"')) || recs[0];
const s = JSON.stringify(withAmt || {});
const grab = k => { const i = s.indexOf('"' + k + '"'); return i < 0 ? null : s.slice(i - 10, i + 220); };
return { n: recs.length, amount: grab('amount'), currency: grab('currency'), rate: grab('exchange_rate') };
