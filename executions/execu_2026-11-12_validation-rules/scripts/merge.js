// node merge.js -> out/sheet-results.json : { caseId: {status, notes} } from results.tsv (last line per app+case wins) + overrides
const fs = require('fs'), path = require('path');
const RUN = path.resolve(__dirname, '..');
const cases = require(path.resolve(RUN, '../../docs/validation-rules/cases.js')).cases;
const ids = new Set(cases.map(c => c[0]));
const rows = fs.readFileSync(RUN + '/results.tsv', 'utf8').split(/\r?\n/).filter(Boolean).map(l => l.split('\t'));
const V = { PASS: 'pass', FAIL: 'fail', INFO: 'info', BLOCKED: 'blocked', GAP: 'gap', CHECK: 'info', NOTRUN: 'none' };
const override = { // resolve CHECK lines after reading them
  'D13': 'pass', 'D24': 'pass', 'F10': 'info', 'J2': 'fail', 'J6': 'fail', 'J4': 'info'
};
const by = {};
for (const [app, rawId, v, fact] of rows) {
  let id = rawId.replace(/-(desk|api|ui|note|zoho)$/, ''); let a = /-desk$/.test(rawId) ? 'desk' : app;
  if (/^Z1[bc]$/.test(id)) id = 'Z1';
  if (!ids.has(id)) { console.error('skip', rawId); continue; }
  by[id] = by[id] || {}; by[id][a] = by[id][a] || {}; by[id][a][rawId] = { v: V[v] || 'info', fact };
}
const rank = { fail: 5, gap: 4, blocked: 3, info: 2, pass: 1, none: 0 };
const out = {};
for (const [id, apps] of Object.entries(by)) {
  const parts = []; let worst = 'none'; const vs = [];
  for (const [a, lines] of Object.entries(apps)) {
    for (const [rid, { v, fact }] of Object.entries(lines)) { vs.push(v); parts.push(`${a.toUpperCase()}${rid !== id && !rid.endsWith('-desk') ? ' (' + rid.replace(id, '').replace(/^-/, '') + ')' : ''}: ${fact}`); }
  }
  let st = vs.reduce((w, v) => rank[v] > rank[w] ? v : w, 'none');
  // a passing case with only side INFO notes stays pass
  if (st === 'info' && vs.includes('pass') && !vs.some(v => v === 'info' && false)) st = vs.filter(v => v === 'info').length && vs.filter(v => v === 'pass').length ? 'pass' : st;
  if (override[id]) st = override[id];
  out[id] = { status: st, notes: parts.join('\n').slice(0, 3800) };
}
fs.writeFileSync(RUN + '/out/sheet-results.json', JSON.stringify(out, null, 1));
const cnt = {}; Object.values(out).forEach(x => cnt[x.status] = (cnt[x.status] || 0) + 1);
console.log('cases with results', Object.keys(out).length, '/', cases.length, JSON.stringify(cnt));
console.log('not run:', cases.map(c => c[0]).filter(i => !out[i]).join(' '));
