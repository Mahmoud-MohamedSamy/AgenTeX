// Builds ndc-1865/report.html and plane-draft-comment.html. Run from the ndc-1865 folder.
const fs = require('fs');
const rows = [
  ['1', 'Modules and Fields', 'Setup → Customization → Modules and Fields', '/modules 200 (10 modules); ticket fields 200 (141)', 'yes', 'Available', 'NDC-2174', ['01-modules-fields.png']],
  ['2', 'Activity Life Cycle', 'Activities: All Activities, Tasks, Calls, Events', '200; ~527 activities, 397 tasks', 'yes', 'Available', 'NDC-2635, NDC-2830', ['../bugs-draft/evidence/raw/b2-agent-activities-list.png']],
  ['3', 'Direct Assignment Rules', 'Setup → Automation → Assignment Rules → Direct Assignment', '/desk/assignment-rules 200', 'yes', 'Available (no rule switched on)', 'NDC-1978, NDC-2275', ['03-assignment-rules.png']],
  ['4', 'Workflows', 'Setup → Automation → Workflow Rules; Actions', '/workflow/rules 200 (46); /workflow/actions 200 (8)', 'yes', 'Available', '—', ['04-workflow-rules.png', '04b-actions.png']],
  ['5', 'SLAs', 'Setup → Automation → SLA & Escalation (per department); Support Plans', '/desk/sla/policies 200', 'yes', 'Available', 'NDC-2754', ['05-sla.png']],
  ['6', 'Round Robin Assignment', 'Assignment Rules → Round Robin (by turn, load or skill)', '/desk/assignment-rules 200 (3 rules)', 'yes', 'Available', 'NDC-2275, NDC-2752', ['06-round-robin.png']],
  ['7', 'Blueprints', 'Setup → Automation → Blueprints (per department)', 'ticket blueprints 200 (8)', 'yes', 'Available', 'NDC-2754', ['07-blueprints.png']],
  ['8', 'Notification rules', 'Setup → Customization → Notifications (per department, email and SMS)', '/desk/notification-rules 200', 'yes', 'Available', '—', ['08-notifications.png']],
  ['9', 'Automation Studio', 'No page by that name; its address redirects to Home. Closest: Setup → Automation (10 entries)', 'none', 'no', 'Not available as a named feature', '—', ['09-automation-studio-search.png', '09b-macros.png']],
  ['10', 'Data Administration (excluding Data Backup)', 'Setup → Data Administration: Recycle Bin, Export, Import, Bulk Actions Log; Audit Log', 'recycle bin 200; exports 200; audit 200', 'yes', 'Available', '—', ['10a-recycle-bin.png', '10b-export.png', '10c-import.png', '10d-bulk-actions-log.png', '10e-audit-log.png']],
  ['11', 'Collaboration', 'Team Feeds (feeds, mentions, following, direct messages); Collaboration Tools (Slack on; Google Drive, MS Teams, Google Chat); ticket comments', '/desk/feeds 200; /desk/collaboration 200', 'yes', 'Available', '—', ['11a-collaboration-tools.png', '11b-team-feeds-setup.png', '11c-team-feeds.png']],
  ['12', 'Ticketing Reply', 'Ticket page: Reply All, other reply types, Comment, Close; Scheduled Replies', '200', 'yes', 'Available', 'NDC-2636, NDC-2831', ['12-ticket-page.png']],
  ['13', 'Email Templates', 'Setup → Customization → Email Templates (with folders)', '/desk/email-templates 200', 'yes', 'Available', '—', ['13-email-templates.png']],
  ['14', 'CRM ⇄ Desk Integration', 'Setup → Integrations → CRM ⇄ Desk Integration, connected since 5 Nov 2026', 'status + config 200', 'warn', 'Available (423 sync changes "Parked")', 'NDC-2392', ['14-crm-desk-integration.png']],
];
const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const src = f => (f.startsWith('../') ? f : 'evidence/raw/' + f);
const cls = { yes: 'ok', no: 'no', warn: 'warn' };
const table = rows.map(r => `<tr><td>${r[0]}</td><td><strong>${esc(r[1])}</strong></td><td>${esc(r[2])}</td><td class="api">${esc(r[3])}</td><td><span class="v ${cls[r[4]]}">${esc(r[5])}</span></td><td>${esc(r[6])}</td></tr>`).join('');
const gallery = rows.map(r => `<section class="feat"><h3>${r[0]}. ${esc(r[1])} <span class="v ${cls[r[4]]}">${esc(r[5])}</span></h3><p class="sub">${esc(r[2])}</p>${r[7].map(f => `<a href="${src(f)}" target="_blank"><img loading="lazy" src="${src(f)}" alt="${esc(r[1])}"></a><div class="cap">${esc(f.split('/').pop())}</div>`).join('')}</section>`).join('');
const comment = `<h2>Availability check, 10 Nov 2026 (tenant NDC-Staging)</h2><p>Checked whether each feature in this list exists in TAVI Desk today: a working page and its data loading. This is not a full retest; detailed gaps are in the linked tickets. Result: <strong>13 available, 1 not available</strong>.</p><ul>${rows.map(r => `<li><strong>${esc(r[1])}</strong>: ${esc(r[5])}. ${esc(r[2])}.${r[6] !== '—' ? ' Details: ' + esc(r[6]) + '.' : ''}</li>`).join('')}</ul><p>Notes: "Automation Studio" has no page in TAVI Desk; the closest is the Automation menu (Workflow Rules, Actions, SLA &amp; Escalation, Support Plans, Assignment Rules, Macros, Blueprints, AI Tagging, Ticket Archiving, Time Tracking). The CRM ⇄ Desk page shows 423 sync changes "Parked" (gave up after repeated failures). Checked read-only as ndc-staging-owner; nothing was changed.</p>`;
fs.writeFileSync('plane-draft-comment.html', comment);
const css = `:root{--bg:#f7f7f5;--card:#fff;--ink:#1d1d1f;--mute:#5d5d63;--line:#dcdcd6;--ok:#1a7f37;--no:#b42318;--warn:#a15c07}
@media (prefers-color-scheme:dark){:root:not([data-theme="light"]){--bg:#17181a;--card:#202124;--ink:#ececec;--mute:#a4a4ab;--line:#37383c;--ok:#5cc27a;--no:#f0786d;--warn:#e3a24a}}
:root[data-theme="dark"]{--bg:#17181a;--card:#202124;--ink:#ececec;--mute:#a4a4ab;--line:#37383c;--ok:#5cc27a;--no:#f0786d;--warn:#e3a24a}
*{box-sizing:border-box}body{margin:0;background:var(--bg);color:var(--ink);font:15px/1.55 "Segoe UI",system-ui,Arial,sans-serif}main{max-width:1120px;margin:0 auto;padding:32px 16px 64px}
h1{font-size:26px;margin:0 0 4px}h2{font-size:20px;margin:36px 0 12px;padding-bottom:6px;border-bottom:1px solid var(--line)}h3{font-size:16px;margin:0 0 4px}
.sub{color:var(--mute);margin:0 0 8px}.card{background:var(--card);border:1px solid var(--line);border-radius:10px;padding:16px 18px;margin:14px 0}
.stats{display:flex;gap:12px;flex-wrap:wrap;margin-top:16px}.stat{background:var(--card);border:1px solid var(--line);border-radius:10px;padding:12px 18px;min-width:140px}.stat b{font-size:26px;display:block}
.wrap{overflow-x:auto}table{border-collapse:collapse;width:100%;font-size:14px}th,td{border-bottom:1px solid var(--line);padding:7px 8px;text-align:left;vertical-align:top}th{color:var(--mute)}td.api{color:var(--mute);font-size:13px}
.v{display:inline-block;font-size:12.5px;font-weight:600;padding:1px 8px;border-radius:4px;border:1px solid currentColor}.v.ok{color:var(--ok)}.v.no{color:var(--no)}.v.warn{color:var(--warn)}
.feat{background:var(--card);border:1px solid var(--line);border-radius:10px;padding:14px 16px;margin:14px 0}.feat img{max-width:100%;border:1px solid var(--line);border-radius:6px;display:block;margin-top:8px}.cap{color:var(--mute);font-size:12px;margin:2px 0 6px}
.draft{background:var(--card);border:1px dashed var(--line);border-radius:10px;padding:4px 18px 12px}`;
const html = `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>NDC-1865 availability check</title><style>${css}</style></head><body><main>
<h1>NDC-1865 Desk Features Testing: availability check</h1>
<div class="sub">10 Nov 2026 · NDC-Staging · ndc-staging-owner · read-only (pages opened, nothing changed) · presence only, not a full retest</div>
<div class="stats"><div class="stat"><b style="color:var(--ok)">13</b>available</div><div class="stat"><b style="color:var(--no)">1</b>not available (Automation Studio)</div><div class="stat"><b style="color:var(--warn)">423</b>parked CRM ⇄ Desk syncs</div></div>
<h2>Results</h2><div class="card wrap"><table><tr><th>#</th><th>Feature</th><th>Where in TAVI Desk</th><th>Data (GET)</th><th>Verdict</th><th>Detailed tickets</th></tr>${table}</table></div>
<h2>Points to note</h2><div class="card"><ul>
<li><strong>Automation Studio:</strong> TAVI Desk has no feature with that name; its address redirects to Home. The closest is Setup → Automation with 10 entries (Workflow Rules, Actions, SLA &amp; Escalation, Support Plans, Assignment Rules, Macros, Blueprints, AI Tagging, Ticket Archiving, Time Tracking). Whether that counts depends on what NDC means by "Automation Studio".</li>
<li><strong>CRM ⇄ Desk sync:</strong> the integration page shows <strong>423 changes "Parked"</strong> (gave up after repeated failures, "needs your attention"); Queued, Processing and Failed are all 0. Records may not be moving between CRM and Desk. Not investigated.</li>
<li><strong>Activities:</strong> its page timed out in this pass; the screenshot is from the bug check earlier today.</li>
<li><strong>Direct Assignment:</strong> the screen exists; no rule is currently switched on.</li></ul></div>
<h2>Draft Plane comment (not posted)</h2><div class="draft">${comment}</div>
<h2>Evidence</h2>${gallery}
</main></body></html>`;
fs.writeFileSync('report.html', html);
console.log('ok');
