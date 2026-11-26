const f = arr((await api('GET', `/modules/${M.leads}/fields`)).j?.data);
const req = f.filter(x => x.isRequired || x.required || x.is_required).map(x => ({ n: x.fieldName, l: x.label || x.displayLabel, t: x.datatype || x.dataType }));
const g = arr((await api('GET', `/modules/${M.deals}/fields`)).j?.data);
const dreq = g.filter(x => x.isRequired || x.required || x.is_required).map(x => ({ n: x.fieldName, l: x.label || x.displayLabel, t: x.datatype || x.dataType }));
const stage = g.find(z => z.fieldName === 'stage'); const o = stage?.datatypeOptions || {};
return { leadReq: req, dealReq: dreq, stages: (o.allowed_values || o.options || []).map(v => typeof v === 'string' ? v : (v.value ?? v.label)).slice(0, 12), sampleKeys: Object.keys(f[0] || {}).slice(0, 25) };
