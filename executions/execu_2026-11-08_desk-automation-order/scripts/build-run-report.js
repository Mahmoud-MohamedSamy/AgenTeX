// Builds report-run-2026-11-10.html: the whole Desk automation-order run so far (8–10 Nov 2026). Local file; images by relative path.
const fs = require('fs'); const D = __dirname + '/..';
const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;');
const pill = (t, c) => `<span class="pill ${c}">${esc(t)}</span>`;
const ST = { done: ['Done', 'ok'], part: ['Partial', 'warn'], no: ['Not started', 'mute'], filed: ['Filed', 'ok'], blocked: ['Blocked', 'mute'] };

const plan = [
  ['A5', 'SLA (SL-01..SL-67)', 'done', '66 of 67 run; SL-18 blocked (no inbound mailbox in a QA department).'],
  ['A7', 'Notifications (NT-01..NT-30)', 'done', 'All 30 run; NT-07 waits on one Gmail check.'],
  ['A1–A3', 'Skills, Direct assignment, Round robin (spec v2)', 'done', '~115 cases in two lanes (runtime + screens). 1 new failure (F-08), NDC-2824 still fails.'],
  ['A4', 'Workflow', 'no', 'Next. Includes re-check of B-1..B-9 and the 50-rule list cap.'],
  ['A6', 'Blueprint', 'no', 'Current state only for NDC-2755..2788.'],
  ['A8', 'Macros', 'no', ''],
  ['B', 'Pairs (OR-01..OR-35)', 'no', 'Some rows need live Zoho.'],
  ['C', 'Whole order (OR-22..27, E2E-1..4)', 'no', '100-ticket timing and real-mail journeys.'],
  ['Z', 'Missing list vs Zoho', 'filed', 'NDC-2829: 15 gaps with images; 5 items need live Zoho.'],
  ['—', 'Live Zoho comparisons', 'no', 'Zoho mostly does not load on this network; help pages used, marked "not live".'],
  ['V', 'Visual checks', 'part', 'SLA, notifications, assignment and Skills screens checked in English, Arabic and 390 px; no real defects. Dark theme not available.']];

const filed = [
  ['NDC-2825', 'SL-30', 'High', 'SLA | Updating a ticket does not restart an SLA that is set to run on Ticket Update', 'SL-30-sla-not-reset-on-update-vs-zoho.png', '9 Nov'],
  ['NDC-2826', 'SL-12', 'Medium', 'SLA | Target conditions offer no number or date operators', 'SL-12-sla-no-number-date-operators-vs-zoho.png', '9 Nov'],
  ['NDC-2829', 'Missing list', 'Medium', 'Desk Automation: features Zoho Desk has that Desk is missing (15 gaps)', null, '9 Nov'],
  ['NDC-2832', 'SL-62', 'High', 'Tickets | Countdown Mode does not load: 6 of 7 columns show "Couldn\'t load these tickets"', 'SL-62-countdown-mode-columns-fail-vs-zoho.png', '10 Nov'],
  ['NDC-2833', 'SL-38', 'Medium', 'SLA | When a support plan\'s ticket allowance is used up, the plan\'s SLA still runs', 'SL-38-sla-applied-after-allowance-used-up-vs-zoho.png', '10 Nov'],
  ['NDC-2834', 'SL-57', 'Low', 'SLA | An escalation email template that an SLA uses can be deleted with no warning', 'SL-57-template-used-by-sla-deleted-without-warning-vs-zoho.png', '10 Nov'],
  ['NDC-2835', 'SL-54', 'Low', 'SLA | A "Before due" escalation longer than the target time can be saved', 'SL-54-before-due-escalation-longer-than-target-vs-zoho.png', '10 Nov'],
  ['NDC-2837', 'EM-08', 'Medium', 'Email | Setup says "Mail is arriving" even when customer mail does not reach Desk', 'EM-08-email-overview-says-mail-arriving-vs-customer-mailbox.png', '10 Nov'],
  ['NDC-2838', 'E18-03', 'Low', 'Assignment Rules | Round robin backlog skips an old ticket without saying why', 'E18-03-backlog-skips-old-ticket-without-reason.png', '10 Nov']];
