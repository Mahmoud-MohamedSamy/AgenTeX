const L = '841043e1-c078-41f9-8d6e-dfd61bee45c3';
const lays = (await api('GET', `/modules/${L}/layouts`)).j.data.map(l => l.id + ' ' + l.name + (l.isDefault ? ' (default)' : ''));
const fl = arr((await api('GET', `/modules/${L}/fields`)).j.data).filter(f => /percent|multi|pick_list|email|name/i.test(f.datatypeKey + ' ' + f.fieldName)).map(f => ({ n: f.fieldName, lab: f.labels?.en, t: f.datatypeKey, av: (f.config?.allowed_values || []).slice(0, 8), req: f.config?.required, uniq: f.config?.unique, lays: (f.layouts || []).map(x => x.layoutName).join(',') }));
return done({ lays, fl });
