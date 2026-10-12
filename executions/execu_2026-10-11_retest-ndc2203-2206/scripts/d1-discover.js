const out = {};
const m = await api('GET', '/modules'); out.modules = arr(m.j && m.j.data).map(x => x.moduleKey + '=' + x.id);
for (const p of ['/workflow-rules', '/desk/workflow-rules', '/roles', '/desk/roles', '/profiles']) { const r = await api('GET', p); out[p] = r.s + ' ' + r.t.slice(0, 600); }
return done(out);
