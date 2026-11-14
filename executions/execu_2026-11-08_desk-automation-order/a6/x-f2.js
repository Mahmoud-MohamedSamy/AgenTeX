const r = await api('GET', `/modules/${TK}/fields?take=300`); const f = L(r.j?.data); log(JSON.stringify(f[0]).slice(0, 500));
const k = Object.keys(f[0]).find(k => /type/i.test(k)); log('typekey', k);
const types = {}; for (const x of f) { const t = JSON.stringify(x[k]?.key || x[k]); types[t] = (types[t] || 0) + 1; } log(JSON.stringify(types));
log('addr', JSON.stringify(f.filter(x => /addr/i.test(JSON.stringify(x))).map(x => [x.name || x.api_name, x[k]?.key || x[k]])).slice(0, 400));
