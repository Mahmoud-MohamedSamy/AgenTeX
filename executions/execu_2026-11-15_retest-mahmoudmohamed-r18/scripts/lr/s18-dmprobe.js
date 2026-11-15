const out = {}; const ms = arr((await api('GET', '/modules')).j.data);
for (const m of ms) { const d = arr((await api('GET', '/modules/' + m.id + '/dependency-maps')).j.data); if (d.length) { out.dm = m.moduleKey + ' ' + JSON.stringify(d[0]).slice(0, 1200); break; } }
return out;
