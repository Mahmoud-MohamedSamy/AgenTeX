const o = {}; const CK = { during: { checklist: [{ id: 'k', label: 'QA check', mandatory: true }] } };
const def = DEF('D3 3066 cont', [ST('Open', { position: { x: 0, y: 0 } }), ST('Escalated', { position: { x: 300, y: 0 } }), ST('On Hold', { position: { x: 600, y: 0 } }), ST('Closed', { isTerminal: true, position: { x: 900, y: 0 } })],
  [TR('first', 'Open', 'Escalated', CK), TR('auto', 'Escalated', 'On Hold'), TR('end', 'On Hold', 'Closed')], { continuous: true });
const b = await mkBp(def, true); o.bp = E(b.r); o.id = b.id; o.cont = (await getBp(b.id))?.definition?.continuous;
const T = []; for (const s of ['t1', 't2']) T.push(await mkT('D3 3066 cont', s));
for (const t of T) o['in_' + t.slice(0, 8)] = (await waitIn(t))?.stateId || 'none';
for (const t of T) o['run_' + t.slice(0, 8)] = E(await runT(t, 'first', 'Open', { checklist: { k: true } }));
await sleep(30000);
o.T = []; for (const t of T) { const r = await rec(t); const h = await histRaw(t); o.T.push({ id: t, n: r.ticket_number, status: r.status, rows: h.filter(x => /transition|status/.test(x.action)).map(x => ({ at: x.occurred_at, action: x.action, actor: x.actor?.kind, summary: x.summary, old: x.old_value, new: x.new_value })) }); }
fs.writeFileSync(RUN + '/scripts/d3/a2.json', JSON.stringify(o, null, 1)); return o;
