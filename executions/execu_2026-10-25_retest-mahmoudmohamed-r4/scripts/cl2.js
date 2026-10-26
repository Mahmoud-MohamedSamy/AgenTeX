const L = '841043e1-c078-41f9-8d6e-dfd61bee45c3', LT = '6261fa51-b6e7-4c73-a83d-f6ecbd6260d1';
const lay = (await api('GET', `/modules/${L}/layouts/${LT}`)).j.data; const paths = [];
const walk = (o, p) => { if (o && typeof o === 'object') for (const [k, v] of Object.entries(o)) { if (k === 'moduleImageEnabled') { paths.push(p + '.' + k + '=' + v); o[k] = true; } walk(v, p + '.' + k); } };
walk(lay, '');
const b = { ...lay }; delete b.id; const r = await api('PUT', `/modules/${L}/layouts/${LT}`, b);
const after = []; const w2 = (o, p) => { if (o && typeof o === 'object') for (const [k, v] of Object.entries(o)) { if (k === 'moduleImageEnabled') after.push(p + '=' + v); w2(v, p + '.' + k); } }; w2((await api('GET', `/modules/${L}/layouts/${LT}`)).j.data, '');
return done({ before: paths, put: r.s, after });
