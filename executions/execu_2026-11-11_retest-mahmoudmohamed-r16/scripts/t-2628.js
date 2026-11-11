const mods = arr((await api('GET','/modules')).j.data || []).map(m => [m.id, m.api_name || m.name || m.plural_label]);
const tags = [];
for (const [id, n] of mods) { const r = await api('GET','/modules/'+id+'/tags'); if (r.s === 200) for (const t of arr(r.j.data || r.j)) if (t.usage_count > 0) tags.push([n, t.name, t.usage_count]); }
const out = { tags };
const pick = tags.filter(t => !/Leads|leads/.test(t[0]))[0]; const one = tags.find(t => /^\S+$/.test(t[1]));
for (const t of [pick, one].filter(Boolean)) { const q = '#"' + t[1] + '"'; const r = await api('GET','/search?q='+encodeURIComponent(q)+'&types=records'); const g = ((r.j && r.j.data && r.j.data.groups) || []).find(x => x.type === 'records'); out[q + ' (' + t[0] + ', count ' + t[2] + ')'] = g ? { total: g.total, hits: g.hits.map(h => h.title.text + ' | ' + (h.module && (h.module.name || h.module.api_name)) + ' | tags ' + JSON.stringify(h.tags || h.badges || '').slice(0, 80)) } : r.s + ' ' + r.t.slice(0, 200); }
return out;
