const o = {}; const F4 = JSON.parse(fs.readFileSync(RUN + '/scripts/bp/f04.json', 'utf8')); const F7 = JSON.parse(fs.readFileSync(RUN + '/scripts/bp/f07.json', 'utf8')); const F9 = JSON.parse(fs.readFileSync(RUN + '/scripts/bp/f09.json', 'utf8'));
// 1 blueprints off
for (const id of [F4.bpId, F9.id]) { const g = await getBp(id); if (g?.isActive) { const r = await api('PUT', `/modules/${TK}/blueprints/${id}`, { definition: g.definition, isActive: false, revision: g.revision }); LED('blueprint switched OFF ' + id + ': ' + E(r)); } o['bp' + id.slice(0, 8)] = 'active=' + (await getBp(id))?.isActive; }
// 2 tickets delete
for (const id of [F4.k1, F4.c1, F7.x]) { const r = await api('DELETE', '/modules/' + TK + '/records/' + id); o['del' + id.slice(0, 8)] = E(r); LED('ticket deleted ' + id + ': ' + r.s); }
return o;
