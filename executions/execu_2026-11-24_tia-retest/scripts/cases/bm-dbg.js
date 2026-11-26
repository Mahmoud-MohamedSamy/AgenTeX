const r = await api('GET', `/modules/${M.leads}/records?page=1&per_page=1`); const c = await api('GET', `/modules/${M.leads}/records/count`);
return { meta: JSON.stringify(r.j?.meta).slice(0, 300), keys: Object.keys(r.j || {}), count: c.s + ' ' + (c.t || '').slice(0, 200) };
