const L = '841043e1-c078-41f9-8d6e-dfd61bee45c3';
const v = await api('GET', `/modules/${L}/views?kind=list`); const arr = v.j?.data?.views || v.j?.data || [];
return done({ s: v.s, all: arr.filter(x => !(x.isSystem || x.is_system)).map(x => x.id + ' ' + JSON.stringify((x.name || '').slice(0, 30)) + ' len' + (x.name || '').length + ' ' + (x.created_at || x.createdAt || '')) });
