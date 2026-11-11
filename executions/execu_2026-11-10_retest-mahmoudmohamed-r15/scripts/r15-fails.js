// Round 15 fail/partial tickets, compared with Zoho on 11 Nov 2026. node r15-fails.js → plane-draft-fails.html/json. node r15-fails.js <csv> --post → comment + Bug + attach.
const fs = require('fs'); const path = require('path'); const RUN = path.join(__dirname, '..'); const { execFileSync } = require('child_process');
const [csv, flag] = process.argv.slice(2);
const ENV = (app) => `Environment: staging-${app}.taviportal.com, tenant NDC-Staging, Edge; account: admin. Zoho reference: ${app === 'desk' ? 'Zoho Desk (techsolutionsegypt)' : 'Zoho CRM (org944965048, Enterprise)'}, checked live 11 Nov 2026; Zoho test data deleted afterwards.`;
const T = [
 { k: 'NDC-2729', id: '4ead7a61-0fb1-4bf6-a102-bc218fc2703f', v: 'FAIL', app: 'desk', img: ['NDC-2729-retest-FAIL-vs-zoho.png', 'NDC-2729-crm-vs-zoho.png'],
   sum: 'CRM blueprint: fixed, and it now matches Zoho CRM (Task has a fixed module, one "Assigned To" where empty means the record owner, and Status/Priority start on the first option). Desk blueprint ("Tickets from Mail"): not fixed.',
   ok: ['CRM Create task / Meeting / Call: no module picker, owner only through Assign to, pick lists start on the first option (same as Zoho CRM)'],
   bad: [['Desk Field update: value of a pick list', 'Zoho Desk: starts at "-None-" and then the real options', 'TAVI shows "Value" as if it were an option'],
         ['Desk Field update: fields offered', 'Zoho Desk does not offer Status, Team, Department or Skills in a blueprint Field update', 'TAVI offers Status and Skills, and Department/Team as plain text "Value"'],
         ['Desk Create task: Department / Team', 'Zoho Desk has no Department/Team boxes; "Assign to" is a picker with Agents and Teams tabs', 'TAVI has Department* and Team as plain text boxes']],
   note: 'Correction to the expected result: Zoho Desk does not pick the first real option; it starts at "-None-".' },
 { k: 'NDC-2806', id: 'c6ce285f-7a2e-4b84-bd67-0dc87447a5e0', v: 'PARTIAL', app: 'crm', img: ['NDC-2806-retest-PARTIAL-vs-zoho.png', 'NDC-2806-retest-PARTIAL.png'],
   sum: 'Global Sets work for create, convert, clone, values (add, rename, colour, replace, unused, restore), association with mapping, safeguards and permissions. One gap remains against Zoho CRM.',
   ok: ['Create / convert / clone, values, association + mapping, 50-field limit, locked and wrong-type fields refused, permissions and audit', 'Used In lists fields and custom views (Zoho lists fields only, so the earlier "reports not listed" point is dropped)'],
   bad: [['Replace a value that a custom view filter uses', 'Zoho CRM allows it and replaces the value in records, criteria, workflow actions and field dependency (Green → Red: the lead and the view filter both changed, Green moved to unused)', 'TAVI refuses with 409 GLOBAL_SET_VALUE_IN_USE "Change or remove it in those views first"']] },
 { k: 'NDC-2807', id: '7e03a59d-626d-48e8-a41f-8f4468467b09', v: 'PARTIAL', app: 'crm', img: ['NDC-2807-retest-PARTIAL-vs-zoho.png', 'NDC-2807-retest-PARTIAL.png'],
   sum: 'Mass delete and Recycle Bin selection delete now finish after the user leaves the page. Mass update does not.',
   ok: ['Mass delete of 450 records: finished after leaving the page (0 failed)', 'Recycle Bin: delete 50 selected, leave the page → done (twice)'],
   bad: [['Mass update, leave the page 1 s after starting', 'Zoho CRM runs it as a background job ("The mass update action is scheduled successfully" + progress panel): 200/200 updated within 1 min after leaving', 'TAVI: 6 of 200 changed after 45 s and after 3 min; no job, nothing resumed']],
   note: 'Empty Recycle Bin (whole bin) was not run because the bin also holds other people\'s items.' },
 { k: 'NDC-2630', id: 'cd74d3ad-134c-433f-b719-c02babeb981c', v: 'PARTIAL', app: 'crm', img: ['NDC-2630-retest-PARTIAL-vs-zoho.png', 'NDC-2630-retest-PARTIAL.png'],
   sum: 'A failed send is now recorded honestly (422 MAIL_SEND_FAILED, Emails tab "Not sent… Failed" + Retry, no Email sent entry in the timeline). The screen still lets a sender who can\'t send try.',
   ok: ['Send from a refused sender → 422, Emails tab Failed + Retry, no EmailSent in the timeline (both cases)'],
   bad: [['Compose when the sender can\'t send', 'Zoho CRM blocks Send Email before Compose opens ("Email Confirmation Required … so that you can send emails")', 'TAVI opens Compose with no notice and Send enabled, although /emails/sendability already says can_send false'],
         ['Message dialog of a failed mail', 'Only the failed status', 'TAVI shows a blue "Sent" chip next to the red "Failed" chip']],
   note: 'How Zoho shows a failed send on the record was not compared (that needs a real failing send to an outside address).' },
 { k: 'NDC-2810', id: '42730648-7cc5-4998-85fc-0d3f33c94ad8', v: 'PARTIAL', app: 'desk', img: ['NDC-2810-retest-PARTIAL.png'],
   sum: 'Deleting a synced contact in Desk now unlinks it without a failure, and records in the Desk recycle bin are counted as Ignored. Deletions on the CRM side are still reported as failures.',
   ok: ['Delete in Desk → link unlinked, no failure', 'Sync all customers: Desk-deleted records counted as Ignored'],
   bad: [['Contact deleted in CRM', 'Unlinked and left out, not reported as a failure (ticket)', 'Failure Log "Needs attention · The CRM record was deleted."; the Desk contact stays'],
         ['Sync all customers', 'No failure for records that exist in neither app', '1 failure "B04" (Last Name empty), a record in neither customer list']],
   note: 'Not compared with Zoho: testing deletions would need writes in both Zoho apps; judged against the ticket\'s expected result.', envOverride: 'Environment: staging-desk + staging-crm.taviportal.com, tenant NDC-Staging, Edge; account: admin. Not compared with Zoho (see note).' },
 { k: 'NDC-2794', id: '96b66641-68cc-40bb-a6e7-f0222ed21143', v: 'FAIL', app: 'desk', img: ['NDC-2794-retest-FAIL-vs-zoho.png', 'NDC-2794-retest-FAIL.png'],
   sum: 'Same as 4–6 Nov. Zoho Desk confirms the expected result.',
   ok: ['Rule with team + agent of that team saved (201); agent outside the team refused (400)'],
   bad: [['Ticket matching a "team + agent" rule', 'Zoho Desk ("Assign to an agent in a team"): owner and team set in one update and both still there 15 s later', 'TAVI: owner = agent, then History "Team was updated: QA RT15 2794 team → blank"; ticket has no team']] },
 { k: 'NDC-2136', id: '9f559025-4222-4823-933b-57eb3bff3635', v: 'FAIL', app: 'crm', img: ['NDC-2136-retest-FAIL-vs-zoho.png', 'NDC-2136-retest-FAIL.png'],
   sum: 'First page of the list is still far above the 1.5 s target, with slow outliers that Zoho does not have.',
   ok: [],
   bad: [['Leads list, first page (navigation → first real row)', 'Target p95 ≤ 1.5 s; Zoho CRM measured the same way: 6.7–8.0 s (median 7.46 s), no outliers', 'TAVI Leads p50 4.28 s, p95 13.53 s; Transactions p95 9.15 s and 19.92 s on two runs']],
   note: 'TAVI\'s median is faster than Zoho\'s, but its p95 (13.5–19.9 s) is well above Zoho\'s slowest load (8.0 s) and the 1.5 s target.' },
 { k: 'NDC-2137', id: '533f6806-b5a3-410d-8ec9-ea4f67c174e7', v: 'FAIL', app: 'crm', img: ['NDC-2137-retest-FAIL-vs-zoho.png', 'NDC-2137-retest-FAIL.png'],
   sum: 'Kanban cards never load; it is worse than on 6 Nov.',
   ok: [],
   bad: [['Kanban first cards', 'Cards load (Zoho CRM: always loaded, 16.6–33.7 s on this trial)', 'TAVI: every column shows "Could not load these records"; all 134 column requests return 500'],
         ['records?skip_total=true', '200', '500 on Transactions, Leads and Tasks (200 without skip_total)'],
         ['Kanban headers p95', '≤ 2 s', '19.11 s (6 Nov: 1.76 s)']] },
];
const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;');
const html = t => `<p><strong>Retest ${t.v} — 10–11 Nov 2026</strong> → moved to Bug<br>${esc(t.envOverride || ENV(t.app))}</p><p>${esc(t.sum)}</p>`
  + (t.ok.length ? `<p>Working now:</p><ul>${t.ok.map(o => `<li>${esc(o)}</li>`).join('')}</ul>` : '')
  + `<p>Still failing:</p><ul>${t.bad.map(b => `<li><strong>${esc(b[0])}</strong>: expected ${esc(b[1])}; actual ${esc(b[2])}</li>`).join('')}</ul>`
  + (t.note ? `<p>${esc(t.note)}</p>` : '') + `<p>Evidence: ${t.img.map(esc).join(', ')} (attached; side-by-side images: TAVI left, Zoho right)</p>`;
