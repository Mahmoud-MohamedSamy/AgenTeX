const L = '841043e1-c078-41f9-8d6e-dfd61bee45c3';
const f = arr((await api('GET', `/modules/${L}/fields`)).j?.data).filter(x => /percent|first_name|last_name|^phone$|^name$/.test(x.apiName || '') || x.datatypeKey === 'percent').map(x => x.apiName + ' | ' + x.labels?.en + ' | ' + x.datatypeKey + ' | req ' + x.required);
return done({ f });
