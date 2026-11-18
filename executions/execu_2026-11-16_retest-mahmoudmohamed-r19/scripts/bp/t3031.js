const o = {}; const CK = { during: { checklist: [{ id: 'k', label: 'QA check', mandatory: true }] } };
const shape = (tag, endItems, cont, autoOwner) => DEF(tag, [ST('Open', { position: { x: 0, y: 0 } }), ST('Escalated', { position: { x: 300, y: 0 } }), ST('On Hold', { position: { x: 600, y: 0 } }), ST('Closed', { isTerminal: true, position: { x: 900, y: 0 } })],
  [TR('first', 'Open', 'Escalated', CK), TR('auto', 'Escalated', 'On Hold', autoOwner ? { before: { allowedUserIds: [autoOwner] } } : {}), TR('end', 'On Hold', 'Closed', endItems ? CK : {})], { continuous: cont });
const cases = { A: ['3031 A cont devshape', true, true, null], B: ['3031 B cont ticketshape', false, true, null], C: ['3031 C not cont', false, false, null], D: ['3031 D cont auto owned by A', false, true, AG_A] };
const T = {};
for (const [k, [tag, endItems, cont, ow]] of Object.entries(cases)) { const b = await mkBp(shape(tag, endItems, cont, ow)); o[k + 'bp'] = E(b.r); o[k + 'cont'] = (await getBp(b.id))?.definition?.continuous; T[k] = await mkT(tag); }
for (const k of Object.keys(T)) o[k + 'in'] = (await waitIn(T[k]))?.stateId || (await bstate(T[k]))?.currentStateId || JSON.stringify(await bstate(T[k])).slice(0, 120);
const t0 = Date.now();
for (const k of Object.keys(T)) o[k + 'run'] = E(await runT(T[k], 'first', 'Open', { checklist: { k: true } }));
const snap = async () => { const s = {}; for (const k of Object.keys(T)) { const r = await rec(T[k]); const b = await bstate(T[k]); s[k] = r.status + ' / bp:' + (b ? (b.stateId || b.currentStateId || b.state_id) : 'none') + ' / avail:' + (await trans(T[k])).join(','); } return s; };
await sleep(5000); o.at5s = await snap(); await sleep(25000); o.at30s = await snap();
o.bstateKeys = Object.keys((await bstate(T.A)) || {});
o.T = T; fs.writeFileSync(RUN + '/scripts/bp/3031.json', JSON.stringify(o, null, 1)); return o;
