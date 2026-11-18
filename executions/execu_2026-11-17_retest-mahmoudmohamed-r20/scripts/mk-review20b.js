// node mk-review20b.js → ../review-r20b.html : explains each of the 6 tickets retested in round 20b (17 Nov 2026, afternoon).
const fs = require('fs'), path = require('path');
const RUN = path.join(__dirname, '..');
const css = fs.readFileSync(path.join(RUN, '../execu_2026-11-16_retest-mahmoudmohamed-r19/scripts/mk-review.js'), 'utf8').match(/const css = `([\s\S]*?)`;/)[1];
const esc = s => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const spec = n => JSON.parse(fs.readFileSync(path.join(__dirname, 'specs', n + '.json'), 'utf8'));
const img = f => `<a href="screenshots/annotated/${esc(f)}" target="_blank"><img loading="lazy" src="screenshots/annotated/${esc(f)}" alt="${esc(f)}"></a>`;
const pill = v => `<span class="pill ${v === 'BLOCKED' ? 'INFO' : v}">${esc(v)}</span>`;
const T = [
 { n: 'NDC-2997', pri: 'High', v: 'PARTIAL', title: 'Workflow Rules | Owner Assignment by role (round robin) never assigns anyone',
   problem: 'A workflow rule with the action "Owner Assignment → by role / org unit, round robin" never gave the ticket an owner. Yesterday (16 Nov) it still failed: 9 tickets in 2 departments stayed without owner.',
   dev: 'Fixed in workflow #142 (deployed 17 Nov). 4 cases checked by the developer: CEO org unit on a Customer Support ticket → assigned to Customer Experience Specialists 2 (via the background worker, ~5 s); CEO on QA AO Dept A → Skipped "nobody in the org unit can own a ticket of this department"; profile round robin in an empty department → Skipped; profile round robin in QA AO Dept A → Dev Team 2. Notes: a ticket created by a person keeps its creator as owner; sub-roles do not count.',
   did: 'Health check first (ticket numbers back, history still down). Then my own inactive-after rules running On Edit (priority Low → High) for each of the developer\'s 4 cases, 3 tickets each, plus a Manager role pool of 2 agents over 6 tickets to check that turns alternate, plus an On Create rule to test the "creator keeps the ticket" note. 22 test tickets.',
   result: 'The fix works: all 4 developer cases held (CES2 got 3 of 3 Customer Support tickets; Mahmoud Mohamed, read-only there, was never picked; the two Skipped cases give the right reason; Dev Team 2 got 3 of 3 in QA AO Dept A) and turns alternate Dev Team 2 / Test User 1 over 6 picks. The "creator keeps it" note did not hold — an On Create rule did set Dev Team 2, which is better. Yesterday\'s FAIL was partly our own reading: org units were read without the Desk app key, which returned the CRM org units.',
   open: 'New problem caused by the fix: when the owner is set by the background worker, that owner change counts as an edit, so the same On Edit rule fires again and reassigns the ticket (run 2 is chained to run 1). The ticket\'s owner flips twice and final owners are uneven (Dev Team 2, Dev Team 2, Test User 1, Test User 1). The run says "assigned Test User 1" but the ticket ends with Dev Team 2.',
   rec: 'Move to Bug with the re-fire problem as the still-failing item (or Done + file the re-fire as a new Medium bug, if you prefer to treat it as a new issue).' },
 { n: 'NDC-3058', pri: 'Medium', v: 'DECISION', title: 'Workflow Rules | Add Tags action says "Search or create a tag" but a new tag cannot be created from it',
   problem: 'The Add Tags action\'s box said "Search or create a tag", but typing a new name created nothing.',
   dev: 'Product decision 17 Nov: a Desk rule does not create tags, because Desk tags belong to a department and a rule can span several departments; tags are created on Tickets → Tags. Wording changed to "Search tags…", a new name shows "No matching tags". The developer notes this differs from Zoho.',
   did: 'Opened Add Tags and Remove Tags in a new rule, typed an existing and a non-existent name, pressed Enter, watched the network; then saved a rule with an existing tag (limited to QA AO Dept A) and fired it by editing a ticket.',
   result: 'Wording fix holds in both actions: "Search tags…", a new name shows "No matching tags", Enter adds nothing and no create request is sent. Picking an existing tag works and the rule tagged ticket #4885.',
   open: 'The tag list shows every department\'s tags with no department name ("QA WF tag A" appears 3 times). The first one belonged to Customer Support and was put on a QA AO Dept A ticket — this contradicts the developers\' own reason that tags belong to a department. Execution History also shows no Add Tags action row. Zoho was not checked live today.',
   rec: 'Decide: (a) accept that rules don\'t create tags → Done, and file the other-department tag list as a new Medium bug; or (b) Bug — a rule should be able to create a tag, as in Zoho Desk.' },
 { n: 'NDC-3057', pri: 'Low', v: 'PARTIAL', title: 'Workflow Rules | Condition summary shows "pending_approval" instead of "Pending approval"',
   problem: 'The folded condition line of a rule showed the stored value ("pending_approval") instead of the label users see.',
   dev: 'Fixed (client-engine #839): list fields now show their option label, without quotes on named values. Not checked by the developer: Status, Priority, a custom list, a related record\'s list field, the CRM rule editor, Arabic.',
   did: 'Built rules with conditions on every kind of list field in Desk (Approval Status, Status, Priority, Language, Classification, Happiness Rating, Ticket Approval Status, a custom list, a related Contact\'s Type) and in the CRM rule editor (Lead Source, Rating, Industry), in English and Arabic; read the folded line and the open editor.',
   result: 'Approval Status is fixed in Desk, CRM and Arabic ("Pending approval", no quotes); typed text keeps its quotes. Status and the custom list look right only because their stored value equals the label.',
   open: 'Still stored values: Desk Priority [high, urgent] (ticket page says "High"), Language arabic, Classification [feature], Happiness Rating okay, Ticket Approval Status pending, Contact · Type customer; CRM Lead Source [web, referral], Rating market_failed, Industry technology. In Arabic all stay as English stored values. The open condition editor also shows the stored values; the Arabic pattern "( 1 and 2 )" is not translated.',
   rec: 'Move to Bug — the fix covers one field; the ticket\'s problem remains for the other list fields.' },
 { n: 'NDC-3056', pri: 'Medium', v: 'PARTIAL', title: 'Blueprint | Agents cannot see the blueprint\'s flow and transition conditions from a ticket',
   problem: 'An agent on a ticket could not see the blueprint\'s flow (states and transitions) or the conditions of each transition. Yesterday PARTIAL: the popup showed only the steps leaving the current state.',
   dev: 'Deployed client-engine #847: the header shows the step\'s button with "View configured actions" beside it; the link opens the blueprint\'s flow and stays when nothing can run; English + Arabic checked.',
   did: 'Signed in once as the QA agent Customer Experience Specialists 2; my own blueprint with 4 states and 6 transitions; opened the ticket in each state (Open, Escalated, Closed), ran steps as the agent, checked the popup, conditions and run status, English and Arabic; read what the server sends to the agent.',
   result: 'Header link is there next to the step button and stays when nothing can run; Steps card keeps its link; "Shown when: Priority = high/medium", "You can run this step", "Asks for: Checklist" and "You can\'t run this step now…" are shown; the agent ran two steps and the ticket moved.',
   open: 'Same as yesterday: the popup draws only the transitions leaving the current state — 3 of 6 in Open, 1 of 6 in Escalated, 1 of 6 in Closed; On Hold → Closed never appears. The server already sends the agent the whole flow (all 4 states, all 6 transitions), so only the drawing is missing.',
   rec: 'Move to Bug — the "whole flow" part of the ticket is still not met.' },
 { n: 'NDC-3063', pri: 'Medium', v: 'PASS', title: 'Blueprint | The state time limit only accepts hours',
   problem: 'A state\'s time limit and warning could only be entered in hours ("Time limit in hours"); a 20-minute limit showed as 0.33.',
   dev: 'Deployed client-engine #847: "Due after" and "Warn before" each have a number and a Minutes / Hours / Days picker; a saved value opens in the largest unit it fills evenly; an empty box starts in hours.',
   did: 'My own inactive blueprint; saved 20/10 minutes, 72 hours, 90 minutes, 1.5 days, 3 days; reloaded; read the stored minutes through the API; tried invalid values (0, empty, text, negative, fractions, huge), warning after the limit; English and Arabic; checked "Moves on by itself" and escalation offsets too.',
   result: 'All as the ticket expects: 20/10 → "20 Minutes / 10 Minutes", 4320 → 3 Days, 90 → 90 Minutes, 1.5 Days stored as 2160 and reopened as 36 Hours, 72 Hours reopens as 3 Days, empty starts in Hours; same picker for "Moves on by itself" and escalation offset; Arabic the same; warning not before the limit blocks publishing with a clear message.',
   open: 'Nothing for this ticket. Small notes: 0 / empty / text become "no limit", −5 shows "No limit", 0.5 min becomes 1, a 0.25-min warning is dropped — all silently; a huge value (99,999,999 days) gives a schema error toast. Whether the limit actually fires could not be checked (background processing down) — outside this ticket.',
   rec: 'Move to Done.' },
 { n: 'NDC-2841', pri: 'Medium', v: 'DECISION', title: 'SLA | A contract in one department can use a support plan from another department',
   problem: 'A contract in Department A could be saved with Department B\'s support plan. Yesterday PARTIAL: create with a Dept B plan was accepted (201) and the New Contract form listed every department\'s plans.',
   dev: 'Deployed 17 Nov (metadata-engine + Desk app): create and change with another department\'s plan → 422 SUPPORT_PLAN_OTHER_DEPARTMENT; the form\'s plan field was not checked in a browser by the developer.',
   did: 'API: create (3 times), change plan, attach plan, move department with and without a matching plan, contract without department. Browser: New Contract form plan list per department, changing department after picking a plan, saving the mismatch, English and Arabic.',
   result: 'Both of yesterday\'s failures are fixed. API: 422 with a clear message, nothing created; change → 422; attach → 409; moving department together with a matching plan → 200; no department → "Department is required." Form: lists only the chosen department\'s plans; after a department change shows "This plan belongs to another department. Choose a plan of QA RT19 SLA Dept B." (Arabic too); saving the mismatch is refused; the right plan saves (201).',
   open: 'One path not covered (the developer said so): changing only the department of a contract that already has a plan returns 200 — the contract moves to Dept B, keeps the Dept A plan in its field and silently has no plan coverage. Minor: help text repeats "the contract\'s department"; the server error stays under Support Plan after the right plan is picked; the wrong plan stays ticked in the list.',
   rec: 'Decide: (a) Done, and file the department-only change as a new Low bug; or (b) keep it in Bug for that path.' },
];
const rows = s => `<div class="wrap"><table><tr><th>#</th><th>Check</th><th>Expected</th><th>Now</th><th>Result</th></tr>${s.rows.map(r => `<tr><td>${r[0]}</td><td>${esc(r[1])}</td><td>${esc(r[2])}</td><td>${esc(r[3])}</td><td>${pill(r[4])}</td></tr>`).join('')}</table></div>`;
let h = `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Retest Round 20b</title><style>${css}
.sec{margin-top:8px}.sec b{display:block;font-size:12px;text-transform:uppercase;letter-spacing:.03em;color:var(--mut)}</style></head><body><main>
<h1>Retest round 20b — each ticket explained</h1>
<div class="muted">6 tickets moved to Ready For Test on 17 Nov (08:19–10:54 UTC) · Mahmoud Mohamed · NDC-Staging (staging-desk / staging-crm) · Edge + API · retested 11:40–12:40 UTC · nothing posted to Plane yet</div>
<div class="tiles"><div class="tile t-pass"><b>1</b><span>PASS (3063)</span></div><div class="tile t-part"><b>3</b><span>PARTIAL (2997, 3057, 3056)</span></div><div class="tile t-you"><b>2</b><span>need your decision (3058, 2841)</span></div><div class="tile"><b>0</b><span>blocked</span></div></div>
<div class="card"><b>Staging health at the start (11:38 UTC):</b> ticket numbers work again and the service the developer restarted (owner changes written after the save) works; ticket <b>history is still not recorded</b>. No check in this report depends on history.</div>
<h2>Summary</h2><div class="wrap"><table><tr><th>Ticket</th><th>Priority</th><th>Result</th><th>In one line</th><th>Recommendation</th></tr>${T.map(t => `<tr><td><a href="#${t.n}"><b>${t.n}</b></a></td><td>${t.pri}</td><td>${pill(t.v)}</td><td>${esc(t.title)}</td><td>${esc(t.rec)}</td></tr>`).join('')}</table></div>`;
for (const t of T) { const s = spec(t.n);
  h += `<div class="card ${t.v === 'PASS' ? '' : t.v === 'DECISION' ? 'you' : 'fail'}" id="${t.n}"><h3>${t.n} ${pill(t.v)} <span class="muted" style="font-weight:400">${esc(t.title)} · ${t.pri}</span></h3>
<div class="sec"><b>The problem</b>${esc(t.problem)}</div>
<div class="sec"><b>What the developer said</b>${esc(t.dev)}</div>
<div class="sec"><b>What I did</b>${esc(t.did)}</div>
<div class="sec"><b>What works now</b>${esc(t.result)}</div>
<div class="sec"><b>What is still open</b>${esc(t.open)}</div>
<div class="ask"><b>Recommendation:</b> ${esc(t.rec)}</div>
<details><summary>All checks (as in the evidence image)</summary>${rows(s)}</details>
<details><summary>Annotated evidence</summary>${img(s.out)}</details></div>`; }
h += `<h2>New findings from these tickets — not filed</h2><div class="wrap"><table><tr><th>Sev</th><th>Finding</th><th>From</th></tr>
<tr><td>Medium</td><td>Owner Assignment re-fires its own On Edit rule after the background owner write and reassigns the ticket</td><td>NDC-2997</td></tr>
<tr><td>Medium</td><td>Add Tags picker offers and applies other departments' tags; Execution History shows no Add Tags row</td><td>NDC-3058</td></tr>
<tr><td>Low</td><td>Contract department-only change keeps the other department's plan and silently drops coverage</td><td>NDC-2841</td></tr>
<tr><td>Low</td><td>Huge time limit gives "Blueprint definition does not match the expected schema"; fractions/negatives changed silently</td><td>NDC-3063</td></tr>
<tr><td>Info</td><td>Workflow run detail shows raw ids and an empty Details column</td><td>NDC-2997</td></tr></table></div>
<h2>Data and sign-ins</h2><ul><li>All test data prefixed "QA RT20 WF" / "QA RT20 BS", listed in ledger.md; all rules and blueprints left inactive; SLA policies inactive; nothing changed tenant-wide.</li><li>One sign-in of the QA agent Customer Experience Specialists 2 (for NDC-3056); owner session shared, never re-signed.</li><li>Other round-20 tickets: NDC-2275 retest against live Zoho Desk still running; NDC-3000 and NDC-3068 blocked by the staging outage (3000 has a BLOCKED comment).</li></ul>
</main></body></html>`;
fs.writeFileSync(path.join(RUN, 'review-r20b.html'), h); console.log('written review-r20b.html', (h.length / 1024).toFixed(0) + ' KB');
