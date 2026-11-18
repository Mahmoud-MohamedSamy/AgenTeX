const o = {};
const def = DEF('3036 onlyA', [ST('Open', { position: { x: 0, y: 0 } }), ST('Escalated', { position: { x: 350, y: 0 } }), ST('Closed', { isTerminal: true, position: { x: 700, y: 0 } })],
  [TR('onlyA', 'Open', 'Escalated', { before: { allowedUserIds: [AG_A] } }), TR('end', 'Escalated', 'Closed')]);
const b = await mkBp(def); o.bp = E(b.r); o.id = b.id;
o.t1 = await mkT('3036 onlyA', 'ticket 1'); o.t2 = await mkT('3036 onlyA', 'ticket 2'); await waitIn(o.t1); await waitIn(o.t2);
o.n1 = (await rec(o.t1)).ticket_number; o.n2 = (await rec(o.t2)).ticket_number;
const g = await getBp(b.id); o.activeA = { ownerIssues: g.ownerIssues, noActive: g.transitionsWithoutActiveOwner };
o.availActive = await trans(o.t1);
o.runWhileActive = E(await runT(o.t1, 'onlyA'));
fs.writeFileSync(RUN + '/scripts/bp/3036.json', JSON.stringify(o, null, 1)); return o;
