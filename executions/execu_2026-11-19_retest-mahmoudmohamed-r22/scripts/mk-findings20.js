// node mk-findings20.js → ../new-findings-r20.html : new findings from retest round 20 / 20b (17 Nov 2026), not filed as their own tickets.
const fs = require('fs'), path = require('path');
const RUN = path.join(__dirname, '..');
const css = fs.readFileSync(path.join(RUN, '../execu_2026-11-16_retest-mahmoudmohamed-r19/scripts/mk-review.js'), 'utf8').match(/const css = `([\s\S]*?)`;/)[1];
const esc = s => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const img = f => fs.existsSync(path.join(RUN, 'screenshots/annotated', f)) ? `<a href="screenshots/annotated/${esc(f)}" target="_blank"><img loading="lazy" src="screenshots/annotated/${esc(f)}" alt="${esc(f)}"></a>` : '';
const sevC = s => s.startsWith('High') ? 'FAIL' : s.startsWith('Medium') ? 'PARTIAL' : s.startsWith('Low') ? 'INFO' : 'DECISION';
// [sev, title, module, from, steps, expected, actual, zoho, status, evidence]
const F = [
 ['High', 'Staging | Incoming email, ticket history, round-robin assignment and ticket numbers stopped (background processing)', 'Desk (environment)', 'all lanes; verified by the lead',
  ['Send an email to any department\'s support address (e.g. qa-rt19-ntf@help-staging…).', 'Create a ticket and change its status to Closed.', 'Create a ticket that matches an active round-robin rule.'],
  'A ticket is created from the email; History logs the status change; Closed Time and Resolution Time are set; round robin assigns an owner; a ticket number is given within seconds.',
  'No email has created a ticket since 16 Nov 15:44 UTC (3 test emails 17 Nov: 07:58, ~08:16, 11:37 UTC). Tickets changed on 17 Nov have no history except "department set"; closed_time/resolution_time stay empty; desk status stays Open after a blueprint run while the record says Closed (#4807). Round robin assigned nothing 09:38–10:15 UTC (13 tickets). At 11:30 UTC a new ticket had no number after 2 min (numbers back by 11:38). A developer restarted the owner-write service this morning (NDC-2997 comment); the rest still looked down at 11:38 UTC.',
  '—', 'Not filed. Blocks NDC-2275, NDC-3000 (BLOCKED comment posted), NDC-3068.', ['NDC-3000-retest-BLOCKED.png', 'NDC-2275-retest-FAIL.png', 'NDC-3068-retest-PARTIAL.png']],
 ['Medium', 'Workflow Rules | Owner Assignment re-fires its own On Edit rule after the background owner write and reassigns the ticket', 'Desk', 'NDC-2997',
  ['Create an On Edit workflow rule with Owner Assignment → by role, round robin (2 agents).', 'Edit 4 tickets so the rule fires and the owner is set by the background worker.', 'Open each ticket\'s owner and the rule\'s Execution History.'],
  'One run per edit; tickets alternate between the 2 agents; the owner the run reports is the ticket\'s owner.',
  'The background owner write counts as an edit, so the same rule runs again (run 2 is chained to run 1) and reassigns. Final owners Dev Team 2, Dev Team 2, Test User 1, Test User 1 (another run: DT2, TU1, TU1, TU1). Run 1 says "assigned Test User 1", ticket ends with Dev Team 2.',
  'Zoho does not re-run a rule on its own field update.', 'Included as the still-failing item of NDC-2997 (moved to Bug). Own ticket optional.', ['NDC-2997-retest-PARTIAL.png']],
 ['Medium', 'Workflow Rules | Add Tags picker offers and applies other departments\' tags', 'Desk', 'NDC-3058',
  ['Create a rule limited to QA AO Dept A with Add Tags.', 'Open the tag box.', 'Pick "QA WF tag A", save, edit a QA AO Dept A ticket.'],
  'Only the department\'s tags (the developers\' own reason: tags belong to a department), with department names if several are shown.',
  'Every department\'s tags, same names 3 times, no department label; the first "QA WF tag A" belonged to Customer Support and was put on a QA AO Dept A ticket (#4885). Execution History shows no Add Tags action row.',
  'Zoho Desk tags are per department.', 'Included in NDC-3058\'s Bug comment. Own ticket optional.', ['NDC-3058-retest-FAIL.png']],
 ['Medium', 'Blueprint | An agent loses access to another person\'s ticket right after running its transition', 'Desk', 'NDC-3065',
  ['As a normal agent who can only read a ticket owned by someone else (#4808), open it.', 'Run the offered transition.', 'Reload the ticket.'],
  'The agent keeps the same access as before the run.',
  'Right after the run: "This ticket is not available" + Permission denied. Older tickets #4181/#4182 also 404 for the agent. Access seems to depend on owning a transition that can run.',
  'Not checked.', 'Included in NDC-3065\'s Bug comment.', ['NDC-3065-retest-PARTIAL.png']],
 ['Medium/Low', 'CRM Reports | Reports keep the old Score after a background rescore', 'CRM', 'NDC-1483',
  ['Leads report with Last Name + Score.', 'Change a scoring rule with "Also score the records already there" (background rescore).', 'Open the report again 20+ min later.'],
  'The report shows the current score.',
  'Old scores stay (lead A 37 vs real 33, lead N −4 vs real 0); right again only after the lead is saved. List view and record API are correct.',
  'Zoho reports show the current score.', 'Listed in the comment on NDC-2934 (Scoring gaps). Own ticket not filed.', ['NDC-1483-retest-PARTIAL.png']],
 ['Low', 'Contracts | Changing only the department keeps the other department\'s plan and silently drops coverage', 'Desk', 'NDC-2841',
  ['Contract in Dept A with a Dept A support plan.', 'Change only its Department to Dept B and save.'],
  'Refused, or the plan is cleared with a message.',
  '200: the contract becomes Dept B, keeps the Dept A plan in its field, and silently has no plan coverage.',
  'Being checked live in Zoho Desk now.', 'Not filed; NDC-2841 is held in Ready For Test until the Zoho check returns.', ['NDC-2841-retest-DECISION.png']],
 ['Low', 'Departments | Disabling a department with a transfer target moves its tickets to the default department instead', 'Desk', 'NDC-3027 lane',
  ['Disable a department and choose another department to receive its tickets (transfer_to_department_id).', 'Open the moved ticket.'],
  'Tickets move to the chosen department.',
  'The ticket moved to Customer Support (the default department), not the chosen QA RT20 BP Dept. Needs confirming in the screen.',
  'Zoho moves tickets to the chosen department.', 'Not filed (needs a confirming run).', []],
 ['Low', 'Tickets | Mark as Spam does not warn that sharing will be revoked; wrong wording and leftover custom action on spam tickets', 'Desk', 'NDC-3073',
  ['Share a ticket with another department.', 'Mark it as spam.', 'Try to re-share it; open the Actions button.'],
  'The dialog warns that sharing will be revoked; a refused re-share says why; no custom actions on a spam ticket.',
  'No warning in the dialog; re-share refusal says "…not able to add conversation"; Actions still lists a custom action.',
  'Zoho\'s spam dialog warns about removing shares.', 'Not filed.', ['NDC-3073-retest-PASS.png']],
 ['Low', 'Blueprint | A huge time limit gives a schema error toast; fractions and negatives change silently', 'Desk', 'NDC-3063',
  ['In a blueprint state set Due after = 99,999,999 Days; save.', 'Try 0.5 Minutes, a 0.25-minute warning, −5.'],
  'A field-level message for out-of-range or invalid values.',
  'Toast "Blueprint definition does not match the expected schema." (422, slaMinutes), no field highlighted, values revert; 0.5 min → 1, 0.25-min warning dropped, −5 → "No limit", all silently.',
  '—', 'Not filed (noted on NDC-3063 as info).', ['NDC-3063-retest-PASS.png']],
 ['Low', 'Records API | Some malformed field values report a vague error path', 'Desk', 'NDC-3071',
  ['POST a record with a field value of unknown kind, kind null, or a kind that does not match the value.'],
  'Error path data[i].value, as for a missing kind.',
  'Path "", "kind" or "value" instead of data[0].value (on 16 Nov an unknown kind still gave data[0].value).',
  '—', 'Not filed.', ['NDC-3071-retest-PASS.png']],
 ['Low', 'Contracts | Form help text repeats words; plan error stays after the right plan is picked', 'Desk', 'NDC-2841',
  ['New Contract with Sales as default department; read the plan help text.', 'Save with a wrong-department plan, then pick the right plan.'],
  'Clear help text; the error clears when the plan is corrected; the wrong plan is not shown ticked.',
  'Help text "Plans of the contract\'s department, the contract\'s department" (Arabic same); the server error stays under Support Plan until the next save; the wrong plan stays ticked in the list.',
  '—', 'Not filed.', []],
 ['Low', 'Ticket Views | Sidebar view count stays at the old number after a bulk delete', 'Desk', 'NDC-3055',
  ['Select all tickets in a view and delete them.'], 'The sidebar count updates with the header count.',
  'Header shows (0) at once; the sidebar keeps 300 until the page is reloaded.', '—', 'Not filed (cosmetic).', ['NDC-3055-retest-PASS.png']],
 ['Info', 'Tickets | Clone fills the current user as Ticket Owner', 'Desk', 'NDC-3072', ['Clone a ticket owned by someone else.'],
  'Zoho shows Unassigned on the clone.', 'The clone form fills the current user as Ticket Owner.', 'Zoho: Unassigned (not rechecked today).', 'Parity point — your call.', ['NDC-3072-retest-PASS.png']],
 ['Info', 'Scoring | Score workflow does not run on a background rescore; Run scoring rules has no confirmation', 'CRM', 'NDC-1483',
  ['Workflow "Score reaches 40"; raise a lead\'s score with a background rescore.', 'Click Run scoring rules.'],
  'Decide whether background rescoring should trigger score workflows; a confirmation before rescoring every lead.',
  'Workflow ran only on a save, not on the background rescore (5 → 55); Run rescored all 12,041 leads at once with no confirmation.',
  'Not checked.', 'Listed in the comment on NDC-2934.', []],
 ['Info', 'Workflow Rules | Run detail shows raw ids and an empty Details column', 'Desk', 'NDC-2997', ['Open a workflow run in Execution History.'],
  'Readable module, target and result.', 'Module and Target show raw ids ("OrgUnitRoundRobin:<uuid>"); Details is empty while the API has "owner_assigned".', '—', 'Not filed.', []],
];
const tally = {}; F.forEach(f => { const k = f[0].split('/')[0]; tally[k] = (tally[k] || 0) + 1; });
let h = `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Round 20 New Findings</title><style>${css}
.sec{margin-top:6px}.sec b{display:block;font-size:12px;text-transform:uppercase;letter-spacing:.03em;color:var(--mut)}ol{margin:2px 0 2px 18px}</style></head><body><main>
<h1>New findings — retest round 20 (17 Nov 2026)</h1>
<div class="muted">Found while retesting Mahmoud Mohamed's Ready For Test tickets on NDC-Staging · none filed as its own ticket yet · some are already written into the related ticket's comment (see "Status")</div>
<div class="tiles">${Object.entries(tally).map(([k, v]) => `<div class="tile t-${k === 'High' ? 'fail' : k === 'Medium' ? 'part' : k === 'Low' ? 'info' : 'you'}"><b>${v}</b><span>${k}</span></div>`).join('')}<div class="tile"><b>${F.length}</b><span>findings in total</span></div></div>
<h2>Summary</h2><div class="wrap"><table><tr><th>#</th><th>Sev</th><th>Proposed title</th><th>Found in</th><th>Status</th></tr>${F.map((f, i) => `<tr><td><a href="#f${i + 1}">${i + 1}</a></td><td><span class="pill ${sevC(f[0])}">${esc(f[0])}</span></td><td>${esc(f[1])}</td><td>${esc(f[3])}</td><td>${esc(f[8])}</td></tr>`).join('')}</table></div>
<h2>Details</h2>`;
F.forEach((f, i) => { h += `<div class="card ${f[0] === 'High' ? 'fail' : ''}" id="f${i + 1}"><h3>${i + 1}. ${esc(f[1])} <span class="pill ${sevC(f[0])}">${esc(f[0])}</span></h3><div class="muted">${esc(f[2])} · found while retesting ${esc(f[3])}</div>
<div class="sec"><b>Steps</b><ol>${f[4].map(s => `<li>${esc(s)}</li>`).join('')}</ol></div><div class="sec"><b>Expected</b>${esc(f[5])}</div><div class="sec"><b>Actual</b>${esc(f[6])}</div><div class="sec"><b>Zoho</b>${esc(f[7])}</div>
<div class="ask"><b>Status:</b> ${esc(f[8])}</div>${f[9].length ? `<details><summary>Evidence (the related ticket's annotated image)</summary><div class="thumbs">${f[9].map(img).join('')}</div></details>` : ''}</div>`; });
h += `<p class="muted">Environment: NDC-Staging (staging-desk / staging-crm.taviportal.com), Edge + API, owner account plus one QA agent and one CRM user, 17 Nov 2026. Titles follow "Feature | Descriptive title".</p></main></body></html>`;
fs.writeFileSync(path.join(RUN, 'new-findings-r20.html'), h); console.log('written new-findings-r20.html', F.length, 'findings');
