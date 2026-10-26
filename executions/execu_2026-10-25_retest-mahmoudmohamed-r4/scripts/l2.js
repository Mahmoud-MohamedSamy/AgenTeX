const L = '841043e1-c078-41f9-8d6e-dfd61bee45c3';
const ls = arr((await api('GET', `/modules/${L}/layouts`)).j?.data).map(x => x.id + ' ' + x.name + ' ' + (x.createdAt || x.created_at || '') + ' img=' + JSON.stringify(x).match(/"moduleImageEnabled":(true|false)/)?.[1]);
return done(ls);
