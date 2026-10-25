const L = '841043e1-c078-41f9-8d6e-dfd61bee45c3';
const v = await api('GET', `/modules/${L}/views`); const p = await api('GET', `/modules/${L}/list-preferences`);
return done({ views: v.s + ' ' + v.t.slice(0, 500), prefs: p.t.slice(0, 600) });
