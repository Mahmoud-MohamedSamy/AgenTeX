const sts = ((await api('GET', '/desk/ticket-statuses')).j?.data?.statuses || []).map(s => ({ n: s.value, c: s.type })); log('statuses', sts.length, JSON.stringify(sts.slice(0, 3)));
const names = sts.map(s => s.n).filter(n => n !== 'Closed').slice(0, 29).concat(['Closed']);
const states = names.map((n, i) => ST(n, { position: { x: 260 * (i % 6), y: 160 * Math.floor(i / 6) }, ...(n === 'Closed' ? { isTerminal: true } : {}) }));
const trs = []; for (const d of [1, 2]) for (let i = 0; i + d < 30; i++) trs.push(TR('t' + i + '_' + (i + d), names[i], names[i + d]));
for (let i = 2; trs.length < 80 && i < 29; i++) trs.push(TR('b' + i, names[i], names[i - 2]));
log('states', states.length, 'transitions', trs.length);
let t0 = Date.now(); const { r, id } = await mkBp(DEF('N8', states, trs), false); log('create', E(r), Date.now() - t0, 'ms');
t0 = Date.now(); const p = await api('POST', `/modules/${TK}/blueprints/${id}/publish`, {}); log('publish', E(p), Date.now() - t0, 'ms');
t0 = Date.now(); const g = await api('GET', `/modules/${TK}/blueprints/${id}`); log('get', g.s, Date.now() - t0, 'ms'); log('id', id);
