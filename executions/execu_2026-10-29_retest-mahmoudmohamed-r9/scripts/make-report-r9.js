// Round 9 report (29 Oct 2026, Anyware tenant): self-contained report.html with each ticket's priority, verdict, proposed Plane action,
// the checked rows (same specs as the images) and the embedded annotated image. Tickets without a spec are listed as not retested yet.
// Usage: node scripts/make-report-r9.js
const fs = require('fs'); const path = require('path');
const RUN = path.join(__dirname, '..');
const META = JSON.parse(fs.readFileSync(path.join(RUN, 'meta.json'), 'utf8'));
const esc = s => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const spec = k => { const f = path.join(__dirname, 'specs-r9', k + '.json'); return fs.existsSync(f) ? JSON.parse(fs.readFileSync(f, 'utf8')) : null; };
const img = n => 'data:image/png;base64,' + fs.readFileSync(path.join(RUN, 'screenshots', 'annotated', n)).toString('base64');
const PRI = { urgent: ['Urgent', '#b91c1c'], high: ['High', '#ea580c'], medium: ['Medium', '#ca8a04'], low: ['Low', '#2563eb'], none: ['None', '#6b7280'] };
const V = { PASS: ['ok', 'Pass', 'Done + comment + image'], FAIL: ['bug', 'Fail', 'Bug + comment + image'], PARTIAL: ['warn', 'Partial', 'Bug + comment + image'],
  BLOCKED: ['info', 'Blocked', 'Comment only (no state change)'], DECISION: ['dec', 'Needs your decision', 'Your decision'], PENDING: ['mute', 'Not retested yet', '—'] };
