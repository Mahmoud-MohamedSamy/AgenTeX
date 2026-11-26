// node build.js  → social-test-plan.html (template: desk assignment rules test run; cases: cases.js)
const fs = require('fs'), path = require('path');
const D = __dirname;
const T = fs.readFileSync(path.join(D, '../desk-assignment-rules/assignment-rules-test-run.html'), 'utf8').split('\n');
const C = require('./cases.js');
const cssEnd = T.findIndex(l => l.startsWith('</style>'));
const casesStart = T.findIndex(l => l.startsWith('const CASES=['));
const casesEnd = T.findIndex((l, i) => i > casesStart && l.startsWith('];'));
const head = T.slice(0, cssEnd).join('\n').replace('<title>Assignment Rules Full Run</title>', '<title>Social Test Plan</title>');
const extraCss = `
details.plan{background:var(--surface);border:1px solid var(--line);border-radius:8px;padding:10px 14px}
details.plan>summary{cursor:pointer;font-weight:600}
details.plan h3{font-size:14px;margin:14px 0 4px}
details.plan p,details.plan li{font-size:14px;max-width:75ch}
details.plan ul{padding-left:18px;margin:4px 0}
.ptbl{overflow-x:auto;border:1px solid var(--line);border-radius:6px;margin:6px 0}
.ptbl table{border-collapse:collapse;width:100%;font-size:13.5px}
.ptbl th,.ptbl td{text-align:left;vertical-align:top;padding:6px 10px;border-bottom:1px solid var(--line)}
.ptbl th{color:var(--muted);font-weight:600;background:var(--bg)}
.ptbl tr:last-child td{border-bottom:0}
`;
const areas = [...new Set(C.map(c => c[2]))];
const countBy = k => { const m = {}; C.forEach(c => m[c[k]] = (m[c[k]] || 0) + 1); return m; };
const pri = countBy(1), typ = countBy(6);
const areaRows = areas.map(a => { const cs = C.filter(c => c[2] === a); return `<tr><td>${a}</td><td>${cs.length}</td><td>${cs.filter(c => c[1] === 'P0').length}</td></tr>`; }).join('');
const typeRows = Object.entries(typ).sort((a, b) => b[1] - a[1]).map(([k, v]) => `<tr><td>${k}</td><td>${v}</td></tr>`).join('');
const body = fs.readFileSync(path.join(D, 'plan-body.html'), 'utf8')
  .replace('{{N}}', C.length).replace('{{TYPES}}', typeRows).replace('{{AREAS}}', areaRows)
  .replace('{{P0}}', pri.P0 || 0).replace('{{P1}}', pri.P1 || 0).replace('{{P2}}', pri.P2 || 0);
const cases = 'const CASES=' + JSON.stringify(C).replace(/\],\[/g, '],\n[').replace(/</g, '\\u003c') + ';';
const rest = T.slice(casesEnd + 1).join('\n')
  .replace('placeholder="What you saw (ticket number, time, History order…)"', 'placeholder="What you saw (post link, time, network result, ticket number…)"');
fs.writeFileSync(path.join(D, 'social-test-plan.html'), head + '\n' + extraCss + '</style>\n' + body + '\n<script>\n' + cases + '\n' + rest);
console.log('cases', C.length, 'unique ids', new Set(C.map(c => c[0])).size, 'bytes', fs.statSync(path.join(D, 'social-test-plan.html')).size);
