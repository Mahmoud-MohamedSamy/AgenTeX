const out = {};
for (const id of made.bps) { const g = await getBp(id); if (!g) { out[id.slice(0, 8)] = 'not found'; continue; } if (!g.isActive) { out[id.slice(0, 8)] = 'off'; continue; }
  const r = await api('PUT', `/modules/${TK}/blueprints/${id}`, { definition: g.definition, isActive: false, revision: g.revision }); const g2 = await getBp(id); out[id.slice(0, 8)] = E(r) + ' active=' + g2.isActive; LED('blueprint switched OFF ' + id + ' "' + g.definition.name + '": ' + out[id.slice(0, 8)]); }
return out;
