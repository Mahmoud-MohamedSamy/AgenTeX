const me = await api('GET', '/iam/me'); const d = me.j && me.j.data || {}; const id = d.id || d.user_id || (d.user || {}).id;
const q = await api('POST', '/desk/agents/departments/query', { agent_ids: [id] });
const dep = await api('GET', '/desk/departments'); 
return done({ id, keys: Object.keys(d).join(','), q: q.t.slice(0, 500), deps: arr(dep.j && dep.j.data).map(x => [x.name, x.id.slice(0, 8)]) });
