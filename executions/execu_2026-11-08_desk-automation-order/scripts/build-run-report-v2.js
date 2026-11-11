// Builds report-run-2026-11-10-v2.html: whole Desk automation-order run (8–10 Nov 2026), incl. afternoon of 10 Nov
// (NT-07, NDC-2839, NDC-2841, D-13, live Zoho lane, full blocked/skipped list). Local file; images by relative path.
const fs = require('fs'); const D = __dirname + '/..';
const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;');
const pill = (t, c) => `<span class="pill ${c}">${esc(t)}</span>`;
const ST = { done: ['Done', 'ok'], part: ['Partial', 'warn'], no: ['Not started', 'mute'], filed: ['Filed', 'ok'] };
const cls = t => /Bug|Blocked|differs|FAIL/i.test(t) ? 'bad' : /Partial|Waiting|Open|Re-check|Below|Inconclusive|Finding/i.test(t) ? 'warn' : /Pass|Done|Not a bug/i.test(t) ? 'ok' : 'mute';

const plan = [
  ['A5', 'SLA (SL-01..SL-67)', 'done', '66 of 67 run; SL-18 blocked (no receiving mailbox in a QA department).'],
  ['A7', 'Notifications (NT-01..NT-30)', 'done', 'All 30 run; NT-07 confirmed PASS by your Gmail check (10 Nov).'],
  ['A1–A3', 'Skills, Direct assignment, Round robin (spec v2)', 'done', '~115 cases; D-13 now PASS. Open: C-08 screen half, I-04, one F-08 re-run (queued for a calm staging).'],
  ['A4', 'Workflow', 'no', 'Next. Includes re-check of B-1..B-9 and the 50-rule list cap.'],
  ['A6', 'Blueprint', 'no', 'Current state only for NDC-2755..2788.'],
  ['A8', 'Macros', 'no', ''],
  ['B', 'Pairs (OR-01..OR-35)', 'no', 'Some rows need live Zoho.'],
  ['C', 'Whole order (OR-22..27, E2E-1..4)', 'no', '100-ticket timing and real-mail journeys.'],
  ['Z', 'Missing list vs Zoho', 'filed', 'NDC-2829: 15 gaps with images; 5 items need live Zoho (Zoho Setup failed 10 Nov).'],
  ['—', 'Live Zoho comparisons', 'part', '10 Nov: SL-60 and owner-on-create done live; skill rule, SL-21, SL-30 not run (Zoho Setup pages failed).'],
  ['V', 'Visual checks', 'part', 'SLA, notifications, assignment and Skills screens in English, Arabic, 390 px: no real defects. sla-list-ar retake pending; no dark theme.']];

const filed = [
  ['NDC-2825', 'SL-30', 'High', 'SLA | Updating a ticket does not restart an SLA that is set to run on Ticket Update', 'SL-30-sla-not-reset-on-update-vs-zoho.png', '9 Nov'],
  ['NDC-2826', 'SL-12', 'Medium', 'SLA | Target conditions offer no number or date operators', 'SL-12-sla-no-number-date-operators-vs-zoho.png', '9 Nov'],
  ['NDC-2829', 'Missing list', 'Medium', 'Desk Automation: features Zoho Desk has that Desk is missing (15 gaps)', null, '9 Nov'],
  ['NDC-2832', 'SL-62', 'High', 'Tickets | Countdown Mode does not load: 6 of 7 columns show "Couldn\'t load these tickets"', 'SL-62-countdown-mode-columns-fail-vs-zoho.png', '10 Nov'],
  ['NDC-2833', 'SL-38', 'Medium', 'SLA | When a support plan\'s ticket allowance is used up, the plan\'s SLA still runs', 'SL-38-sla-applied-after-allowance-used-up-vs-zoho.png', '10 Nov'],
  ['NDC-2834', 'SL-57', 'Low', 'SLA | An escalation email template that an SLA uses can be deleted with no warning', 'SL-57-template-used-by-sla-deleted-without-warning-vs-zoho.png', '10 Nov'],
  ['NDC-2835', 'SL-54', 'Low', 'SLA | A "Before due" escalation longer than the target time can be saved', 'SL-54-before-due-escalation-longer-than-target-vs-zoho.png', '10 Nov'],
  ['NDC-2837', 'EM-08', 'Medium', 'Email | Setup says "Mail is arriving" even when customer mail does not reach Desk', 'EM-08-email-overview-says-mail-arriving-vs-customer-mailbox.png', '10 Nov'],
  ['NDC-2838', 'E18-03', 'Low', 'Assignment Rules | Round robin backlog skips an old ticket without saying why', 'E18-03-backlog-skips-old-ticket-without-reason.png', '10 Nov'],
  ['NDC-2839', 'A-15 finding', 'Low', 'Assignment Rules | An agent without the assignment permission can still read Round Robin Preferences and Team Assignment', 'AG-prefs-agent-can-read-rr-preferences.png', '10 Nov'],
  ['NDC-2841', 'SL-60', 'Medium', 'SLA | A contract in one department can use a support plan (and its SLA) from another department', 'SL-60-contract-takes-plan-from-another-department-vs-zoho.png', '10 Nov']];