// One-line summary per ticket (from notes-r9.md)
const SUM = {
  'NDC-2412': 'Supervisor and Manager in the same org unit still get 403 on a User\'s lead (also after 60 s and a fresh sign-in). Other org unit, same rank and lower→higher are correctly hidden.',
  'NDC-2701': 'A Manager in another org unit gets 403 and doesn\'t see the lead in lists. Recheck after NDC-2412 is fixed (superiors currently see no lower rank at all).',
  'NDC-2294': '12 of 13 items work on Anyware (run, not only saved). Still missing: Record Score trigger (switched off, "Phase 5"). Item 7 stored, not run (approver groups hold real users).',
  'NDC-2406': 'On Anyware (pair made from the Desk side): deleting the CRM contact removes the Desk contact, which lands in the Desk recycle bin and restores (200, back). Observation: CRM-created contacts never get a Desk partner on Anyware.',
  'NDC-2630': 'Everything testable is honest (pre-check false, 422 with the reason, nothing shown as sent, no EmailSent, Send disabled). The round 8 path (provider failure at send time) can\'t be reproduced on Anyware.',
  'NDC-613': 'Export granted + views denied → list 403, export 403, no Settings link, direct URL "Access Denied". Control works; the export holds only the user\'s own rows.',
  'NDC-2707': 'Tasks (2/2), a lead made by a blueprint after-action, and a control lead all enter their blueprint once approved.',
  'NDC-2708': 'Approver opened records waiting for them 62/62 times (200). Observation: right after approving, the approver gets 404 on that record.',
  'NDC-2709': '4/4: the edit right after the review approval succeeds (no REVIEW_LOCKED).',
  'NDC-2705': 'Imported lead held for review when automation is triggered on import; not held when the option is off (as the option says).',
  'NDC-2538': 'Review webhook (public catcher, user-approved, deleted after): submitted, approved, rejected and resubmitted are all posted, each with X-Anyware-Timestamp and X-Anyware-Signature; the HMAC-SHA256 signature verifies on all 9 requests.',
  'NDC-2706': 'Decision 1 Nov: review applies to new records only (intended). The On Edit workflow runs after every Mass Update (4/4: execution logged, marker set) and the lead continues into its blueprint.',
  'NDC-2703': 'Free-text condition refused; a matching lead can\'t be edited by the owner or a user (422 RECORD_LOCKED); control editable.',
  'NDC-492': 'Tab Order option selects, saves, survives reload, and the form\'s Tab order follows it (columns vs rows).',
  'NDC-2712': 'A filled spam trap creates no lead (page_origin null and set); the normal submission does.',
  'NDC-2710': 'Without the permission the view says canApprove false (missing_permission) and Approve is refused — consistent; with it, Approve works.',
  'NDC-2655': 'Business hours moved to /iam/tenant/business-hours. The stored 24/7 record re-saves unchanged (200 ×2); a 24/7 save carrying hours is stored clean; the check still refuses a broken 24/7. Screen: Save stays disabled while nothing changed.',
  'NDC-2656': 'On the owner\'s own user record the profile control is disabled ("Owner (fixed)"), Assign is disabled, and the reason is shown.',
  'NDC-2414': 'Adding the Desk Administrator profile gives no CRM view-all: other users\' leads stay 403 and unlisted; the CRM-scoped permissions have no view_all. (The unscoped permission list still merges desk metadata keys — no effect on records.)',
  'NDC-2647': 'The report shows the rollup value 12 — the same as the record — at once and after 1, 3 and 6 minutes.',
  'NDC-2624': 'The timeline now logs attachment added (×2), attachment removed and record deleted, besides created / changed / note / restored. Uploads work again.',
  'NDC-1950': 'My Requests has the three tabs, columns, filters, per-cycle History rows and DELETED marking; no action controls. Owner, manager (U2 → subordinate U1) and regular user each get the right rows and filters. Note: the default User profile lacks crm.page.my_requests.view.',
  'NDC-1823': 'Probability and Expected Revenue are locked and filled from Stage + Amount (18 / 1800); typing is refused; the duration fields aren\'t offered; the deal form opens at once.',
  'NDC-1343': 'Record, field, workflow rule, profile, user override and org unit actions are all logged with the user; every login / logout names the user.',
  'NDC-2711': 'A deleted or unknown layout now answers 404 LAYOUT_NOT_FOUND with a clear message (not 403); a live layout creates the lead.',
  'NDC-2704': 'Home cards show field names (Subject, Due date, Status, Priority, Related To; Title, From, To, Related To) — no raw keys.',
  'NDC-2657': 'A user without profile access has no Permissions link and the direct URL shows "You don\'t have permission to manage profiles". (Optional view-only permission not added.)',
  'NDC-2658': 'Invite with all seats used: "All seats are in use. Remove a user or add seats in Billing to invite someone." — no raw key; nothing invited.',
  'NDC-2321': 'The timeline shows the owner change naming the assignment rule, a workflow field-update row naming the rule, and a blueprint entry row — in the order they ran.',
};
// Already updated in Plane on 29 Oct (user's go-ahead): ticket → state
const POSTED = { 'NDC-2412': 'Bug', 'NDC-2294': 'Bug', 'NDC-613': 'Done', 'NDC-2707': 'Done', 'NDC-2708': 'Done', 'NDC-2709': 'Done', 'NDC-2705': 'Done', 'NDC-2703': 'Done', 'NDC-492': 'Done', 'NDC-2712': 'Done', 'NDC-2710': 'Done', 'NDC-2406': 'Done', 'NDC-2655': 'Done', 'NDC-2656': 'Done', 'NDC-2414': 'Done', 'NDC-2647': 'Done', 'NDC-2624': 'Done', 'NDC-1950': 'Done', 'NDC-1823': 'Done', 'NDC-1343': 'Done', 'NDC-2706': 'Done', 'NDC-2538': 'Done', 'NDC-2711': 'Done', 'NDC-2704': 'Done', 'NDC-2321': 'Done', 'NDC-2658': 'Done', 'NDC-2657': 'Done' };
const rows = META.map(t => { const s = spec(t.key); return { ...t, v: s ? s.verdict : 'PENDING', s }; });
const order = ['urgent', 'high', 'medium', 'low', 'none'];
rows.sort((a, b) => order.indexOf(a.pri) - order.indexOf(b.pri) || a.n - b.n);
const cnt = k => rows.filter(r => r.v === k).length;
const priBadge = p => `<span class="pri" style="background:${PRI[p][1]}">${PRI[p][0]}</span>`;
const pill = v => `<span class="pill ${V[v][0]}">${V[v][1]}</span>`;
const byPri = order.filter(p => rows.some(r => r.pri === p)).map(p => `<tr><td>${priBadge(p)}</td><td>${rows.filter(r => r.pri === p).length}</td><td>${rows.filter(r => r.pri === p && r.v !== 'PENDING').length}</td><td>${rows.filter(r => r.pri === p && r.v === 'PENDING').length}</td></tr>`).join('');
const notes = fs.readFileSync(path.join(RUN, 'notes-r9.md'), 'utf8');
const obs = (notes.split('## Observations (not filed)')[1] || '').split('\n').filter(l => l.startsWith('- ')).map(l => l.slice(2))
  .concat(['NDC-2708: right after approving, the approver (CRM User) gets 404 "Record not found" on that record (5/5).', 'Deleting the QA web form returned 500 (retried at cleanup).', 'Staging sign-in failed from ~16:45 (EDT) on 29 Oct: "Exception was thrown by handler.", later "Sign in failed."; all saved sessions were signed out. 12 tickets paused.']);
