const L = '259e93be-1e0a-4d78-a385-055db8265323';
const mods = arr((await api('GET', '/modules')).j?.data).filter(m => /^(leads|deals|tasks|contacts)$/.test(m.apiName || m.api_name)).map(m => [m.apiName || m.api_name, m.recordVisibility]);
const lays = arr((await api('GET', '/modules/' + L + '/layouts')).j?.data).map(l => [l.name, l.id, l.status, l.accessMode, l.isDefault ?? l.is_default]);
const std = lays.find(l => /standard/i.test(l[0])) || lays[0];
const lay = (await api('GET', '/modules/' + L + '/layouts/' + std[1])).j?.data;
const req = []; JSON.stringify(lay, (k, v) => { if (v && typeof v === 'object' && (v.required || v.isRequired || v.mandatory) && (v.fieldKey || v.key || v.apiName)) req.push(v.fieldKey || v.key || v.apiName); return v; });
const recs = (await api('GET', '/modules/' + L + '/records?page=1&per_page=3')).j; const r0 = arr(recs?.data)[0];
return done({ mods, lays, req: [...new Set(req)], recKeys: r0 && Object.keys(r0).slice(0, 30), dataKeys: r0?.data && Object.keys(r0.data).slice(0, 40), total: recs?.meta?.total });