const missingImgs = fs.readdirSync(D + '/evidence/annotated').filter(f => /^\d\d-/.test(f)).sort();

const decisions = [
  ['Owner on create', 'Zoho differs', 'Live Zoho: a ticket created with no owner stays unassigned (#116). TAVI makes the creating agent the owner, so round robin never runs. Both apps\' Add Ticket form pre-fills the signed-in agent.', 'File as a bug? (your OK)'],
  ['F-08 Assign on closure', 'Re-check', 'Zoho: the backlog ticket goes to the closed ticket\'s owner if online and under threshold. TAVI passed both variants at 12:00 UTC (3–4 s); failed 3/4 + E2E-2 earlier while staging was unstable.', 'One more run when staging is calm (queued); not filed.'],
  ['SL-60', 'Filed', 'Zoho (live): contract created inside its department, plan picker lists only that department\'s plans. TAVI accepts another department\'s plan.', 'NDC-2841'],
  ['SL-51', 'Not a bug', 'Zoho deactivation asks only to reassign open tickets/activities, no warning about escalations — same as TAVI. Zoho delete replaces the agent in "whom to escalate"; TAVI delete not tested.', 'Test delete with a throwaway agent? (your OK)'],
  ['SL-21', 'Open', 'Escalation skips recipients who cannot see the ticket. Zoho docs silent; live check failed (Zoho Setup).', 'Retry live Zoho'],
  ['Skill rule, no skills', 'Open', 'No-skill tickets go to any department agent, even outside the rule\'s list. Zoho docs silent; live check failed.', 'Retry live Zoho'],
  ['NT-07', 'Pass', 'Closed mail is one email: To contact, Cc the CC (your Gmail shows "to me, …+qaao"). Side notes: agent addresses refused as CC; if the contact address bounces the CC copy is lost too.', '—'],
  ['NDC-2824', 'Set aside', 'Threshold counts all departments.', 'Your instruction'],
  ['I-04', 'Below target', '16/20 assigned within 5 s while staging was slow.', 'Re-measure when calm (queued)']];