const missingImgs = fs.readdirSync(D + '/evidence/annotated').filter(f => /^\d\d-/.test(f)).sort();

const notFiled = [
  ['F-08', 'Bug (new)', 'Assign on closure: when an agent closes a ticket, the waiting backlog ticket is not given to them. Failed 3 of 4 tries (sequential rule) and 2 of 2 in E2E-2 (skill rule). Passed on 7 Nov.', 'Waiting for your OK to file (needs an annotated image).'],
  ['NDC-2824', 'Open bug', 'Agent threshold counts open tickets from all departments (A3: 10 here, 26 in all → skipped at threshold 12).', 'Already filed; still fails 10 Nov.'],
  ['Owner on create', 'Finding', 'A ticket created through the API with no owner field gets the creator as owner when the creator is an agent of the department, so round robin never runs. On 7 Nov the same call left it unassigned.', 'Compare with NDC-2275 / NDC-2813 before filing.'],
  ['Skill rule, no skills', 'Finding', 'A skill-based rule gives tickets with no skills to any department agent, including agents outside the rule\'s own list (pool A2 → A2, A3, owner). The spec says "any eligible department agent".', 'Check Zoho before filing.'],
  ['Prefs read by agent', 'Finding', 'A Desk Agent can read Round Robin Preferences through the API (200) while the rules API is blocked (403).', 'Minor; decide.'],
  ['I-04', 'Performance', '16 of 20 tickets assigned within 5 s (p95 6.1 s) against a 95% target; staging was slow (7 Nov: < 4 s).', 'Re-measure when staging is calm.'],
  ['SL-51, SL-60', 'Findings', 'Suspending an agent named in an SLA escalation gives no warning; a Dept B support plan can be attached to a Dept A contract.', 'Decide.'],
  ['SL-21', 'Design question', 'Escalations skip recipients who cannot see the ticket (no_access); Zoho sends to the named people.', 'Decide.'],
  ['SL-05, SL-17, NT-23', 'API only', 'Deferred under the API-only rule.', '—'],
  ['NT-07', 'Waiting', 'CC did not get the closed mail? One closed mail seen in Gmail, feed says 2 sent.', 'Need the "to / cc" lines of "#2155 has been closed".']];

const sla = [['Pass', 'ok', 50, 'SL-01–04, 06–11, 13–16, 19, 20, 23–26, 28, 29, 31–37, 39–43, 45, 47–50, 52, 53, 55, 56, 58, 59, 61, 63, 64, 66, 67'],
  ['Bug (filed)', 'bad', 6, 'SL-12 (2826), SL-30 (2825), SL-38 (2833), SL-54 (2835), SL-57 (2834), SL-62 (2832)'],
  ['Finding / recorded', 'warn', 5, 'SL-21, SL-51, SL-60, SL-27, SL-65'], ['Partial', 'warn', 2, 'SL-44, SL-46'],
  ['API only', 'mute', 2, 'SL-05, SL-17'], ['Waiting on Gmail', 'warn', 1, 'SL-22'], ['Blocked', 'mute', 1, 'SL-18 (no inbound mailbox in a QA department)']];
const nt = [['Pass', 'ok', 23, 'NT-01–03, 05, 06, 08–15, 17, 18, 19, 20–22, 24, 25, 27–29 (NT-19 re-tested with round robin 10 Nov; NT-16 no longer reproduces)'],
  ['Bug?', 'warn', 1, 'NT-07 (waits on Gmail)'], ['Recorded / partial', 'warn', 2, 'NT-10, NT-30'], ['Not a bug / API only', 'mute', 2, 'NT-04, NT-23'], ['Inconclusive', 'mute', 1, 'NT-26 (Slack channel not visible)'], ['Dropped', 'mute', 1, 'NT-16 (no longer reproduces)']];

