const T = '88e8ea44-1658-4df3-9930-d0902b91073d';
const r = await api('GET', `/modules/${T}/fields`); const f = arr(r.j?.data);
return done({ keys: Object.keys(f[0] || {}), raw: f.length ? '' : r.t.slice(0, 300), list: f.map(x => [x.api_name || x.apiName || x.key, x.data_type || x.dataType || x.type, x.label].join(':')).join(' | ').slice(0, 3500) });
