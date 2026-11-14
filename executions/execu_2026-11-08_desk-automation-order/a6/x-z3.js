const mk = order => DEF('Z3', [ST('Open'), ST('Escalated'), ST('On Hold'), ST('Closed', { isTerminal: true })], order.map(k => ({ c: TR('c', 'Open', 'Closed'), a: TR('a', 'Open', 'Escalated'), b: TR('b', 'Open', 'On Hold') }[k])).concat([TR('e1', 'Escalated', 'Closed'), TR('e2', 'On Hold', 'Closed')]));
const { r, id } = await mkBp(mk(['c', 'a', 'b'])); log('create', E(r));
const t = await mkT('Z3'); await waitIn(t); log('order 1 (c,a,b)', await trans(t));
const d = await api('PUT', `/modules/${TK}/blueprints/${id}/draft`, { definition: mk(['b', 'c', 'a']) }); log('draft', E(d));
const p = await api('POST', `/modules/${TK}/blueprints/${id}/publish`, {}); log('publish', E(p));
await sleep(2000); log('order 2 (b,c,a)', await trans(t));
log('clean', await cleanAll());
