// Builds ndc-1865/functional/report.html (+ plane-draft-comment.html). Run from this folder.
const fs = require('fs');
const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const V = { W: ['ok', 'Working'], L: ['warn', 'Working, with a limit'], P: ['warn', 'Partly checked'] };
const rows = [
  ['1', 'Modules and Fields', 'G', 'W', 'Own layout for a throwaway department with a text and a picklist field; ticket saved with values and read back; a wrong picklist value refused (422); the New Ticket form shows both fields.', 'NDC-2174'],
  ['2', 'Activity Life Cycle', 'H', 'W', 'Task, call and event created on a ticket; task edited and completed; event deleted; all show on the ticket Activity tab and in Activities.', 'NDC-2635, NDC-2830'],
  ['3', 'Direct Assignment Rules', 'G', 'W', 'Rule "department + subject contains X → Test User 1": matching ticket assigned, other ticket left alone. The tenant-wide Direct rules switch is OFF on NDC-Staging (turned on ~20 s for the test, then off again).', 'NDC-1978, NDC-2275'],
  ['4', 'Workflows', 'G', 'W', 'On create: priority set to High and a tag added; a second rule ran a saved Field Update action; both runs logged.', '—'],
  ['5', 'SLAs (with escalation)', 'G', 'W', 'Policy 2 min response / 3 min resolution: due times set on create; at breach the escalation raised priority to Urgent and reassigned to Test User 1.', 'NDC-2754'],
  ['6', 'Round Robin Assignment', 'G', 'W', 'Sequential round robin over 2 agents: 4 tickets went TU1, QA1, TU1, QA1 (only when the ticket has no owner — see finding A).', 'NDC-2275, NDC-2752'],
  ['7', 'Blueprints', 'G', 'W', '2-state blueprint: new ticket entered it, the transition ran, status became Closed and the ticket left the blueprint.', 'NDC-2754'],
  ['8', 'Notification rules', 'H', 'L', 'Rules are a fixed list of on/off switches per department (37 in Tech), so no custom rule can be created. An enabled rule fired (public comment → contact email, "Reply queued / Reply sent" in history); the bell lists notifications.', '—'],
  ['10', 'Data Administration (excl. Backup)', 'H', 'P', 'Recycle Bin delete, restore and purge work; the Audit Log records the restore. Import wizard reached Assign but the import was not run (finding F). Export and Bulk Actions Log not checked.', '—'],
  ['11', 'Collaboration', 'H', 'W', 'Private ticket comment with @mention saves a real mention; Team Feeds post in HR with mention list, then deleted.', '—'],
  ['12', 'Ticketing Reply', 'H', 'W', 'Draft auto-saves (~5 s); reply sent and shows "Sent"; scheduled reply created 12 h ahead and discarded; ticket closed.', 'NDC-2636, NDC-2831'],
  ['13', 'Email Templates', 'H', 'W', 'Folder + template created; inserted into a reply, the placeholders (ticket number, subject, status) filled in and the reply was sent. The template subject was not used (finding C).', '—'],
  ['14', 'CRM ⇄ Desk Integration', 'H', 'W', 'A new Desk contact appeared in CRM within seconds ("synced"). Edit sync not checked. 423 parked syncs explained below.', 'NDC-2392'],
];
const findings = [
  ['A', 'Assignment rules skip a ticket that keeps its default owner', 'Likely bug · Medium', 'In the New Ticket form, Ticket Owner is pre-filled with the creator and the save sends no owner field; the API without an owner does the same. The ticket then already has an owner, so Direct Assignment and Round Robin never run on it. The rules ran only when the owner was sent as empty. On 7 Nov (case D-14) a ticket with no owner was still routed, so this changed since then. Effect: an agent who creates a ticket and leaves the default keeps it; rules are bypassed.', ['laneG/evidence/raw/_ui-before-save.png']],
  ['B', 'Reply All left "To" empty after our first reply', 'To recheck', 'On the second reply, To was empty (or the contact sat in Cc with To empty) and the contact had to be added by hand. The ticket was created by API; a ticket that arrived by email may behave differently. Needs one recheck on an email ticket before filing.', []],
  ['C', 'Email template subject not applied', 'Possible bug · Low', 'Inserting a template into a reply fills the body placeholders, but the reply keeps "Re: …" instead of the template subject. In Zoho Desk a reply keeps the thread subject too, so this may be by design — compare before filing.', ['laneH/evidence/raw/t3-before-send.png']],
  ['D', 'Deleting a Desk contact does not delete the CRM copy', 'To confirm intended behaviour', 'After the synced Desk contact was deleted, the CRM contact stayed. Many of the 423 parked syncs are this same situation (record in the other side\'s Recycle Bin). Needs a product decision on delete sync.', []],
  ['E', '"Parked" count 423 vs 226 in the failures list', 'Possible bug · Low', 'The integration page shows 423 parked changes but the failures list returns 226 records. Top reasons: linked Desk record in the Recycle Bin (64 contact deletes, 64 contact imports, 29 accounts); CRM record deleted (29 contacts, 6 accounts); contract missing required values (10 deal imports); empty Last Name in CRM (8); email already linked to another contact (9); Desk contract deleted (3). Almost all come from test records deleted on one side.', ['../evidence/raw/14-crm-desk-integration.png']],
  ['F', 'An unfinished import blocks the next import', 'Possible bug · Low', 'The first import attempt left an "import in progress" session open; the retry showed "You have an import in progress for this module" with no error. "Start over" cleared it; nothing was imported. Same family as the CRM leftover session from NDC-2628.', ['laneH/evidence/raw/d-err-assign.png']],
  ['G', 'New department saved as private when created as public', 'To recheck', 'Lane G created the throwaway department with visibility "public"; it was saved as "private". Not investigated.', []],
];
const table = rows.map(r => `<tr><td>${r[0]}</td><td><strong>${esc(r[1])}</strong></td><td><span class="v ${V[r[3]][0]}">${V[r[3]][1]}</span></td><td>${esc(r[4])}</td><td>${esc(r[5])}</td></tr>`).join('');
const fhtml = findings.map(f => `<div class="card"><h3>${f[0]}. ${esc(f[1])} <span class="tag">${esc(f[2])}</span></h3><p>${esc(f[3])}</p>${f[4].map(p => `<a href="${p}" target="_blank"><img loading="lazy" src="${p}" alt="${esc(f[1])}"></a><div class="cap">${esc(p.split('/').pop())}</div>`).join('')}</div>`).join('');
const working = rows.filter(r => r[3] === 'W').length;
const comment = `<h2>Functional check, 10 Nov 2026 (tenant NDC-Staging)</h2><p>Each feature was used end to end once on throwaway data (deleted afterwards). Automation Studio was left out. Result: <strong>${working} working, 1 working with a limit, 1 partly checked</strong>.</p><ul>${rows.map(r => `<li><strong>${esc(r[1])}</strong>: ${V[r[3]][1]}. ${esc(r[4])}</li>`).join('')}</ul><p>Findings to follow up: assignment rules skip tickets that keep the default owner; Reply All "To" empty after a reply (to recheck); template subject not applied; deleting a Desk contact leaves the CRM copy; parked sync count 423 vs 226 listed; an unfinished import blocks the next one; a new department saved as private.</p>`;
fs.writeFileSync('plane-draft-comment.html', comment);
const css = `:root{--bg:#f7f7f5;--card:#fff;--ink:#1d1d1f;--mute:#5d5d63;--line:#dcdcd6;--ok:#1a7f37;--no:#b42318;--warn:#a15c07;--chip:#efefea}
@media (prefers-color-scheme:dark){:root:not([data-theme="light"]){--bg:#17181a;--card:#202124;--ink:#ececec;--mute:#a4a4ab;--line:#37383c;--ok:#5cc27a;--no:#f0786d;--warn:#e3a24a;--chip:#2b2c30}}
:root[data-theme="dark"]{--bg:#17181a;--card:#202124;--ink:#ececec;--mute:#a4a4ab;--line:#37383c;--ok:#5cc27a;--no:#f0786d;--warn:#e3a24a;--chip:#2b2c30}
*{box-sizing:border-box}body{margin:0;background:var(--bg);color:var(--ink);font:15px/1.55 "Segoe UI",system-ui,Arial,sans-serif}main{max-width:1120px;margin:0 auto;padding:32px 16px 64px}
h1{font-size:26px;margin:0 0 4px}h2{font-size:20px;margin:36px 0 12px;padding-bottom:6px;border-bottom:1px solid var(--line)}h3{font-size:16px;margin:0 0 6px}
.sub{color:var(--mute)}.card{background:var(--card);border:1px solid var(--line);border-radius:10px;padding:16px 18px;margin:14px 0}
.stats{display:flex;gap:12px;flex-wrap:wrap;margin-top:16px}.stat{background:var(--card);border:1px solid var(--line);border-radius:10px;padding:12px 18px;min-width:150px}.stat b{font-size:26px;display:block}
.wrap{overflow-x:auto}table{border-collapse:collapse;width:100%;font-size:14px}th,td{border-bottom:1px solid var(--line);padding:7px 8px;text-align:left;vertical-align:top}th{color:var(--mute)}
.v{display:inline-block;font-size:12.5px;font-weight:600;padding:1px 8px;border-radius:4px;border:1px solid currentColor;white-space:nowrap}.v.ok{color:var(--ok)}.v.warn{color:var(--warn)}
.tag{display:inline-block;font-size:12px;font-weight:600;background:var(--chip);border-radius:4px;padding:1px 8px;margin-left:6px;color:var(--mute)}
img{max-width:100%;border:1px solid var(--line);border-radius:6px;display:block;margin-top:8px}.cap{color:var(--mute);font-size:12px;margin:2px 0 6px}
.draft{background:var(--card);border:1px dashed var(--line);border-radius:10px;padding:4px 18px 12px}ul{padding-left:22px}li{margin:3px 0}`;
const html = `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>NDC-1865 functional check</title><style>${css}</style></head><body><main>
<h1>NDC-1865 Desk Features: functional check</h1>
<div class="sub">10 Nov 2026 · NDC-Staging · Lane G (ndc-staging-owner, throwaway department "QA FT 1865 Dept") + Lane H (mahmoud.mahamed1515, ticket #2484 in Tech) · Automation Studio left out · nothing posted</div>
<div class="stats"><div class="stat"><b style="color:var(--ok)">${working}</b>working end to end</div><div class="stat"><b style="color:var(--warn)">1</b>working with a limit (Notification rules)</div><div class="stat"><b style="color:var(--warn)">1</b>partly checked (Data Administration)</div><div class="stat"><b style="color:var(--no)">7</b>findings to review</div></div>
<h2>Results by feature</h2><div class="card wrap"><table><tr><th>#</th><th>Feature</th><th>Verdict</th><th>What was done and seen</th><th>Detailed tickets</th></tr>${table}</table></div>
<h2>Findings for your decision</h2>${fhtml}
<h2>Not checked, and why</h2><div class="card"><ul>
<li><strong>Data import run</strong>: blocked by the leftover import session (finding F); no records imported.</li>
<li><strong>Export</strong>: the export page emails the person exporting (mahmoud.mahamed1515), which is not the approved test mailbox.</li>
<li><strong>Bulk Actions Log</strong>: skipped to keep within the time limit.</li>
<li><strong>CRM ⇄ Desk edit sync</strong>: only the create sync was checked.</li></ul></div>
<h2>Emails sent and settings touched</h2><div class="card"><ul>
<li>Up to 4 emails to mmohamed@anyware.software from Tech &lt;tech@help-staging.anyware.software&gt;, subject "Re: QA FT 1865 H reply check": first reply, template reply, the public-comment notification, and possibly the ticket-closed mail (that rule is on).</li>
<li>Creating the Tech ticket fired the enabled "department ticket created" rule, which emails Tech's agents. That went outside the approved address and could not be avoided without changing a shared rule.</li>
<li>Tenant Direct rules switch: turned on for ~20 s, back off and confirmed off. No other shared setting changed.</li></ul></div>
<h2>Cleanup</h2><div class="card"><ul>
<li>Lane G: 16 tickets, 2 assignment rules, 2 workflow rules, 1 saved action, 1 tag, 1 SLA policy, 1 blueprint, 1 layout, 2 fields and the department deleted, purged, all 404, bin clear.</li>
<li>Lane H: task, call, event, ticket, contact, template, folder deleted and purged (404); feed post deleted; scheduled reply discarded; CRM copy of the contact deleted and purged (404); import sessions cleared; nothing imported.</li>
<li>Session files deleted; no tokens in the run folder.</li>
<li>Staging was unstable during the run (two 503s, one failed page load after a deploy, one sign-out, one network change); none affected the verdicts.</li></ul></div>
<h2>Draft Plane comment for NDC-1865 (not posted)</h2><div class="draft">${comment}</div>
</main></body></html>`;
fs.writeFileSync('report.html', html);
console.log('ok');
