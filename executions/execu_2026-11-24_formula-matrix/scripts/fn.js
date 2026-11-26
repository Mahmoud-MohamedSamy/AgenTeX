const all = L((await api('GET', '/fields/datatypes')).j?.data); const f = all.find(x => x.key === 'formula');
log(JSON.stringify(f).slice(0, 2500));
const r = await api('POST', `/modules/${made.mod}/fields`, { fields: [fdef('zz_probe', 'zz', 'formula', { expression: 'nosuchfn(1)', return_kind: 'number' })] }); log(E(r));
