log('pre-clean', await cleanAll());
const def = DEF('JU', [ST('Open', { position: { x: 0, y: 0 }, slaMinutes: 120, slaPreExpiryMinutes: 60 }), ST('Escalated', { position: { x: 300, y: -100 } }), ST('On Hold', { position: { x: 300, y: 100 } }), ST('Closed', { isTerminal: true, position: { x: 600, y: 0 } })],
  [TR('verify', 'Open', 'Escalated', { during: { requiredFields: [{ name: 'description', datatype: { key: 'multi_line' }, required: true }], deskItems: [{ kind: 'comment', mandatory: true }], itemOrder: ['field:description', 'desk:comment'] } }), TR('hold', 'Open', 'On Hold'), TR('e1', 'Escalated', 'Closed'), TR('e2', 'On Hold', 'Closed')]);
const { r, id } = await mkBp(def); log('bp', id, E(r));
const t1 = await mkT('JU', 'ticket one'); const t2 = await mkT('JU', 'ticket two');
log('in', !!(await waitIn(t1)), !!(await waitIn(t2)));
log('run hold on t2', E(await runT(t2, 'hold')));
const rec = await api('GET', `/modules/${TK}/records/${t1}`); log('t1 no', rec.j?.data?.record_number || rec.j?.data?.number || JSON.stringify(rec.j?.data).match(/"ticket_number[^,]*/)?.[0]);
log('ids', t1, t2);
