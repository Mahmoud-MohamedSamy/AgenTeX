const L = '841043e1-c078-41f9-8d6e-dfd61bee45c3';
const fs = arr((await api('GET', `/modules/${L}/fields`)).j?.data);
const withAF = fs.filter(f => JSON.stringify(f.datatypeOptions || {}).includes('auto_fill') || JSON.stringify(f.config || {}).includes('auto_fill')).map(f => f.id.slice(0, 8) + ' ' + f.fieldName + ' ' + f.labels?.en + ' ' + JSON.stringify(f.datatypeOptions?.auto_fill || f.config?.auto_fill) + ' layouts=' + (f.layouts || []).map(l => l.layoutName).join('|'));
const f = fs.find(x => x.id.startsWith('9eff6424')); const nm = fs.filter(x => /^(name|first_name|full_name)$/.test(x.fieldName)).map(x => x.fieldName + ' ' + x.labels?.en);
return done({ withAF, f9: f && (f.fieldName + ' ' + f.labels?.en + ' layouts=' + (f.layouts || []).map(l => l.layoutName).join('|')), nm });
