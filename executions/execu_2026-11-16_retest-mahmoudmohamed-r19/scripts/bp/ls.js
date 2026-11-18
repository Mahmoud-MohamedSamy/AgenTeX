const b = await api('GET', `/modules/${TK}/blueprints`);
const x = L(b.j?.data)[0]; 
return { keys: Object.keys(x), dkeys: Object.keys(x.definition||{}), list: L(b.j?.data).map(x => ({ id: x.id, n: x.definition?.name || x.name, d: x.definition?.departmentId || x.departmentId, ec: String(JSON.stringify(x.definition?.entryCriteria || x.entryCriteria)).slice(0,150), a: x.isActive })) };
