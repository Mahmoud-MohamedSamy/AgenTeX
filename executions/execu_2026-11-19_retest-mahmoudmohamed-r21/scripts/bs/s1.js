const o = {};
const def = DEF('3056 flow', [ST('Open', { position: { x: 0, y: 150 } }), ST('Escalated', { position: { x: 400, y: 0 } }), ST('On Hold', { position: { x: 400, y: 300 } }), ST('Closed', { position: { x: 800, y: 150 } })],
  [TR('go', 'Open', 'Escalated'), TR('urgent', 'Open', 'On Hold', { before: { visibilityCriteria: { op: 'eq', field: 'priority', value: 'high' } } }), TR('admin', 'Open', 'Closed', { before: { allowedUserIds: [OWNER] } }),
   TR('end', 'Escalated', 'Closed', { before: { visibilityCriteria: { op: 'eq', field: 'priority', value: 'medium' } } }), TR('holdend', 'On Hold', 'Closed'), TR('reopen', 'Closed', 'Open', { during: { checklist: [{ id: 'k', label: 'QA reopen check', mandatory: true }] } })]);
const b = await mkBp(def); o.bp = E(b.r); o.id = b.id;
o.t = await mkT('3056 flow', 'ticket', { priority: 'low', owner: AG_A }); o.in = !!(await waitIn(o.t, 40)); const r = await rec(o.t); o.n = r.ticket_number; o.owner = r.owner === AG_A;
const s = (await api('GET', `/modules/${TK}/records/${o.t}/blueprint-state`)).j?.data; o.stateKeys = s && Object.keys(s); o.allStates = (s?.allStates || []).length; o.allTr = (s?.allTransitions || []).length;
return o;
