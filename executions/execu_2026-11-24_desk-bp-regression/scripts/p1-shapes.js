// Read-only: dump full definitions of every blueprint to learn current field names; summarise keys used.
const T = '88e8ea44-1658-4df3-9930-d0902b91073d';
const list = arr((await api('GET', `/modules/${T}/blueprints?includeInactive=true`)).j?.data);
const full = [];
for (const b of list) { const g = (await api('GET', `/modules/${T}/blueprints/${b.id}`)).j?.data; full.push(g); }
fs.writeFileSync('../baseline/all-blueprints-full.json', JSON.stringify(full, null, 1));
const keys = {}; const walk = (o, p) => { if (Array.isArray(o)) { o.forEach(x => walk(x, p + '[]')); return; } if (o && typeof o === 'object') for (const [k, v] of Object.entries(o)) { const q = p + '.' + k; keys[q] = (keys[q] || 0) + 1; walk(v, q); } };
full.forEach(g => walk(g, ''));
return { topKeys: Object.keys(full[0] || {}), keys: Object.keys(keys).filter(k => !/position|\.criteria\.|entryCriteria\.(children|group)/.test(k)).sort() };