const blocked = [
  ['SLA', 'SL-18', 'Blocked', 'SLA restart on a customer reply needs a real incoming reply; QA departments have no receiving mailbox (Zoho too needs a receiving address per department).', 'A receiving address on a QA department'],
  ['SLA', 'SL-22', 'Waiting', 'Escalation mails (custom then default template) sent; delivery not confirmed.', 'Check Gmail for SL22pczr'],
  ['SLA', 'SL-21', 'Open', 'Recipients without access are skipped; Zoho behaviour unknown.', 'Live Zoho retry'],
  ['SLA', 'SL-30 (NDC-2825)', 'Zoho unconfirmed', 'Filed from docs; live Zoho test not run (Setup failed).', 'Live Zoho retry'],
  ['SLA', 'SL-44', 'Partial', 'Custom views have no "Is overdue" / "Is response overdue".', 'Decide if a gap'],
  ['SLA', 'SL-46', 'Partial', 'SLA dashboard loads; no SLA data in Customer Support to compare numbers.', 'Real data, or accept'],
  ['SLA', 'SL-05, SL-17', 'Skipped', 'API-only (your rule).', '—'],
  ['SLA', 'SL-27, SL-65', 'Recorded only', 'Neither Zoho nor the spec decides the expected result.', 'Your call'],
  ['SLA', 'SL-51 delete case', 'Not run', 'Deleting an agent named in an escalation not tested (deleting real users is risky).', 'Your OK with a throwaway agent'],
  ['SLA', 'SL-07, 36, 37, 39, 43', 'Partial coverage', 'One scope each (comment scope only; dialog only; valid contract only; views on screen only).', 'Accept or extend'],
  ['Notifications', 'NT-26', 'Inconclusive', 'Slack, Teams, Google Chat listed; the Slack channel is not visible to me.', 'Someone checks the Slack channel'],
  ['Notifications', 'NT-10 (rating half)', 'Not run', 'Needs a real customer happiness rating.', 'Rate a ticket from Gmail'],
  ['Notifications', 'NT-30', 'Partial', 'Assign to a suspended agent refused, but that agent was not in the department anyway.', 'Suspend an in-department agent (your OK)'],
  ['Notifications', 'NT-05', 'Partial', 'Received and reply events need incoming mail.', 'Mailbox as SL-18'],
  ['Notifications', 'NT-06', 'Partial', 'Comment edit not tested (PATCH 405).', '—'],
  ['Notifications', 'NT-01, 08, 11, 12, 20, 25', 'Partial coverage', 'One event or recipient each.', 'Accept or extend'],
  ['Notifications', 'NT-04, NT-23', 'Not a bug / API-only', '—', '—'],
  ['Notifications', 'Gmail checks', 'Waiting', 'NT24ax8yl, NT24bx8yl, SL57pczr delivery not confirmed.', 'Check Gmail'],
  ['Assignment', 'C-08 (screen half)', 'Blocked today', 'New-rule panel stuck on "Loading assignment settings…"; API half PASS.', 'Retry when staging is fast (queued)'],
  ['Assignment', 'I-04', 'Below target', '16/20 within 5 s (p95 6.1 s) on slow staging.', 'Re-measure (queued)'],
  ['Assignment', 'F-08', 'Re-check', 'Intermittent under load; passes now.', 'One more run (queued)'],
  ['Assignment', 'D-14 channels', 'Blocked', 'Email: no receiving mailbox. Web form: hosted link 404 (NDC-1488). Import with rules: wizard hung 8 Nov, not retried.', 'Mailbox; working form link; import retry'],
  ['Assignment', 'E-18', 'Not run', 'A ticket cannot be aged 30 days on purpose (covered by NDC-2838).', '—'],
  ['Assignment', 'A-06 (screen)', 'Not re-run', 'Passed 6 Nov; API passes today.', '—'],
  ['Assignment', 'A-08', 'Partial', 'Reorder saves and survives reload; "Order saved." toast not seen.', '—'],
  ['Assignment', 'B-06', 'Partial', '17 contact fields vs Zoho 26, no "Is Escalated" (gap you excluded).', '—'],
  ['Assignment', 'I-02', 'Partial', 'Sidebar Search box has no label; screen-reader announcements not checked.', '—'],
  ['Assignment', 'E-03', 'Partial', 'Compared with Zoho help pages only.', 'Live Zoho'],
  ['Assignment', 'J-01, J-03, J-04', 'Not repeatable', 'One-time migration checks (PASS 7 Nov).', '—'],
  ['Assignment', 'D-15–17, E-15, G-06, H-12', 'Moved', 'Belong to Parts B / C.', '—'],
  ['Email checklist', 'EM-01, 02, 04, 05, 06, 09, E18-04', 'You are checking', 'Need a real customer mailbox (send, reply or look inside).', 'Steps in report-email-e18-bugs-blocked.html'],
  ['Other', 'Visual', 'Partial', 'sla-list-ar retake; a few captures unreviewed; no dark theme.', '—'],
  ['Other', '19 stuck QA AO tickets (Dept A)', 'Cleanup', 'Admin cannot delete them; owner can.', 'Your OK to delete']];

