const mid = await modId(); const o = {};
for (const l of arr((await api('GET', '/modules/' + mid + '/layouts')).j.data).filter(l => l.name === P + ' Layout')) { const d = await api('DELETE', '/modules/' + mid + '/layouts/' + l.id); o[l.id] = SR(d).slice(0, 200); if (d.s < 300) LED('deleted layout ' + l.id); }
o.left = arr((await api('GET', '/modules/' + mid + '/layouts')).j.data).filter(l => l.name.startsWith(P)).map(l => l.name);
return o;
