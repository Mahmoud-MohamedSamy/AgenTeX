const L = '841043e1-c078-41f9-8d6e-dfd61bee45c3';
const lays = (await api('GET', `/modules/${L}/layouts`)).j.data;
let q = lays.find(l => l.name === 'QA RT layout');
if (!q) { const src = lays.find(l => l.name === 'FieldPermissions'); const b = JSON.parse(JSON.stringify(src)); delete b.id; delete b.isDefault; b.name = 'QA RT layout'; const c = await api('POST', `/modules/${L}/layouts`, b); q = c.j?.data; if (!q) return done({ create: c.s + ' ' + c.t.slice(0, 300) }); }
return done({ id: q.id, name: q.name, status: q.status });
