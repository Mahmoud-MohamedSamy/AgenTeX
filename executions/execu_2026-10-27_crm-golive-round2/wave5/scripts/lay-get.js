const M = 'b4848bdf-9f59-45a9-8336-9f4f2a4fc36b', L = '04c3cdbe-8cb0-49ba-bf49-f595bccab842';
const r = await call('GET', `/modules/${M}/layouts/${L}`);
const fr = await call('GET', `/modules/${M}/fields`);
const fl = Array.isArray(fr.j.data) ? fr.j.data : fr.j.data.fields;
return { layout: r.j.data, fields: fl.map(f => [f.id, f.apiName, f.datatypeKey]) };
