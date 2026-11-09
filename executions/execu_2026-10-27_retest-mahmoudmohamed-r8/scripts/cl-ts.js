const out = {};
for (const id of ['f7082675-ea1b-4220-bfd2-47925ef97570', '766590c6-59f8-432c-ae22-c74d77b3bb7a']) { const g = (await api('GET', `/teamspaces/${id}`)).j?.data; if (!g) { out[id.slice(0, 8)] = 'not visible/gone'; continue; } if (!/^QA RT/.test(g.name)) { out[id.slice(0, 8)] = 'SKIPPED ' + g.name; continue; } out[g.name] = (await api('DELETE', `/teamspaces/${id}?cascade=true`)).s; }
out.left = arr((await api('GET', '/teamspaces')).j?.data).map(t => t.name);
return done(out);
