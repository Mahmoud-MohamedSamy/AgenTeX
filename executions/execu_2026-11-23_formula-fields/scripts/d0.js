const ts = await api('GET', '/teamspaces'); log('desk teamspaces', E(ts), L(ts.j?.data).map(t => [t.id, t.name]));
const mods = L((await api('GET', '/modules')).j?.data); log('desk modules', mods.length, mods.map(m => m.moduleKey + ':' + (m.isCustom ?? m.is_custom ?? '') ).join(' '));