const sla = [['Pass', 'ok', 50, 'SL-01–04, 06–11, 13–16, 19, 20, 23–26, 28, 29, 31–37, 39–43, 45, 47–50, 52, 53, 55, 56, 58, 59, 61, 63, 64, 66, 67'],
  ['Bug (filed)', 'bad', 7, 'SL-12 (2826), SL-30 (2825), SL-38 (2833), SL-54 (2835), SL-57 (2834), SL-60 (2841), SL-62 (2832)'],
  ['Finding / recorded', 'warn', 4, 'SL-21, SL-27, SL-51 (not a bug vs Zoho), SL-65'], ['Partial', 'warn', 2, 'SL-44, SL-46'],
  ['API only', 'mute', 2, 'SL-05, SL-17'], ['Waiting on Gmail', 'warn', 1, 'SL-22'], ['Blocked', 'bad', 1, 'SL-18']];
const nt = [['Pass', 'ok', 24, 'NT-01–03, 05–15, 17–22, 24, 25, 27–29 (NT-07 confirmed 10 Nov; NT-19 re-tested with round robin)'],
  ['Recorded / partial', 'warn', 2, 'NT-10, NT-30'], ['Not a bug / API only', 'mute', 2, 'NT-04, NT-23'], ['Inconclusive', 'warn', 1, 'NT-26'], ['Dropped', 'mute', 1, 'NT-16 (no longer reproduces)']];
const asg = [
  ['A Rules page and form', 'A-01..A-07, A-09, A-10 (both switches), A-11..A-15 pass. A-08 toast not seen.'],
  ['B Criteria', 'All pass. B-06 partial (excluded gap).'],
  ['C Direct form', 'C-01..C-06 pass; C-07 info; C-08 API half pass, screen half blocked today.'],
  ['D Direct runtime', 'D-01..D-13 pass (D-13 on 10 Nov via the department agents API). D-14 API pass; email / web form / import blocked.'],
  ['E Round robin', 'All run pass incl. E-17 (switch off then on). E-18 not run.'],
  ['F Preferences', 'All pass incl. F-08 at 12:00 UTC (one more run queued). F-14 = NDC-2824 (set aside).'],
  ['G Notifications', 'G-01..G-05 pass.'],
  ['H Skills', 'All pass.'],
  ['I Non-functional', 'I-01, I-03, I-05 pass; I-02 partial; I-04 below target on slow staging.'],
  ['J Migration', 'One-time checks (pass 7 Nov).'],
  ['E2E', 'E2E-1, E2E-3 pass; E2E-2 closure step = F-08 (passes now).'],
  ['Bug re-checks', 'NDC-2811, 2812, 2814, 2821 fixed; NDC-2824 still fails (set aside).']];

