const D = 'f42cbafd-ab4e-4a6b-a40c-02c1d0ecb430', DEAL = '96cae089-e8c6-497e-9c50-610a19340d2e';
const g = await api('GET', '/modules/' + D + '/records/' + DEAL);
const rv = g.j.data.row_version;
const s = x => ({ kind: 'string', value: String(x) });
const out = {};
for (const m of ['PATCH', 'PUT']) {
  const r = await api(m, '/modules/' + D + '/records/' + DEAL, { row_version: rv, rowVersion: rv, data: [ { field: 'next_step', value: s('QA edit after USD deleted') } ] });
  out[m] = [r.s, r.j && r.j.error ? r.j.error.code + ': ' + r.j.error.message + ' ' + JSON.stringify(r.j.error.details || '').slice(0, 250) : 'ok'];
  if (r.s !== 405) break;
}
return out;
