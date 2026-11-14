const X = '<img src=x onerror=alert(1)>';
const def = DEF('N1', [ST('Open', { position: { x: 0, y: 0 } }), ST('Escalated', { position: { x: 300, y: 0 } }), ST('Closed', { isTerminal: true, position: { x: 600, y: 0 } })],
  [{ ...TR('go', 'Open', 'Escalated', { during: { checklist: [{ id: 'k1', label: 'QA ' + X, mandatory: false }], messages: [{ id: 'm1', text: 'QA msg ' + X }], itemOrder: ['checklist', 'message:m1'] } }), name: 'QA go ' + X }, TR('end', 'Escalated', 'Closed')]);
const { r, id } = await mkBp(def); log('bp', E(r));
const t = await mkT('N1', 'xss ' + X); log('in', !!(await waitIn(t)), t);
