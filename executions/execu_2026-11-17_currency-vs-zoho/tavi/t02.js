const out = {};
const p = await api('POST', '/currencies', {}); out.emptyPost = [p.s, p.t.slice(0, 600)];
const o = await api('OPTIONS', '/currencies'); out.options = [o.s];
const m = arr((await api('GET', '/modules')).j.data).map(x => ({ id: x.id, n: x.api_name || x.name || x.key }));
out.modules = m.slice(0, 40);
return out;
