const ms = arr((await api('GET','/modules')).j.data || []); const out = {};
for (const m of ms) { const r = await api('GET','/modules/'+m.id+'/tags'); if (r.s === 200) { const u = arr(r.j.data || r.j).filter(t => t.usage_count > 0).map(t => t.name + ':' + t.usage_count); if (u.length) out[(m.plural_label || m.label || m.display_name || m.key || m.id)] = u; } }
for (const q of ['#"Completed"', '#"test"']) { const r = await api('GET','/search?q='+encodeURIComponent(q)+'&types=records'); const g = r.j.data.groups.find(x => x.type === 'records'); out[q] = { total: g ? g.total : 0, hits: g ? g.hits.map(h => h.title.text + ' | ' + JSON.stringify(h.module).slice(0, 80) + ' | ' + (h.tags || []).map(t => t.name).join(',')) : [] }; }
out.moduleKeys = Object.keys(ms[0] || {}); return out;
