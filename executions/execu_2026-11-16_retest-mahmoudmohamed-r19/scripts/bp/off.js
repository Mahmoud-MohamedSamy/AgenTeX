const ids = ['05ae1c2f-cb79-4621-8e1a-00405c7db4a9', '16d28ff1-5473-48ed-94ef-4726b9b8f93d', '3530069f-e746-408d-8f4e-58e1067bf860', '98536d5d-6d96-4d28-ab90-83b301d9a70e', '1eb735cb-8d23-4641-bd91-be9c0eec500a', '478a28c6-16eb-4aec-8ad4-dcdf5278fdd0', '93d32ad8-6d7a-4bbd-abe7-eb4e2c2a31ee', 'a22043bb-35b7-4066-a22d-7275c5d9fd39'];
const out = {};
for (const id of ids) { const g = await getBp(id); if (!g) { out[id.slice(0, 8)] = 'not found'; continue; } if (!g.isActive) { out[id.slice(0, 8)] = 'already off'; continue; }
  const r = await api('PUT', `/modules/${TK}/blueprints/${id}`, { definition: g.definition, isActive: false, revision: g.revision }); const g2 = await getBp(id); out[id.slice(0, 8)] = E(r) + ' active=' + g2.isActive; LED('blueprint switched OFF ' + id + ' "' + g.definition.name + '": ' + out[id.slice(0, 8)]); }
const all = L((await api('GET', `/modules/${TK}/blueprints`)).j?.data).filter(b => /QA BP RT19/.test(b.definition?.name || '')); out.rt19 = all.map(b => b.definition.name + '=' + (b.isActive ? 'ON' : 'off'));
return out;