const draft = T.map(t => ({ ticket: t.k, id: t.id, verdict: t.v, state: 'Bug', attach: t.img, comment_html: html(t) }));
fs.writeFileSync(path.join(RUN, 'plane-draft-fails.json'), JSON.stringify(draft, null, 1));
const b64 = f => fs.readFileSync(path.join(RUN, 'screenshots/annotated', f)).toString('base64');
fs.writeFileSync(path.join(RUN, 'plane-draft-fails.html'), `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Plane draft r15 fails</title><style>body{font:14px/1.5 "Segoe UI",system-ui;max-width:1100px;margin:auto;padding:16px;background:#f6f7f9;color:#111827}section{background:#fff;border:1px solid #e5e7eb;border-radius:8px;padding:12px 16px;margin:14px 0}img{max-width:100%;border:1px solid #e5e7eb;margin-top:8px}.c{border-left:4px solid #dc2626;padding:2px 12px}</style></head><body>
<h1>Plane draft — round 15 fail/partial tickets (vs Zoho, 11 Nov 2026)</h1><p>8 tickets → Bug, each with the comment below and the listed images. Already posted: 16 → Done (10–11 Nov); NDC-2823 reopened to Bug with a correction (11 Nov).</p>
${draft.map(d => `<section><h3>${d.ticket} — ${d.verdict} → Bug</h3><div class="c">${d.comment_html}</div><p>Attach: ${d.attach.join(', ')}</p>${d.attach.map(f => `<img src="data:image/png;base64,${b64(f)}">`).join('')}</section>`).join('')}</body></html>`);
console.log('draft built', draft.length);
if (flag !== '--post') return;
(async () => {
  const rows = fs.readFileSync(csv, 'utf8').split(/\r?\n/).filter(Boolean).map(l => l.split(',').map(v => v.replace(/^"|"$/g, '')));
  const H = { 'X-API-Key': rows[1][rows[0].indexOf('Secret key')], 'Content-Type': 'application/json' };
  const API = 'https://api.plane.so/api/v1/workspaces/ahmed-hegazy/projects/efce4d84-5876-4015-b472-2efca7ad73f3/work-items/';
  for (const d of draft) {
    const w = await (await fetch(API + d.id + '/', { headers: H })).json(); if (w.state !== 'f5299bf6-0dfc-4d40-9223-da9c1fab09b1') { console.log(d.ticket, 'SKIPPED — not in Ready For Test'); continue; }
    const c = await fetch(API + d.id + '/comments/', { method: 'POST', headers: H, body: JSON.stringify({ comment_html: d.comment_html }) });
    const s = await fetch(API + d.id + '/', { method: 'PATCH', headers: H, body: JSON.stringify({ state: '34a7f4b6-7207-4955-b927-0d8d1dd3c666' }) });
    console.log(d.ticket, 'comment', c.status, 'state→Bug', s.status);
    for (const f of d.attach) { try { console.log(execFileSync('node', [path.join(__dirname, 'plane-attach.js'), d.id, path.join(RUN, 'screenshots/annotated', f)], { encoding: 'utf8' }).trim()); } catch (e) { console.log(f, 'ATTACH FAILED'); } }
  }
})();
