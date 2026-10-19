const D = 'f42cbafd-ab4e-4a6b-a40c-02c1d0ecb430'; const out = { made: [] };
const f = await api('GET', '/modules/' + D + '/fields'); out.req = arr(f.j.data).filter(x => x.required).map(x => x.apiName + ':' + x.datatypeKey);
const amt = arr(f.j.data).find(x => x.apiName === 'amount'); out.amountType = amt && amt.datatypeKey;
const sample = await api('GET', '/modules/' + D + '/records?page=1&per_page=1'); out.sample = JSON.stringify((arr(sample.j.data)[0].data || []).filter(x => /amount|stage|deal_name|closing/.test(x.field))).slice(0, 500);
return done(out);
