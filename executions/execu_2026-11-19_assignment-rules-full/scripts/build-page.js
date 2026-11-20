const fs = require('fs'); const C = require('./cases.js'); const R = require('../out/results.json');
console.log('results without case:', Object.keys(R).filter(k => !C[k]).join(','));
console.log('cases without result:', Object.keys(C).filter(k => !R[k]).join(','));
const T = fs.readFileSync('../../../docs/desk-automation-execution-order/automation-order-test-run.html', 'utf8');
const a = T.indexOf('const CASES=['), b = T.indexOf('const STATES=');
const cases = 'const CASES=[\n' + Object.entries(C).map(([id, v]) => JSON.stringify([id, v[0], v[1], v[2], v[3], v[4], v[5] || ''])).join(',\n') + '\n];\n';
let h = T.slice(0, a) + cases + T.slice(b);
h = h.replace('<title>Desk Automation Order Run</title>', '<title>Assignment Rules Full Run</title>')
  .replace('<h1>Desk Automation Order Run</h1>', '<h1>Assignment Rules — Full Run</h1>')
  .replace(/<span class="env">[^<]*<\/span>/, '<span class="env">TAVI Desk · NDC-Staging · 19 Nov 2026 · Direct, Round Robin, Preferences, Skills</span>');
const pa = h.indexOf('<ul class="pre">'), pb = h.indexOf('</ul>', pa) + 5;
h = h.slice(0, pa) + `<ul class="pre">
    <li><b>Run 19 Nov 2026, 16:10–17:45 UTC</b> by Claude, API + browser, Desk Administrator account. Agents: A1 Test User 1 and A2 Mahmoud Samy held online; A3 Dev Team 2 always offline (its sign-in fails). Departments QA AS6 Dept A / Dept B. The statuses and comments below are Claude's; change any of them and Claude can read them back.</li>
    <li><b>Result:</b> 128 pass · 3 fail (F-08d and R-3137 are NDC-3137, already filed; B-06 "Is Escalated" missing from the criteria fields, not filed) · 1 blocked (R-2814: the positive holiday case needs the owner permission) · 4 not run (A-12, E-18, H-05, J-01).</li>
    <li><b>Requirements doc out of date:</b> On Hold tickets are no longer counted in the threshold (NDC-2824), and skill-based rules now follow Zoho (NDC-2931, NDC-2932). F-15, E-14b and E-14c pass against Zoho, not against the doc.</li>
    <li><b>Observations, not bugs yet:</b> a ticket gets no history entry when it enters the backlog; an owner set by a workflow on create has no history entry; "SLA Violated = false" does not match tickets that have no SLA; agents without the permission can read the master switches; the API accepts the agent-level threshold switched on with no rows (the UI blocks it); a ticket moved into a department is assigned by that department's round robin (trigger "moved").</li>
    <li>All test data deleted and purged (205 tickets, 36 rules, 3 workflows, 25 skills, 1 skill type, 1 SLA policy, 1 contact, 1 account). Preferences, switches and department members restored.</li>
  </ul>` + h.slice(pb);
h = h.replace(/const FILTERS=\[.*\];/, 'const FILTERS=[["all","All"],["P0","P0"],["P1","P1"],["P2","P2"],["|"],["Not run","Not run"],["Fail","Fail"],["Blocked","Blocked"],["Skipped","Skipped"]];');
const out = '../../../docs/desk-assignment-rules/assignment-rules-test-run.html'; fs.writeFileSync(out, h); console.log('bytes', h.length);
// db seed file: map statuses
const map = { Pass: 'Pass', Fail: 'Fail', Partial: 'Blocked', Info: 'Pass', 'Not run': 'Skipped' };
const writes = Object.values(R).filter(r => C[r.id]).map(r => ({ op: 'set', collection: 'results', doc_id: r.id, data: { id: r.id, status: map[r.status] || r.status, comment: (r.status === 'Info' ? 'Info: ' : r.status === 'Partial' ? 'Partial: ' : '') + r.comment, updatedAt: r.at } }));
for (let i = 0; i < writes.length; i += 50) fs.writeFileSync('../out/seed-' + (i / 50) + '.json', JSON.stringify(writes.slice(i, i + 50)));
console.log('writes', writes.length);
