const f = arr((await api('GET', `/modules/841043e1-c078-41f9-8d6e-dfd61bee45c3/fields`)).j?.data); const x = f.find(z => z.fieldName === 'lead_source');
const g = arr((await api('GET', `/modules/f42cbafd-ab4e-4a6b-a40c-02c1d0ecb430/fields`)).j?.data); const y = g.find(z => z.fieldName === 'stage');
return { lead_source: JSON.stringify(x).slice(0,900), stage: JSON.stringify(y).slice(0,1200) };
