const o = {};
const def = DEF('3032 fieldupd', [ST('Open', { position: { x: 0, y: 0 } }), ST('Escalated', { position: { x: 300, y: 0 } }), ST('Closed', { isTerminal: true, position: { x: 600, y: 0 } })],
  [TR('escalate', 'Open', 'Escalated', { after: [{ kind: 'setField', field: 'description', value: 'QA RT19 set by blueprint' }, { kind: 'setField', field: 'priority', value: 'high' }] }), TR('finish', 'Escalated', 'Closed')]);
const b = await mkBp(def); o.bp = E(b.r); o.id = b.id;
const t = await mkT('3032 fieldupd', 'ticket', { priority: 'low' }); o.t = t; await waitIn(t);
o.before = await rec(t); o.before = { d: o.before.description, p: o.before.priority, n: o.before.ticket_number };
o.run = E(await runT(t, 'escalate')); await sleep(4000);
const a = await rec(t); o.after = { d: a.description, p: a.priority, s: a.status };
o.hist = (await histRaw(t)).map(h => h.action + (h.field_key ? ':' + h.field_key : '') + ' ' + JSON.stringify(h.old_value) + '→' + JSON.stringify(h.new_value) + ' src=' + JSON.stringify(h.source) + ' actor=' + (h.actor?.kind) + ' sum=' + JSON.stringify(h.summary || {}).slice(0, 140)).reverse();
fs.writeFileSync(RUN + '/scripts/bp/3032.json', JSON.stringify(o, null, 1)); return o;
