// C3/C4 TAVI re-check for the Zoho comparison: blueprint name data classes and duplicate name (inactive QA drafts, deleted after).
// Usage: TV_CACHE=<scratchpad>/.tv-token.json node c3c4.js
const tv = require('./tv'); const fs = require('fs'); const path = require('path');
const { call, QA_DEPT, TICKETS } = tv; const OUT = path.resolve(__dirname, '../evidence/raw/c3c4.json');
const def = name => ({ name, description: 'QA automation - safe to delete', moduleKey: 'desk_tickets', targetField: 'status', departmentId: QA_DEPT,
  entryCriteria: { op: 'contains', field: 'subject', value: 'QA BP C3C4 never' },
  states: [{ id: 'Open', name: 'Open', position: { x: 0, y: 0 } }, { id: 'Closed', name: 'Closed', position: { x: 400, y: 0 }, isTerminal: true }],
  transitions: [{ id: 'end', name: 'QA end', fromStateId: 'Open', toStateId: 'Closed', before: {}, during: {}, after: { actions: [] } }] });
const cases = [
  ['xss', 'QA BP <script>alert(1)</script>'],
  ['arabic', 'QA BP مخطط عربي'],
  ['emoji', 'QA BP emoji 🚀'],
  ['trailing', 'QA BP trailing   '],
  ['long70', 'QA BP long name 12345678901234567890123456789012345678901234567890 END'],
  ['long309', 'QA BP ' + 'x'.repeat(303)],
  ['dup1', 'QA BP duplicate name'],
  ['dup2', 'QA BP duplicate name'],
];
(async () => {
  const R = { at: new Date().toISOString(), results: [] }; const B = [];
  try {
    for (const [k, name] of cases) {
      const r = await tv.blueprint(def(name), false);
      const id = r.json && r.json.data && r.json.data.id; if (id) B.push(id);
      let stored = null;
      if (id) { const g = await call('GET', `/modules/${TICKETS}/blueprints/${id}`); const d = g.json && g.json.data; stored = d && ((d.definition && d.definition.name) || d.name); }
      R.results.push({ k, sentLen: name.length, status: r.status, error: r.json && r.json.error ? (r.json.error.code + ' ' + r.json.error.message) : null, storedLen: stored == null ? null : stored.length, storedSame: stored === name, stored: k.startsWith('long') ? (stored || '').slice(0, 24) + '…' : stored });
    }
  } catch (e) { R.error = e.message; }
  finally { R.cleanup = await tv.cleanup([], B); fs.writeFileSync(OUT, JSON.stringify(R, null, 2)); console.log(JSON.stringify(R, null, 1)); }
})();
