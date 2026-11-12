// C20 + cleanup: remove the QA statuses from the Status field's allowed values (PUT /modules/{tickets}/fields/{id}).
// 1) blueprint uses "QA BP Verify" → try removing only that value (expect refusal); 2) delete blueprint; 3) remove every "QA BP" value.
// Usage: TV_CACHE=... node status-clean.js [--dry]
const tv = require('./tv'); const fs = require('fs'); const path = require('path'); const { call, QA_DEPT, TICKETS } = tv;
const OUT = path.resolve(__dirname, '../evidence/raw'); const R = {}; const B = [];
const BASE = ['Open', 'On Hold', 'Escalated', 'Closed', 'Reopened'];
const field = async () => (await call('GET', `/modules/${TICKETS}/fields`)).json.data.find(x => x.fieldName === 'status');
const put = (f, values) => call('PUT', `/modules/${TICKETS}/fields/${f.id}`, { fieldName: f.fieldName, labels: f.labels || {}, datatypeKey: f.datatypeKey, datatypeOptions: { ...f.datatypeOptions, allowed_values: values }, required: !!(f.config && f.config.required), unique: !!(f.config && f.config.unique) });
(async () => {
  let f = await field(); const vals = f.datatypeOptions.allowed_values;
  if (!BASE.every(v => vals.includes(v))) throw new Error('baseline statuses missing - stop');
  const others = vals.filter(v => !BASE.includes(v) && !/^QA BP/.test(v)); if (others.length) R.othersKept = others;
  // C20
  const st = (id, x, extra = {}) => ({ id, name: id, position: { x, y: 0 }, slaClock: 'business', ...extra });
  const tr = (id, a, b) => ({ id, name: 'QA ' + id, fromStateId: a, toStateId: b, before: {}, during: {}, after: { actions: [] } });
  const c = await tv.blueprint({ name: 'QA BP C20', description: 'QA automation - safe to delete', moduleKey: 'desk_tickets', targetField: 'status', departmentId: QA_DEPT,
    entryCriteria: { op: 'contains', field: 'subject', value: 'QA BP C20 ' }, states: [st('Open', 0), st('QA BP Verify', 400), st('Closed', 800, { isTerminal: true })],
    transitions: [tr('v', 'Open', 'QA BP Verify'), tr('end', 'QA BP Verify', 'Closed')] }, true);
  const cid = c.json && c.json.data && c.json.data.id; if (cid) B.push(cid);
  const r1 = await put(f, vals.filter(v => v !== 'QA BP Verify'));
  R.C20 = { blueprint: c.status, removeUsed: { status: r1.status, error: r1.json && r1.json.error } };
  f = await field(); R.C20.stillThere = f.datatypeOptions.allowed_values.includes('QA BP Verify');
  if (!R.C20.stillThere && cid) { const g = await call('GET', `/modules/${TICKETS}/blueprints/${cid}`); R.C20.blueprintAfter = (g.text || '').slice(0, 300); }
  console.log('C20', JSON.stringify(R.C20).slice(0, 700));
})().catch(e => { R.error = e.message; console.error('ERR', e.message); }).finally(async () => {
  const log = [await tv.cleanup([], B)];
  try {
    const f = await field(); const keep = f.datatypeOptions.allowed_values.filter(v => !/^QA BP/.test(v));
    if (keep.length !== f.datatypeOptions.allowed_values.length) { const p = await put(f, keep); log.push(`remove QA values ${p.status}${p.status >= 300 ? ' ' + p.text.slice(0, 300) : ''}`); }
    const now = (await field()).datatypeOptions.allowed_values; const st = (await call('GET', '/desk/ticket-statuses')).json.data.statuses.map(s => s.value + ':' + s.type);
    log.push('values ' + JSON.stringify(now)); log.push('statuses ' + JSON.stringify(st));
  } catch (e) { log.push('ERR ' + e.message); }
  R.cleanup = log.join(', '); console.log('cleanup', R.cleanup); fs.writeFileSync(path.join(OUT, 'status-clean.json'), JSON.stringify(R, null, 2));
});