const css = `:root{--bg:#f6f7f9;--card:#fff;--text:#1c2230;--muted:#5d6678;--line:#e2e5eb;--ok:#1f8a4c;--ok-bg:#e6f5ec;--warn:#a15c00;--warn-bg:#fff3df;--bad:#b42318;--bad-bg:#fdecea;--mute:#4b5563;--mute-bg:#eceff3}
@media (prefers-color-scheme:dark){:root:not([data-theme="light"]){--bg:#12151b;--card:#1b1f27;--text:#e6e9ef;--muted:#9aa3b2;--line:#2c323d;--ok:#5fd08f;--ok-bg:#173525;--warn:#f0b252;--warn-bg:#3a2c12;--bad:#ff8a7e;--bad-bg:#3d1c1a;--mute:#b6bdc9;--mute-bg:#262b35}}
:root[data-theme="dark"]{--bg:#12151b;--card:#1b1f27;--text:#e6e9ef;--muted:#9aa3b2;--line:#2c323d;--ok:#5fd08f;--ok-bg:#173525;--warn:#f0b252;--warn-bg:#3a2c12;--bad:#ff8a7e;--bad-bg:#3d1c1a;--mute:#b6bdc9;--mute-bg:#262b35}
*{box-sizing:border-box}body{margin:0;background:var(--bg);color:var(--text);font:15px/1.55 system-ui,-apple-system,"Segoe UI",Roboto,sans-serif}
main{max-width:1150px;margin:0 auto;padding:28px 16px 60px}h1{font-size:26px;margin:0 0 4px}h2{font-size:20px;margin:34px 0 12px}
.sub{color:var(--muted);margin:0 0 20px}.tiles{display:grid;grid-template-columns:repeat(auto-fit,minmax(170px,1fr));gap:12px}
.tile{background:var(--card);border:1px solid var(--line);border-radius:10px;padding:14px}.tile b{display:block;font-size:24px}.tile span{color:var(--muted);font-size:13px}
.tw{overflow-x:auto;background:var(--card);border:1px solid var(--line);border-radius:10px}table{width:100%;border-collapse:collapse}
th,td{text-align:left;padding:9px 12px;border-bottom:1px solid var(--line);vertical-align:top}th{font-size:12px;text-transform:uppercase;letter-spacing:.04em;color:var(--muted)}tr:last-child td{border-bottom:0}
.pill{display:inline-block;padding:2px 9px;border-radius:999px;font-size:12px;font-weight:600;white-space:nowrap}.ok{color:var(--ok);background:var(--ok-bg)}.warn{color:var(--warn);background:var(--warn-bg)}.bad{color:var(--bad);background:var(--bad-bg)}.mute{color:var(--mute);background:var(--mute-bg)}
details{margin-top:6px}summary{cursor:pointer;color:var(--muted);font-size:13px}img{width:100%;height:auto;border:1px solid var(--line);border-radius:8px;margin-top:8px}
.grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(300px,1fr));gap:10px}.muted{color:var(--muted)}code{font-size:13px;background:var(--mute-bg);padding:1px 5px;border-radius:4px}
.box{background:var(--card);border:1px solid var(--line);border-radius:10px;padding:12px 16px}`;
const table = (head, rows) => `<div class="tw"><table><tr>${head.map(h => `<th>${h}</th>`).join('')}</tr>${rows.join('')}</table></div>`;
const html = `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Desk Automation Run</title><style>${css}</style></head><body><main>
<h1>Desk automation order: run report</h1>
<p class="sub">TAVI Desk vs Zoho Desk on NDC-Staging, 8–10 Nov 2026. Status as of 10 Nov 2026, afternoon. Local report; nothing published.</p>
<div class="tiles">
<div class="tile"><b>5 of 8</b><span>Part A features done (SLA, Notifications, Skills, Direct, Round robin)</span></div>
<div class="tile"><b>~212</b><span>cases run (SLA 67, Notifications 30, assignment ~115)</span></div>
<div class="tile"><b>11</b><span>Plane items filed (10 bugs + missing list)</span></div>
<div class="tile"><b>33</b><span>blocked / skipped / partial rows listed for your review</span></div>
<div class="tile"><b>0 of 2</b><span>Part B and Part C started</span></div></div>

<h2>Plan status</h2>
${table(['Part', 'Feature', 'Status', 'Notes'], plan.map(p => `<tr><td>${p[0]}</td><td>${esc(p[1])}</td><td>${pill(...ST[p[2]])}</td><td>${esc(p[3])}</td></tr>`))}

<h2>Needs your decision</h2>
<div class="box"><ol style="margin:0;padding-left:20px">
<li>File "owner on create" as a bug (Zoho leaves the ticket unassigned)?</li>
<li>Test SL-51's delete case with a throwaway agent?</li>
<li>Delete the 19 stuck QA AO tickets with the owner account?</li>
<li>Gmail checks: SL22pczr, NT24ax8yl, NT24bx8yl, SL57pczr.</li></ol></div>

<h2>Filed in Plane (11)</h2>
${table(['Ticket', 'Case', 'Priority', 'Title', 'Filed'], filed.map(f => `<tr><td><b>${f[0]}</b></td><td>${f[1]}</td><td>${pill(f[2], f[2] === 'High' ? 'bad' : f[2] === 'Medium' ? 'warn' : 'mute')}</td><td>${esc(f[3])}${f[4] ? `<details><summary>Annotated evidence</summary><img loading="lazy" src="evidence/annotated/${f[4]}" alt="${f[1]} evidence"></details>` : `<details><summary>15 annotated images</summary><div class="grid">${missingImgs.map(m => `<img loading="lazy" src="evidence/annotated/${m}" alt="${m}">`).join('')}</div></details>`}</td><td>${f[5]}</td></tr>`))}
<p class="muted">All: Bug state, NDC-2811 assignees, module Desk, Sprint 15, image attached. Earlier assignment bugs NDC-2811..2814, 2821, 2824 not re-filed.</p>

<h2>Zoho comparisons and findings</h2>
${table(['Item', 'Result', 'What', 'Next'], decisions.map(n => `<tr><td><b>${esc(n[0])}</b></td><td>${pill(n[1], cls(n[1]))}</td><td>${esc(n[2])}</td><td>${esc(n[3])}</td></tr>`))}
<p class="muted">Live Zoho (techsolutionsegypt, your OK): one ticket + contact created and purged; Setup pages (Assignment Rules, SLA, Skills, Round Robin) failed to load all afternoon, so the skill rule, SL-21 and SL-30 tests did not run. Zoho is clean.</p>

<h2>Blocked, skipped and partial — for your review</h2>
${table(['Area', 'Case', 'Status', 'Reason', 'To unblock'], blocked.map(b => `<tr><td>${esc(b[0])}</td><td><b>${esc(b[1])}</b></td><td>${pill(b[2], cls(b[2]))}</td><td>${esc(b[3])}</td><td>${esc(b[4])}</td></tr>`))}

<h2>A5 SLA (67 cases)</h2>
${table(['Result', 'Count', 'Cases'], sla.map(r => `<tr><td>${pill(r[0], r[1])}</td><td>${r[2]}</td><td>${esc(r[3])}</td></tr>`))}
<h2>A7 Notifications (30 cases)</h2>
${table(['Result', 'Count', 'Cases'], nt.map(r => `<tr><td>${pill(r[0], r[1])}</td><td>${r[2]}</td><td>${esc(r[3])}</td></tr>`))}
<h2>A1–A3 Skills, Direct assignment, Round robin</h2>
${table(['Group', 'Result'], asg.map(a => `<tr><td><b>${esc(a[0])}</b></td><td>${esc(a[1])}</td></tr>`))}

<h2>Tenant state</h2>
<div class="box"><ul style="margin:0;padding-left:20px">
<li>Switches read back: Direct rules OFF (as found), Round robin ON, assignment notices ON.</li>
<li>QA AS6 Dept A: preferences at defaults, Team Assignment on, A3 member again, new-ticket alert off, borrowed skills restored.</li>
<li>Deleted today: all QA AO rules, ~230 tickets, contacts/accounts, SL-20/SL-40/SL-60 data, NT-07 tickets.</li>
<li>Left on purpose: QA AO Dept A/B and QA AS6 Dept A/B; 19 stuck QA AO tickets (Dept A); #2382 kept for EM-05.</li></ul></div>

<h2>Next</h2>
<div class="box"><ol style="margin:0;padding-left:20px">
<li>When staging is calm: I-04, F-08 once more, C-08 screen half (watcher running).</li>
<li>Your decisions above.</li><li>A4 Workflow → A6 Blueprint → A8 Macros → Part B → Part C → live Zoho retries → final report.</li></ol></div>
<p class="muted" style="margin-top:24px">Sources: PROGRESS.md, ledger.md, plane-filed-*.json in executions/execu_2026-11-08_desk-automation-order.</p>
</main></body></html>`;
fs.writeFileSync(D + '/report-run-2026-11-10-v2.html', html); console.log('ok', html.length);
