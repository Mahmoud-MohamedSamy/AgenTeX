// Builds execution-report.html for the Desk workflow rules regression (runs 1 + 2 + fail retest).
const fs = require('fs'), path = require('path');
const RUN = path.join(__dirname, '../../../executions/execu_2026-11-22_desk-wf-regression');
const C = require('./cases.json'); const D = require('./bug-drafts.js');
const lines = fs.readFileSync(RUN + '/out/results.jsonl', 'utf8').trim().split('\n').map(JSON.parse);
const hist = {}; for (const r of lines) (hist[r.id] = hist[r.id] || []).push(r);
const last = id => (hist[id] || []).slice(-1)[0];
const esc = s => String(s == null ? '' : s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const V = ['PASS', 'FAIL', 'FINDING', 'PARTIAL', 'INCONCLUSIVE', 'BLOCKED', 'N/A'];
const cls = v => ({ PASS: 'pass', FAIL: 'fail', FINDING: 'find', PARTIAL: 'part', INCONCLUSIVE: 'part', BLOCKED: 'blk', 'N/A': 'na' }[v] || 'na');
const runOf = r => !r ? '—' : r.at >= '2026-11-23T07' ? 'Retest 23 Nov' : r.at < '2026-11-22T16:45' ? 'Run 1' : 'Run 2';
const cases = C.cases.map(c => ({ ...c, r: last(c.id) || {} }));
const tally = {}; for (const c of cases) { const v = c.r.verdict || 'NOT RUN'; tally[v] = (tally[v] || 0) + 1; }
const total = cases.length;
const byRun = { 'Run 1': 0, 'Run 2': 0, 'Retest 23 Nov': 0 }; for (const c of cases) { const first = (hist[c.id] || [])[0]; byRun[runOf(first)] = (byRun[runOf(first)] || 0) + 1; }
// per group
const G = Object.entries(C.groups).map(([k, name]) => { const cs = cases.filter(c => c.group === k); const t = {}; for (const c of cs) t[c.r.verdict] = (t[c.r.verdict] || 0) + 1; return { k, name, n: cs.length, t }; }).filter(g => g.n);
const bar = (t, n) => '<div class="bar" role="img" aria-label="' + V.filter(v => t[v]).map(v => t[v] + ' ' + v.toLowerCase()).join(', ') + '">' + V.filter(v => t[v]).map(v => `<span class="${cls(v)}" style="width:${(t[v] / n * 100).toFixed(2)}%"></span>`).join('') + '</div>';
const pill = v => `<span class="pill ${cls(v)}">${esc(v)}</span>`;
const pick = vs => cases.filter(c => vs.includes(c.r.verdict));
// cleanup
const cl1 = { rules: 170, tickets: 294, contacts: 3 }; const cl2 = require(RUN + '/out/cleanup2.json');
const clRt = { rules: 5, tickets: 14, ar: 2, bin: 19 };
const rulesDel = cl1.rules + cl2.rules.ok + clRt.rules, ticketsDel = cl1.tickets + cl2.tickets.ok + cl2.tickets.gone + clRt.tickets;
const draftsBy = r => D.filter(d => d.rec === r);
const recTxt = { file: 'Ready to file', check: 'Check one thing first', decide: 'Decision / Zoho check' };
const fixed = [
  ['TC-04', 'Date-Time rule conditions are read at fire time and after edits', 'FAIL in run 2 → PASS on the 23 Nov retest (8 of 8 tickets)'],
  ['AT-06', 'Add followers on an On Create rule adds the follower', 'FAIL in run 1 → PASS in run 2'],
  ['OB-03', 'Execution History filter by record returns the rows', 'Finding in run 1 → PASS in run 2'],
  ['OB-05', '"No match" runs are logged and shown', 'Finding in run 1 → PASS in run 2'],
  ['OB-06', 'Ticket history lists each field a rule changed', 'Finding in run 1 → PASS in run 2'],
  ['RM-10', 'Rule scoped to an inactive or deleted department behaves correctly', 'Finding early in run 2 → PASS after recheck'],
  ['TD-13 / MX-06', 'Misleading "cannot run … by a date" message on Date-Time rules', 'Gone on the 23 Nov re-check'],
  ['L-10', '"n of 200 rules used in this department" counter', 'Present on the 23 Nov re-check (counts active rules only)'],
  ['L-09', 'Rules list beyond 200 rules', 'UI loads every page; API cap has no user impact (23 Nov)'],
  ['AC-07', 'Owner Assignment by role round robin', 'Corrected 23 Nov: works with Desk roles (earlier fail used the CRM role list)'],
  ['RG-07', 'October bugs B-1 … B-9', 'All fixed or working (B-5 n/a)'],
];
const shared = [
  ['Tenant business hours', '24/7 → custom 01:00–23:00 for about 3 min, then back to 24/7', 'Verified'],
  ['Holiday list for today on the default profile', 'Created for about 3 min, then deleted', 'Verified'],
  ['Customer Happiness', 'On for QA AO Dept B only, about 2 min', 'Restored, no differences'],
  ['Direct assignment switch', 'On for about 25 s (IN-01)', 'Restored off, verified 23 Nov'],
  ['Owner account UI language', 'Arabic for the right-to-left check (UX-03)', 'Back to English, verified'],
];
const blockedNeed = { 'TE-01': 'Customer reply by email or Help Center portal', 'TE-02': 'Customer reply by email or Help Center portal', 'TC-05': 'Customer reply by email or Help Center portal', 'E2E-01': 'Customer reply by email or Help Center portal', 'AX-01': 'Slack / Teams / Google Chat / WhatsApp connection', 'AX-02': 'Chat or IM connection', 'AX-03': 'Chat or IM connection', 'AX-04': 'Chat or IM connection', 'AX-05': 'Chat or IM connection', 'RC-06': 'Chat or IM connection', 'TF-10': 'Change to the Tickets module fields (avoided)', 'CL-13': 'Change to the Tickets module fields (avoided)', 'PS-01': 'An account without rule-view permission', 'PS-05': 'A department-scoped admin account' };
const X = require('./exec-details.js'); const DR = Object.fromEntries(D.map(d => [d.id, d]));
const detail = (x, kind) => { const d = DR[x.id] || {}; const c = cases.find(k => k.id === x.id) || {};
  return `<article class="det" id="d-${esc(x.id)}"><div class="dhead"><span class="id">${esc(x.id)}</span>${pill(kind)}<span class="sev sev-${esc(x.severity.toLowerCase())}">${esc(x.severity)}</span></div>
  <h3>${esc((d.title || '').replace(/^Desk Workflow Rules | /, ''))}</h3>
  <p class="sub">Plan case: ${esc(c.title)} · priority ${esc(c.pri)}</p>
  <div class="dgrid"><div><h4>Set-up</h4><ul>${x.setup.map(t => `<li>${esc(t)}</li>`).join('')}</ul>
  <h4>Steps to reproduce</h4><ol>${(d.steps || []).map(t => `<li>${esc(t)}</li>`).join('')}</ol></div>
  <div><h4>Expected</h4><p>${esc(d.expected)}</p><h4>Actual</h4><p>${esc(d.actual)}</p><h4>System message</h4><p><code>${esc(x.message)}</code></p><h4>Impact</h4><p>${esc(x.impact)}</p>${d.check ? `<h4>Before filing</h4><p>${esc(d.check)}</p>` : ''}</div></div>
  <h4>Every attempt</h4><div class="scroll"><table><thead><tr><th>Run</th><th>Variant</th><th>Volume</th><th>Outcome</th></tr></thead><tbody>${x.attempts.map(a => `<tr><td class="run">${esc(a[0])}</td><td>${esc(a[1])}</td><td>${esc(a[2])}</td><td>${esc(a[3])}</td></tr>`).join('')}</tbody></table></div>
  <p class="sub">Environment: NDC-Staging, Desk → Tickets, owner account.${x.evidence ? ' Screenshot: ' + esc(x.evidence) + '.' : ''} Plane draft: ${esc(d.title || '—')} (not filed).</p></article>`; };
const stat = (n, label, k) => `<div class="stat ${k || ''}"><b>${n}</b><span>${label}</span></div>`;
const row = c => `<tr data-v="${esc(c.r.verdict || '')}" data-g="${esc(c.group)}"><td class="id">${esc(c.id)}</td><td>${esc(c.title)}</td><td>${esc(c.pri)}</td><td>${pill(c.r.verdict || 'NOT RUN')}</td><td class="note">${esc(c.r.note)}</td><td class="run">${runOf(c.r)}</td></tr>`;
const list = (cs, withNeed) => `<div class="scroll"><table><thead><tr><th>Case</th><th>What was tested</th><th>Result and note</th>${withNeed ? '<th>Needs</th>' : ''}</tr></thead><tbody>${cs.map(c => `<tr><td class="id">${esc(c.id)}</td><td>${esc(c.title)}</td><td>${pill(c.r.verdict)} ${esc(c.r.note)}</td>${withNeed ? `<td>${esc(blockedNeed[c.id] || '')}</td>` : ''}</tr>`).join('')}</tbody></table></div>`;

const html = `<title>Workflow Rules Regression Report</title>
<meta name="claude:viewport-fit-sides" content="cover">
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:wght@400;500;600;700&family=IBM+Plex+Mono:wght@400;500&display=swap">
<style>
/* Layout: one reading column of report sections; summary first, then evidence tables, then the full case log. */
:root { --bg:#f6f7f9; --panel:#ffffff; --fg:#1b2330; --muted:#5d6878; --line:#dde2e9; --accent:#2b5fab;
  --pass:#1f8a5b; --fail:#c23b3b; --find:#c67a12; --part:#7b5cc4; --blk:#5f6b7a; --na:#a3acb8;
  --sans:'IBM Plex Sans', system-ui, -apple-system, 'Segoe UI', sans-serif; --mono:'IBM Plex Mono', ui-monospace, Consolas, monospace; }
@media (prefers-color-scheme: dark) { :root:not([data-theme="light"]) { --bg:#12161c; --panel:#1a2029; --fg:#e4e8ee; --muted:#9aa5b4; --line:#2d3542; --accent:#7aa7ec; --pass:#43b883; --fail:#e86b6b; --find:#e7a54a; --part:#a48cea; --blk:#8995a5; --na:#5b6573; color-scheme:dark } }
:root[data-theme="dark"] { --bg:#12161c; --panel:#1a2029; --fg:#e4e8ee; --muted:#9aa5b4; --line:#2d3542; --accent:#7aa7ec; --pass:#43b883; --fail:#e86b6b; --find:#e7a54a; --part:#a48cea; --blk:#8995a5; --na:#5b6573; color-scheme:dark }
body { background:var(--bg); color:var(--fg); font-family:var(--sans); font-size:15px; line-height:1.55 }
.wrap { max-width:1120px; margin:0 auto; padding-block:28px 60px; padding-left:max(16px, env(safe-area-inset-left, 0px)); padding-right:max(16px, env(safe-area-inset-right, 0px)); display:grid; gap:22px }
header { display:grid; gap:6px }
.eyebrow { font:500 12px/1 var(--mono); letter-spacing:.08em; text-transform:uppercase; color:var(--accent) }
h1 { font-size:clamp(26px, 4vw, 34px); line-height:1.15; margin:0; text-wrap:balance; font-weight:700 }
h2 { font-size:20px; margin:0 0 10px; text-wrap:balance }
h3 { font-size:15px; margin:14px 0 6px }
p { margin:0 0 8px; max-width:75ch }
.meta { display:flex; flex-wrap:wrap; gap:6px 18px; color:var(--muted); font-size:13.5px }
.meta b { color:var(--fg); font-weight:600 }
section { background:var(--panel); border:1px solid var(--line); border-radius:10px; padding:18px 20px; min-width:0 }
.stats { display:grid; grid-template-columns:repeat(auto-fit, minmax(118px, 1fr)); gap:10px }
.stat { border:1px solid var(--line); border-radius:8px; padding:10px 12px; display:grid; gap:2px; border-top:3px solid var(--accent) }
.stat b { font-size:26px; font-variant-numeric:tabular-nums; line-height:1.1 }
.stat span { font-size:12.5px; color:var(--muted) }
.stat.pass { border-top-color:var(--pass) } .stat.fail { border-top-color:var(--fail) } .stat.find { border-top-color:var(--find) } .stat.part { border-top-color:var(--part) } .stat.blk { border-top-color:var(--blk) } .stat.na { border-top-color:var(--na) }
.bar { display:flex; height:12px; border-radius:3px; overflow:hidden; background:var(--line); min-width:80px }
.bar span { display:block; height:100% } .bar .pass { background:var(--pass) } .bar .fail { background:var(--fail) } .bar .find { background:var(--find) } .bar .part { background:var(--part) } .bar .blk { background:var(--blk) } .bar .na { background:var(--na) }
.bar.big { height:18px; margin:14px 0 6px }
.legend { display:flex; flex-wrap:wrap; gap:4px 14px; font-size:12.5px; color:var(--muted) }
.legend i { display:inline-block; width:10px; height:10px; border-radius:2px; margin-right:5px; vertical-align:-1px }
.legend .pass { background:var(--pass) } .legend .fail { background:var(--fail) } .legend .find { background:var(--find) } .legend .part { background:var(--part) } .legend .blk { background:var(--blk) } .legend .na { background:var(--na) }
.scroll { overflow-x:auto; max-width:100% }
table { border-collapse:collapse; width:100%; font-size:13.5px }
th, td { text-align:left; vertical-align:top; padding:7px 8px; border-bottom:1px solid var(--line) }
th { font-weight:600; color:var(--muted); font-size:12px; text-transform:uppercase; letter-spacing:.05em; white-space:nowrap }
td.id, td.run { font-family:var(--mono); font-size:12.5px; white-space:nowrap }
td.num { font-variant-numeric:tabular-nums; text-align:right; white-space:nowrap }
td.note { color:var(--muted); min-width:260px }
.pill { display:inline-block; font:600 11px/1.6 var(--mono); padding:0 7px; border-radius:20px; border:1px solid currentColor; white-space:nowrap }
.pill.pass { color:var(--pass) } .pill.fail { color:var(--fail) } .pill.find { color:var(--find) } .pill.part { color:var(--part) } .pill.blk { color:var(--blk) } .pill.na { color:var(--muted) }
.two { display:grid; grid-template-columns:repeat(auto-fit, minmax(300px, 1fr)); gap:16px }
.two > * { min-width:0 }
ul { margin:0; padding-left:20px } li { margin:3px 0 }
details { border:1px solid var(--line); border-radius:8px; padding:8px 12px; margin:6px 0 }
summary { cursor:pointer; font-weight:500 }
summary:focus-visible, button:focus-visible, select:focus-visible, input:focus-visible { outline:2px solid var(--accent); outline-offset:2px }
.filters { display:flex; flex-wrap:wrap; gap:8px; margin:6px 0 10px }
.filters input, .filters select { font:inherit; font-size:13.5px; padding:6px 9px; border:1px solid var(--line); border-radius:6px; background:var(--bg); color:var(--fg); min-width:0 }
.filters input { flex:1 1 220px }
.count { color:var(--muted); font-size:13px; align-self:center }
.sub { color:var(--muted); font-size:13px }
.callout { border-left:3px solid var(--accent); padding:4px 0 4px 12px }
.det { border:1px solid var(--line); border-radius:8px; padding:14px 16px; display:grid; gap:4px; margin-top:12px; scroll-margin-top:12px }
.det h3 { margin:2px 0 0; font-size:16.5px; text-wrap:balance } .det h4 { margin:10px 0 4px; font-size:12px; text-transform:uppercase; letter-spacing:.06em; color:var(--muted) } .det p { margin:0 }
.dhead { display:flex; flex-wrap:wrap; align-items:center; gap:8px } .dhead .id { font:600 13px var(--mono) }
.dgrid { display:grid; grid-template-columns:repeat(auto-fit, minmax(280px, 1fr)); gap:4px 22px } .dgrid > * { min-width:0 }
.sev { font:600 11px/1.6 var(--mono); padding:0 7px; border-radius:4px; background:var(--line) } .sev-high { color:var(--fail) } .sev-medium { color:var(--find) } .sev-low { color:var(--muted) }
.toc { display:flex; flex-wrap:wrap; gap:6px; margin:4px 0 2px } .toc a { font:500 12.5px var(--mono); color:var(--accent); text-decoration:none; border:1px solid var(--line); border-radius:5px; padding:1px 7px } .toc a:hover { border-color:var(--accent) }
code { font-family:var(--mono); font-size:12.5px }
</style>
<div class="wrap">
<header>
  <div class="eyebrow">Execution report · Desk · Workflow Rules</div>
  <h1>Workflow Rules Regression Report</h1>
  <div class="meta"><span><b>Environment</b> NDC-Staging (TAVI Desk, staging-desk.taviportal.com)</span><span><b>Module</b> Tickets</span><span><b>Dates</b> 22–23 Nov 2026</span><span><b>Cases</b> ${total}</span><span><b>Method</b> API + browser (Playwright)</span><span><b>Plane</b> nothing filed</span></div>
</header>

<section>
  <h2>Summary</h2>
  <p>All ${total} planned cases have a result. ${tally.PASS} pass (${(tally.PASS / total * 100).toFixed(0)}%). ${tally.FAIL} cases still fail after the 23 Nov retest, ${tally.FINDING} findings need a decision, and ${tally.BLOCKED} cases are blocked by missing connections, accounts or a module-field change.</p>
  <div class="stats" style="margin-top:12px">
    ${stat(tally.PASS, 'pass', 'pass')}${stat(tally.FAIL, 'fail', 'fail')}${stat(tally.FINDING, 'findings', 'find')}${stat((tally.PARTIAL || 0) + (tally.INCONCLUSIVE || 0), 'partial / inconclusive', 'part')}${stat(tally.BLOCKED, 'blocked', 'blk')}${stat(tally['N/A'] || 0, 'not applicable', 'na')}
  </div>
  ${bar(tally, total).replace('class="bar"', 'class="bar big"')}
  <div class="legend">${V.filter(v => tally[v]).map(v => `<span><i class="${cls(v)}"></i>${v} ${tally[v]}</span>`).join('')}</div>
  <h3>Headlines</h3>
  <ul>
    <li><b>Still failing (2):</b> "field changed" matches when a ticket is created, so Create or Edit rules run on every new ticket (TC-01, retested twice 23 Nov); Test rule on an unsaved rule errors (OB-02).</li>
    <li><b>AC-07 corrected to pass:</b> role round robin works. The earlier fail read role membership from the CRM roles instead of the Desk roles; with Desk roles every result was correct (Manager → Dev Team 2 / Test User 1, Supervisor → CES 1 / CES 2, CEO → nobody in Dept B).</li>
    <li><b>AC-10 changed to a finding:</b> neither the Desk editor nor Zoho Desk offers "assign through an assignment rule"; only TAVI's API accepts it, and it never assigns. Needs a decision: remove from the API or make it work.</li>
    <li><b>Biggest finding:</b> editing a rule silently cancels its pending scheduled actions (MR-07).</li>
    <li><b>Fixed:</b> TC-04 on the 23 Nov retest; AT-06, OB-03, OB-05, OB-06 since run 1; October B-1 … B-8.</li>
    <li><b>Details:</b> full write-ups of the 2 failures and the 11 detailed findings (incl. AC-10) are in the sections after the Findings table.</li>
    <li><b>Drafts:</b> ${D.length} Plane drafts written — ${draftsBy('file').length} ready to file, ${draftsBy('check').length} need one check, ${draftsBy('decide').length} need a decision or Zoho check.</li>
  </ul>
</section>

<section>
  <h2>Execution timeline</h2>
  <div class="scroll"><table><thead><tr><th>Run</th><th>When</th><th>Scope</th><th class="num">Cases first run</th></tr></thead><tbody>
    <tr><td class="id">Run 1</td><td>22 Nov, 14:39–16:42 UTC</td><td>Core triggers, conditions, actions, combinations, test rule, API checks; cleanup to zero</td><td class="num">${byRun['Run 1']}</td></tr>
    <tr><td class="id">Run 2</td><td>22 Nov 16:45 – 23 Nov 00:00 UTC</td><td>All remaining cases: business hours, happiness, skills, teams, assignment rules, macros, blueprint, permissions, UI and Arabic passes, performance; cleanup to zero</td><td class="num">${byRun['Run 2']}</td></tr>
    <tr><td class="id">Retest</td><td>23 Nov, 07:50–08:09 UTC</td><td>The 5 failing cases (AC-07, AC-10, TC-01, TC-04, OB-02), TC-04 twice; cleanup to zero</td><td class="num">—</td></tr>
  </tbody></table></div>
</section>

<section>
  <h2>Results by area</h2>
  <div class="scroll"><table><thead><tr><th>Area</th><th class="num">Cases</th><th class="num">Pass</th><th class="num">Fail</th><th class="num">Find.</th><th class="num">Part.</th><th class="num">Blocked</th><th style="width:28%">Spread</th></tr></thead><tbody>
  ${G.map(g => `<tr><td><span class="id" style="font-family:var(--mono);font-size:12.5px">${esc(g.k)}</span> ${esc(g.name)}</td><td class="num">${g.n}</td><td class="num">${g.t.PASS || ''}</td><td class="num">${g.t.FAIL || ''}</td><td class="num">${g.t.FINDING || ''}</td><td class="num">${(g.t.PARTIAL || 0) + (g.t.INCONCLUSIVE || 0) || ''}</td><td class="num">${g.t.BLOCKED || ''}</td><td>${bar(g.t, g.n)}</td></tr>`).join('')}
  </tbody></table></div>
</section>

<section>
  <h2>Failures (retested 23 Nov)</h2>
  ${list(pick(['FAIL']))}
</section>

<section>
  <h2>Findings</h2>
  <p class="sub">Behaviour that is wrong, missing or needs a product decision. "Check Zoho" items are recorded as behaviour; Zoho was not checked live in this run.</p>
  ${list(pick(['FINDING']))}
  <p class="sub" style="margin-top:8px">Also noted outside the plan: UX-09, the Test rule sample record uses the CRM field "revenue".</p>
</section>

<section>
  <h2>Failure details</h2>
  <p class="sub">The cases that still fail after the 23 Nov retest, with the set-up, every attempt and the exact message from Execution History.</p>
  <nav class="toc" aria-label="Failure details">${X.fails.map(x => `<a href="#d-${esc(x.id)}">${esc(x.id)}</a>`).join('')}</nav>
  ${X.fails.map(x => detail(x, 'FAIL')).join('')}
</section>

<section>
  <h2>New findings in run 2 — details</h2>
  <p class="sub">The findings first seen in run 2 (22–23 Nov), plus AC-10, which moved from fail to finding after the Zoho check. Run 1 findings are listed in the Findings table above.</p>
  <nav class="toc" aria-label="Finding details">${X.findings.map(x => `<a href="#d-${esc(x.id)}">${esc(x.id)}</a>`).join('')}</nav>
  ${X.findings.map(x => detail(x, 'FINDING')).join('')}
</section>

<section>
  <h2>Fixed since earlier runs</h2>
  <div class="scroll"><table><thead><tr><th>Case</th><th>Behaviour</th><th>History</th></tr></thead><tbody>${fixed.map(([a, b, c]) => `<tr><td class="id">${esc(a)}</td><td>${esc(b)}</td><td>${esc(c)}</td></tr>`).join('')}</tbody></table></div>
</section>

<section>
  <h2>Partial and inconclusive</h2>
  <p class="sub">Part of the case passed or could be observed; the note says what is missing.</p>
  ${list(pick(['PARTIAL', 'INCONCLUSIVE']))}
</section>

<section>
  <h2>Blocked</h2>
  ${list(pick(['BLOCKED']), true)}
  <p class="sub" style="margin-top:8px">PS-06 (draft resume) and PS-08 (leave the editor with unsaved changes) could not be driven reliably by automation and need a short manual check.</p>
</section>

<section>
  <h2>Plane drafts (${D.length}, not filed)</h2>
  <p class="sub">Titles follow "Feature | Descriptive Bug Title". Priority is a suggestion. Full steps, expected and actual results are on the plan page and in <code>docs/desk-workflow-rules/regression/bug-drafts.md</code>.</p>
  <div class="scroll"><table><thead><tr><th>Case</th><th>Type</th><th>Priority</th><th>Status</th><th>Title</th></tr></thead><tbody>
  ${D.map(b => `<tr><td class="id">${esc(b.id)}${b.also ? ' + ' + esc(b.also) : ''}</td><td>${pill(b.kind)}</td><td>${esc(b.pri)}</td><td>${esc(recTxt[b.rec])}</td><td>${esc(b.title)}${b.check ? `<div class="sub">Before filing: ${esc(b.check)}</div>` : ''}</td></tr>`).join('')}
  </tbody></table></div>
</section>

<div class="two">
<section>
  <h2>How it was run</h2>
  <ul>
    <li>Every case ran through the Desk API as the owner account, with one saved sign-in per run.</li>
    <li>Rules were scoped to two QA departments (QA RT19 WF Dept, QA AO Dept B) and guarded by <code>Subject starts with "QA WF &lt;tag&gt; "</code>, so no teammate ticket could match.</li>
    <li>Outcomes were read from Execution History (outcome and each action's status), the ticket's fields and history, and webhook.site for webhook calls.</li>
    <li>Browser passes covered the rules list, editor, settings, Arabic layout, Execution History, and permissions as a Desk Agent and a Desk Supervisor.</li>
    <li>Customer ratings were given through each ticket's rating link, acting as the customer.</li>
    <li>Teammates' rules and the Standard layout were not touched.</li>
  </ul>
</section>
<section>
  <h2>Test data and cleanup</h2>
  <div class="scroll"><table><tbody>
    <tr><td>Workflow rules created and deleted</td><td class="num">${rulesDel}</td></tr>
    <tr><td>Tickets created and deleted</td><td class="num">${ticketsDel}</td></tr>
    <tr><td>Contacts</td><td class="num">${cl1.contacts + (cl2.contacts.ok || 0)}</td></tr>
    <tr><td>Assignment rules</td><td class="num">${(cl2.ar.ok + cl2.ar.gone) + clRt.ar}</td></tr>
    <tr><td>Team, skills + skill type, macro, blueprint, tags</td><td class="num">all</td></tr>
    <tr><td>Recycle Bin items purged</td><td class="num">${cl2.binPurged + clRt.bin}+</td></tr>
  </tbody></table></div>
  <p class="sub" style="margin-top:8px">Verified 23 Nov 08:09 UTC: 0 QA rules, 0 QA Recycle Bin items, 0 QA assignment rules; the only active rule is the teammate's "test"; direct switch off. The Tasks list does not page past 100 records; no QA tasks were in the first 100.</p>
</section>
</div>

<section>
  <h2>Shared settings changed during the run</h2>
  <div class="scroll"><table><thead><tr><th>Setting</th><th>Change</th><th>Restored</th></tr></thead><tbody>${shared.map(([a, b, c]) => `<tr><td>${esc(a)}</td><td>${esc(b)}</td><td>${esc(c)}</td></tr>`).join('')}</tbody></table></div>
</section>

<section>
  <h2>All cases</h2>
  <div class="filters">
    <input id="q" type="search" placeholder="Search case id, title or note" aria-label="Search cases">
    <select id="fv" aria-label="Filter by result"><option value="">All results</option>${V.filter(v => tally[v]).map(v => `<option>${v}</option>`).join('')}</select>
    <select id="fg" aria-label="Filter by area"><option value="">All areas</option>${G.map(g => `<option value="${esc(g.k)}">${esc(g.k)} · ${esc(g.name)}</option>`).join('')}</select>
    <span class="count" id="cnt">${total} cases</span>
  </div>
  <div class="scroll"><table id="all"><thead><tr><th>Case</th><th>What was tested</th><th>Pri</th><th>Result</th><th>Note</th><th>Last run</th></tr></thead><tbody>${cases.map(row).join('')}</tbody></table></div>
</section>
<p class="sub">Source: executions/execu_2026-11-22_desk-wf-regression (results.jsonl, ledger.md, cleanup logs). Plan page: claude.ai/artifact/Kj2AKEZSCw1LpH8LTjbC98.</p>
</div>
<script>
(function () {
  var q = document.getElementById('q'), fv = document.getElementById('fv'), fg = document.getElementById('fg'), cnt = document.getElementById('cnt');
  var rows = Array.prototype.slice.call(document.querySelectorAll('#all tbody tr'));
  function apply() { var t = q.value.trim().toLowerCase(), v = fv.value, g = fg.value, n = 0;
    rows.forEach(function (r) { var ok = (!v || r.dataset.v === v) && (!g || r.dataset.g === g) && (!t || r.textContent.toLowerCase().indexOf(t) >= 0); r.hidden = !ok; if (ok) n++; });
    cnt.textContent = n + ' of ' + rows.length + ' cases'; }
  q.addEventListener('input', apply); fv.addEventListener('change', apply); fg.addEventListener('change', apply);
})();
</script>
`;
fs.writeFileSync(path.join(__dirname, 'execution-report.html'), html);
console.log('written', html.length, 'bytes', JSON.stringify(tally), 'rules', rulesDel, 'tickets', ticketsDel, byRun);
