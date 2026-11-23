const id = '9ec8bdc5-2362-4386-a4cd-e5bee332d0c7';
const a = await api('GET', `/modules/${TK}/records/${id}/blueprint-state`); const b = await api('GET', `/modules/${TK}/records/${id}/blueprint-transitions`);
const st = a.j?.data; const s0 = (st?.states || [])[0] || {};
return { s: a.s, top: Object.keys(st || {}), s0keys: Object.keys(s0), all: JSON.stringify(s0).slice(0, 2500), trS: b.s, tr: JSON.stringify(b.j?.data).slice(0, 1500) };