const ledger = fs.readFileSync(path.join(RUN, 'ledger.md'), 'utf8').split('\n').filter(l => l.startsWith('- '));
const html = `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Retest Round 9</title><style>
:root{--bg:#f6f7f9;--card:#fff;--ink:#111827;--mute:#6b7280;--line:#e5e7eb;--ok:#16a34a;--bug:#dc2626;--warn:#d97706;--info:#2563eb;--dec:#7c3aed}
@media (prefers-color-scheme:dark){:root:not([data-theme="light"]){--bg:#0b1020;--card:#121a2e;--ink:#e5e7eb;--mute:#9ca3af;--line:#243049}}
:root[data-theme="dark"]{--bg:#0b1020;--card:#121a2e;--ink:#e5e7eb;--mute:#9ca3af;--line:#243049}
*{box-sizing:border-box}body{margin:0;background:var(--bg);color:var(--ink);font:15px/1.5 "Segoe UI",system-ui,sans-serif}
main{max-width:1240px;margin:0 auto;padding:24px 16px 64px}h1{font-size:26px;margin:0 0 4px}h2{font-size:20px;margin:36px 0 12px}h3{margin:0;font-size:17px}
.sub{color:var(--mute);margin:0 0 18px}.kpis{display:grid;grid-template-columns:repeat(auto-fit,minmax(130px,1fr));gap:10px;margin:16px 0}
.kpi{background:var(--card);border:1px solid var(--line);border-radius:10px;padding:12px}.kpi b{display:block;font-size:26px}.kpi span{color:var(--mute);font-size:13px}
table{width:100%;border-collapse:collapse;background:var(--card);border:1px solid var(--line);border-radius:10px;overflow:hidden}th,td{padding:8px 10px;border-bottom:1px solid var(--line);text-align:left;vertical-align:top;font-size:14px}th{background:rgba(127,127,127,.08)}
.wrap{overflow-x:auto}.pri{color:#fff;font-weight:700;font-size:12px;padding:2px 9px;border-radius:10px;white-space:nowrap}
.pill{font-weight:700;font-size:12px;padding:2px 9px;border-radius:10px;white-space:nowrap;color:#fff}.ok{background:var(--ok)}.bug{background:var(--bug)}.warn{background:var(--warn)}.info{background:#6b7280}.dec{background:var(--dec)}.mute{background:transparent;color:var(--mute);border:1px dashed var(--mute)}
.card{background:var(--card);border:1px solid var(--line);border-radius:12px;padding:16px;margin:16px 0}.head{display:flex;flex-wrap:wrap;gap:8px;align-items:center;margin-bottom:8px}
.card img{width:100%;height:auto;border:1px solid var(--line);border-radius:8px;margin-top:10px}details summary{cursor:pointer;color:var(--info);margin-top:8px}
ul{margin:6px 0 0 18px;padding:0}li{margin:2px 0}.note{background:rgba(217,119,6,.1);border:1px solid rgba(217,119,6,.35);border-radius:10px;padding:10px 14px}
code{font-size:13px}</style></head><body><main>
<h1>Retest Round 9 — Mahmoud Mohamed · NDC · CRM</h1>
<p class="sub">29 Oct 2026 · staging-crm.taviportal.com · <b>tenant Anyware</b> · owner + test users U1–U2 (CRM User profile) · API and Edge (headless). Every ticket shows its Plane priority.</p>
<div class="note"><b>Status (1 Nov 2026): all 29 retested.</b> 27 updated in Plane (11 on 29 Oct, 16 on 1 Nov), each with comment and evidence image. NDC-2630 and NDC-2701 wait for you. NDC-2203 (Urgent) came back to Ready For Test on 1 Nov — not part of this round yet.</div>
<div class="kpis"><div class="kpi"><b>29</b><span>tickets (all CRM)</span></div><div class="kpi"><b>${cnt('PASS')}</b><span>Pass → Done</span></div><div class="kpi"><b>${cnt('FAIL') + cnt('PARTIAL')}</b><span>Fail / Partial → Bug</span></div>
<div class="kpi"><b>${cnt('DECISION')}</b><span>Need your decision</span></div><div class="kpi"><b>${cnt('BLOCKED')}</b><span>Blocked</span></div><div class="kpi"><b>${cnt('PENDING')}</b><span>Not retested yet</span></div></div>
<h2>Why the round paused on 29 Oct</h2>
<p>At about 16:45 (EDT) on 29 Oct staging signed every saved session out at once (owner, test user 1, test user 2). New sign-ins then failed — first "Exception was thrown by handler.", later "Sign in failed." The owner sign-in was tried 4 times in total (the last after a 10-minute wait) and then stopped on purpose: more attempts could lock the owner account, and none of the remaining tickets can be tested without a signed-in user.</p>
<ul><li>Tickets are worked one at a time in priority order, so the 13 left are all Medium and Low.</li>
<li>The Java automation is built around the NDC-Staging tenant (its ids and accounts), so every ticket on Anyware is retested with new API / screen scripts, which takes longer per ticket.</li>
<li>Sign-in came back the same evening; the 13 were retested on 29 Oct and 1 Nov.</li></ul>
<h2>Still open (your call)</h2>
<p>Decided on 1 Nov: NDC-2706 → Done (review on new records only is intended); NDC-2538 → retested with a public catcher (PASS); NDC-2406 → retested on Anyware (PASS).</p>
<section class="card"><div class="head"><h3>NDC-2630</h3>${priBadge('high')}${pill('DECISION')}<span>Email | A failed email send is shown as sent</span></div>
<p><b>What was seen on Anyware:</b> every failure that could be caused is reported honestly — the pre-check says sending isn't possible, sending is refused with the reason (422), nothing is shown as sent, nothing is logged as "EmailSent", and the compose window disables Send and explains why.</p>
<p><b>Why it needs you:</b> round 8 failed on a different path — a mail connection existed but the provider failed at the moment of sending, and the timeline still logged "EmailSent". Anyware only has a working connection for taviportal.com and none of the test accounts uses that domain, so that path can't be recreated here.</p>
<p><b>Options:</b> (a) <b>Done</b> — accept that the honest path works; (b) <b>keep in Ready For Test</b> and retest that path on NDC-Staging, where round 8 found it.</p></section>
<section class="card"><div class="head"><h3>NDC-2701</h3>${priBadge('high')}${pill('PASS')}<span>Hierarchy | In role mode, a Manager in another department can see a user's leads</span></div>
<p><b>What was seen on Anyware:</b> it passes — a Manager in another org unit can't open or list the lead.</p>
<p><b>Why it needs you:</b> it passes partly because role-based visibility currently lets a higher rank see nothing below it (NDC-2412 still fails).</p>
<p><b>Options:</b> (a) <b>Done now</b>, with a note to recheck after 2412 is fixed; (b) <b>hold it</b> until 2412 is fixed.</p></section>
<h2>By priority</h2><div class="wrap"><table><tr><th>Priority</th><th>Tickets</th><th>Retested</th><th>Not yet</th></tr>${byPri}</table></div>
<h2>Results</h2><div class="wrap"><table><tr><th>#</th><th>Ticket</th><th>Priority</th><th>Feature</th><th>Title</th><th>Verdict</th><th>Proposed Plane action</th></tr>
${rows.map(r => `<tr><td>${r.n}</td><td><b>${r.key}</b></td><td>${priBadge(r.pri)}</td><td>${esc(r.labels[0])}</td><td>${esc(r.name)}</td><td>${pill(r.v)}</td><td>${POSTED[r.key] ? "In Plane → " + POSTED[r.key] : V[r.v][2]}</td></tr>`).join('')}</table></div>
<h2>Tickets</h2>
${rows.filter(r => r.s).map(r => `<section class="card" id="${r.key}"><div class="head"><h3>${r.key}</h3>${priBadge(r.pri)}${pill(r.v)}<span style="color:var(--mute)">${esc(r.labels[0])}</span></div>
<div>${esc(r.name)}</div><p><b>Result:</b> ${esc(SUM[r.key] || '')}</p>
<div class="wrap"><table><tr><th>#</th><th>Check</th><th>Expected (ticket)</th><th>Now</th><th>Result</th></tr>${r.s.rows.map(x => `<tr><td>${esc(x[0])}</td><td>${esc(x[1])}</td><td>${esc(x[2])}</td><td>${esc(x[3])}</td><td>${esc(x[4])}</td></tr>`).join('')}</table></div>
<details><summary>Evidence image — ${esc(r.s.out)}</summary><img loading="lazy" alt="${esc(r.key)} evidence" src="${img(r.s.out)}"></details></section>`).join('')}
<h2>Not retested yet (${cnt('PENDING')})</h2><div class="wrap"><table><tr><th>#</th><th>Ticket</th><th>Priority</th><th>Title</th></tr>${rows.filter(r => !r.s).map(r => `<tr><td>${r.n}</td><td>${r.key}</td><td>${priBadge(r.pri)}</td><td>${esc(r.name)}</td></tr>`).join('')}</table></div>
<h2>Observations (not filed)</h2><ul>${obs.map(o => `<li>${esc(o)}</li>`).join('')}</ul>
<h2>Test data ledger (cleanup after the round)</h2><details><summary>${ledger.length} entries — everything created or changed on Anyware</summary><ul>${ledger.map(l => `<li><code>${esc(l.slice(2))}</code></li>`).join('')}</ul></details>
<h2>Security notes</h2><ul><li>Passwords and tokens were never printed; credentials were read from the Excel file into a scratchpad CSV that is deleted at cleanup.</li><li>No public file or request host was used; email recipients and web-form data used example.com.</li><li>The only custom action run was "NDC agency profile" (a read-only GET); payment / booking actions were not touched.</li><li>Every setting changed during a test (profiles, overrides, layouts) was restored in the same script.</li></ul>
</main></body></html>`;
fs.writeFileSync(path.join(RUN, 'report.html'), html);
console.log('report.html', (html.length / 1024 / 1024).toFixed(1) + ' MB', rows.filter(r => r.s).length, 'retested,', cnt('PENDING'), 'pending');