const asg = [
  ['A Rules page and form', 'A-01..A-07, A-09, A-11..A-15 pass (UI and API). A-08 reorder saves (toast not seen). A-10 pass for both switches (user OK; restored).'],
  ['B Criteria', 'All pass: patterns, 25/26 limit, dates, business hours, contact/account fields. B-06 partial: 17 contact fields vs Zoho 26, no "Is Escalated" (excluded gap).'],
  ['C Direct form', 'C-01..C-06 pass; C-07 agent+team stored as agent (info); C-08 hidden half not checked (Team Assignment on everywhere).'],
  ['D Direct runtime', 'D-01..D-12 pass (switch on for the test, restored off). D-13 not run (department member change now 405). D-14 API pass; email, web form, import not run.'],
  ['E Round robin', 'All run pass: sequential, team pool + exclude, alphabetical team order, pool edit restart, offline skipped with history, load, skill holder only, all offline backlog, master off (E-17). E-18 not run (cannot age data).'],
  ['F Preferences', 'F-01..F-07, F-09..F-13 pass. F-08 FAIL (Assign on closure). F-14 = NDC-2824 still fails.'],
  ['G Notifications', 'G-01..G-05 pass (one notice per assignment, team once, self pick-up none, new-ticket alert).'],
  ['H Skills', 'All pass: per department, form, inactive never added, list order, add on update, auto-add off, recalculate, Assign by Skills, 10/ticket and 30/department limits, type rename/delete, name checks.'],
  ['I Non-functional', 'I-01 Arabic RTL, I-03 20 at once (5/5/10, no double), I-05 XSS escaped pass. I-02 partial (Search box has no label). I-04 below target today.'],
  ['J Migration', 'J-01, J-03, J-04 one-time checks (pass 7 Nov). J-02 now shows later config by others.'],
  ['E2E', 'E2E-1 pass (move + round robin, 2 notices each). E2E-2 FAIL at closure step (= F-08). E2E-3 pass (agent back → backlog in 53 s).'],
  ['Bug re-checks', 'NDC-2811, 2812, 2814, 2821 fixed. NDC-2824 still fails. NDC-2813, 2814 Done since 8 Nov.']];

const blocked = [
  ['SL-18', 'SLA restarts on customer reply', 'QA departments have no inbound mailbox; replies go to no-reply.', 'Connect a mailbox to a QA department (or allow testing in Customer Support with its address).'],
  ['D-13', 'Agent removed from department', 'Department member change via API returns 405.', 'Do it on screen in Setup › Departments (QA AS6 Dept A), or OK to use another route.'],
  ['D-14 channels', 'Rule via email / web form / import', 'No inbound mailbox; hosted form link 404 (NDC-1488); import wizard hung on 8 Nov.', 'Mailbox as above; a working form link.'],
  ['E-18', '30-day backlog rule', 'Cannot age a ticket on purpose.', 'Covered by the checklist run (NDC-2838).'],
  ['C-08 hidden half', 'Teams tab hidden when Team Assignment off', 'Every department has Team Assignment on; the screens lane was read-only on it.', 'OK to switch it off briefly in QA AS6 Dept A.'],
  ['Live Zoho', 'SL-30 and [zoho-live] rows', 'Zoho Desk mostly does not load on this network.', 'Working network, or you capture the Zoho screens.']];

