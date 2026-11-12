// results.tsv -> out/sheet-results.json (one doc per sheet case id; CRM+Desk merged; worst status wins)
const fs = require('fs'); const RUN = __dirname + '/..';
const cases = require('D:/Learning & Work/Software Testing/Anyware Software/Automation/AgenTeX/docs/layout-rules/cases.js').cases;
const ids = new Set(cases.map(c => c[0]));
const last = {}; for (const l of fs.readFileSync(RUN + '/results.tsv', 'utf8').split(/\r?\n/).filter(Boolean)) { const [app, id, v, f] = l.split('\t'); if (ids.has(id)) last[app + '|' + id] = { app, id, v, f }; }
const map = { PASS: 'pass', FAIL: 'fail', GAP: 'gap', BLOCKED: 'blocked', INFO: 'info', NOTRUN: 'none' }; const rank = { fail: 5, gap: 4, blocked: 3, info: 2, pass: 1, none: 0 };
const by = {}; for (const r of Object.values(last)) { (by[r.id] = by[r.id] || []).push(r); }
const out = {}; for (const [id, rs] of Object.entries(by)) { const st = rs.map(r => map[r.v] || 'info').sort((a, b) => rank[b] - rank[a])[0]; out[id] = { status: st, notes: rs.map(r => (rs.length > 1 || true ? r.app.toUpperCase() + ' ' + r.v + ': ' : '') + r.f).join('\n\n').slice(0, 3000), ref: 'run 12 Nov 2026', at: new Date().toISOString(), by: null, byClaude: true }; }
fs.writeFileSync(RUN + '/out/sheet-results.json', JSON.stringify(out, null, 1));
const c = {}; Object.values(out).forEach(x => c[x.status] = (c[x.status] || 0) + 1); console.log(Object.keys(out).length, JSON.stringify(c));
