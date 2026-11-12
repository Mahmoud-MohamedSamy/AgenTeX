const o = {};
const r = await api('GET', `/modules/${CM}/records?limit=10&q=${encodeURIComponent('mmohamed@anyware.software')}`); o.found = arr(r.j && r.j.data).map(fl).map(x => [x.id, x.email, x.last_name || x.name, x.first_name]);
const c = await api('GET', `/modules/${CM}/records/${CON}`); o.old = c.s;
return fin(o);