const css = `:root{--bg:#f6f7f9;--card:#fff;--text:#1c2230;--muted:#5d6678;--line:#e2e5eb;--ok:#1f8a4c;--ok-bg:#e6f5ec;--warn:#a15c00;--warn-bg:#fff3df;--bad:#b42318;--bad-bg:#fdecea;--mute:#4b5563;--mute-bg:#eceff3}
@media (prefers-color-scheme:dark){:root:not([data-theme="light"]){--bg:#12151b;--card:#1b1f27;--text:#e6e9ef;--muted:#9aa3b2;--line:#2c323d;--ok:#5fd08f;--ok-bg:#173525;--warn:#f0b252;--warn-bg:#3a2c12;--bad:#ff8a7e;--bad-bg:#3d1c1a;--mute:#b6bdc9;--mute-bg:#262b35}}
:root[data-theme="dark"]{--bg:#12151b;--card:#1b1f27;--text:#e6e9ef;--muted:#9aa3b2;--line:#2c323d;--ok:#5fd08f;--ok-bg:#173525;--warn:#f0b252;--warn-bg:#3a2c12;--bad:#ff8a7e;--bad-bg:#3d1c1a;--mute:#b6bdc9;--mute-bg:#262b35}
*{box-sizing:border-box}body{margin:0;background:var(--bg);color:var(--text);font:15px/1.55 system-ui,-apple-system,"Segoe UI",Roboto,sans-serif}
main{max-width:1100px;margin:0 auto;padding:28px 16px 60px}h1{font-size:26px;margin:0 0 4px}h2{font-size:20px;margin:34px 0 12px}
.sub{color:var(--muted);margin:0 0 20px}.tiles{display:grid;grid-template-columns:repeat(auto-fit,minmax(170px,1fr));gap:12px}
.tile{background:var(--card);border:1px solid var(--line);border-radius:10px;padding:14px}.tile b{display:block;font-size:24px}.tile span{color:var(--muted);font-size:13px}
.tw{overflow-x:auto;background:var(--card);border:1px solid var(--line);border-radius:10px}table{width:100%;border-collapse:collapse}
th,td{text-align:left;padding:9px 12px;border-bottom:1px solid var(--line);vertical-align:top}th{font-size:12px;text-transform:uppercase;letter-spacing:.04em;color:var(--muted)}tr:last-child td{border-bottom:0}
.pill{display:inline-block;padding:2px 9px;border-radius:999px;font-size:12px;font-weight:600;white-space:nowrap}.ok{color:var(--ok);background:var(--ok-bg)}.warn{color:var(--warn);background:var(--warn-bg)}.bad{color:var(--bad);background:var(--bad-bg)}.mute{color:var(--mute);background:var(--mute-bg)}
details{margin-top:6px}summary{cursor:pointer;color:var(--muted);font-size:13px}img{width:100%;height:auto;border:1px solid var(--line);border-radius:8px;margin-top:8px}
.grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(300px,1fr));gap:10px}.muted{color:var(--muted)}code{font-size:13px;background:var(--mute-bg);padding:1px 5px;border-radius:4px}`;
const table = (head, rows) => `<div class="tw"><table><tr>${head.map(h => `<th>${h}</th>`).join('')}</tr>${rows.join('')}</table></div>`;
const html = `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Desk Automation Run</title><style>${css}</style></head><body><main>
<h1>Desk automation order: run report</h1>
<p class="sub">TAVI Desk vs Zoho Desk on NDC-Staging, 8–10 Nov 2026. Status as of 10 Nov 2026, 11:30 UTC. Local report; nothing published.</p>
<div class="tiles">
<div class="tile"><b>5 of 8</b><span>Part A features done (SLA, Notifications, Skills, Direct, Round robin)</span></div>
<div class="tile"><b>~212</b><span>cases run (SLA 67, Notifications 30, assignment ~115)</span></div>
<div class="tile"><b>9</b><span>Plane items filed (8 bugs + missing list)</span></div>
<div class="tile"><b>0 of 2</b><span>Part B (pairs) and Part C (whole order) started</span></div></div>

<h2>Plan status</h2>
${table(['Part', 'Feature', 'Status', 'Notes'], plan.map(p => `<tr><td>${p[0]}</td><td>${esc(p[1])}</td><td>${pill(...ST[p[2]])}</td><td>${esc(p[3])}</td></tr>`))}

<h2>Filed in Plane (9)</h2>
${table(['Ticket', 'Case', 'Priority', 'Title', 'Filed'], filed.map(f => `<tr><td><b>${f[0]}</b></td><td>${f[1]}</td><td>${pill(f[2], f[2] === 'High' ? 'bad' : f[2] === 'Medium' ? 'warn' : 'mute')}</td><td>${esc(f[3])}${f[4] ? `<details><summary>Annotated evidence</summary><img loading="lazy" src="evidence/annotated/${f[4]}" alt="${f[1]} evidence"></details>` : `<details><summary>15 annotated images</summary><div class="grid">${missingImgs.map(m => `<img loading="lazy" src="evidence/annotated/${m}" alt="${m}">`).join('')}</div></details>`}</td><td>${f[5]}</td></tr>`))}
<p class="muted">Not re-filed: NDC-2811..2814, 2821, 2824 (assignment bugs from 7–8 Nov). EM-08 and E18-03 came from the email / 30-day checklist run.</p>

<h2>Open: not filed, findings, decisions</h2>
${table(['Item', 'Type', 'What', 'Next'], notFiled.map(n => `<tr><td><b>${esc(n[0])}</b></td><td>${pill(n[1], /Bug/.test(n[1]) ? 'bad' : /Finding|Design|Waiting|Perf/.test(n[1]) ? 'warn' : 'mute')}</td><td>${esc(n[2])}</td><td>${esc(n[3])}</td></tr>`))}

<h2>A5 SLA (67 cases)</h2>
${table(['Result', 'Count', 'Cases'], sla.map(r => `<tr><td>${pill(r[0], r[1])}</td><td>${r[2]}</td><td>${esc(r[3])}</td></tr>`))}

<h2>A7 Notifications (30 cases)</h2>
${table(['Result', 'Count', 'Cases'], nt.map(r => `<tr><td>${pill(r[0], r[1])}</td><td>${r[2]}</td><td>${esc(r[3])}</td></tr>`))}

<h2>A1–A3 Skills, Direct assignment, Round robin (spec v2, 10 Nov)</h2>
<p class="muted">Two lanes in parallel: runtime/API in QA AS6 Dept A (agents kept online by a presence keeper) and screens in QA AO Dept B. Six rows moved to Parts B/C (D-15–17, E-15, G-06, H-12).</p>
${table(['Group', 'Result'], asg.map(a => `<tr><td><b>${esc(a[0])}</b></td><td>${esc(a[1])}</td></tr>`))}

<h2>Blocked or not run, and what unblocks them</h2>
${table(['Case', 'What', 'Why', 'To start it'], blocked.map(b => `<tr><td><b>${esc(b[0])}</b></td><td>${esc(b[1])}</td><td>${esc(b[2])}</td><td>${esc(b[3])}</td></tr>`))}
<p class="muted">Email checklist blocked cases (EM-01/02/04/05/06/09, E18-04) are listed with steps in <code>report-email-e18-bugs-blocked.html</code>; you are checking those.</p>

<h2>Tenant state</h2>
<div class="tw" style="padding:12px 16px"><ul style="margin:0;padding-left:20px">
<li>Switches: Direct rules OFF (as found), Round robin ON, assignment notices ON — all read back after each test.</li>
<li>QA AS6 Dept A: round-robin preferences, Team Assignment, new-ticket alert, borrowed skills, skill order and skill preferences restored.</li>
<li>Deleted today: 53 + 9 + 3 assignment rules, ~215 tickets, contacts/accounts, SL-20/SL-40 kept data, holiday list. One ticket delete returned 401 mid-run; a sweep found none left.</li>
<li>Left on purpose: QA AO Dept A/B and QA AS6 Dept A/B (in use); 19 stuck QA AO tickets in Dept A (owner can delete); #2382 kept for EM-05.</li></ul></div>

<h2>Next</h2>
<div class="tw" style="padding:12px 16px"><ol style="margin:0;padding-left:20px">
<li>File F-08 (your OK).</li><li>A4 Workflow → A6 Blueprint → A8 Macros.</li><li>Part B pairs, Part C whole order, live Zoho rows, final report.</li></ol></div>
<p class="muted" style="margin-top:24px">Sources: PROGRESS.md, ledger.md, plane-filed-*.json in executions/execu_2026-11-08_desk-automation-order.</p>
</main></body></html>`;
fs.writeFileSync(D + '/report-run-2026-11-10.html', html); console.log('ok', html.length);
