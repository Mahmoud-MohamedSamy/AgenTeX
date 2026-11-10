// Builds drafts.json + report.html for the NDC-1865 follow-up bug drafts (B, K1, K2; E = not reproduced). Run from this folder.
const fs = require('fs');
const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const common = { state: 'Bug', module: 'Desk', cycle: 'Sprint 15', assignees: ['MahmoudMohamed', 'Hegazy', 'mfathy', 'eahmed'], start_date: '2026-11-10' };
const drafts = [
  { key: 'B', file: true, title: 'Ticket replies | Reply and Reply All leave "To" empty on tickets created in Desk (form or API); the contact is not added', priority: 'Medium', labels: ['Tickets', 'Email Channel'], label_ids: ['c250807e-0e69-4057-82e2-32ccf9803ed4', '6b131130-3422-4cce-8563-338328b44671'], relates: ['NDC-2636'],
    env: 'Staging, staging-desk.taviportal.com, tenant NDC-Staging, 10 Nov 2026. Tech department (From tech@help-staging.anyware.software). Contact "mahmoud mohamed" <mmohamed@anyware.software>.',
    steps: ['Create a ticket in Tech for a contact that has an email, with the New Ticket form (or the API).', 'Open the ticket and click Reply All (or Reply from the menu).', 'Type the address by hand, send one reply, reload, and click Reply All again.'],
    expected: 'As in Zoho Desk: Reply and Reply All put the ticket\'s contact in To (Zoho ticket #115, created inside Zoho, contact mmohamed@anyware.software: To = mmohamed@anyware.software).',
    actual: ['#2543 (New Ticket form) and #2504 (API): Recipients is empty although Contact Info shows mmohamed@anyware.software.', 'Plain Reply is empty too.', 'After the first reply, Reply All still has Recipients empty and the contact is moved into Cc.', 'A ticket created by inbound email (#2568, from mahmoud.mmohamedsamy@gmail.com) works: Reply and Reply All fill Recipients with the sender.'],
    notes: ['Every reply on a ticket created inside Desk needs the customer\'s address typed by hand.', 'Test tickets #2543 and #2504 were deleted after the check; #2568 is the user\'s own email ticket and was left as is.'],
    image: 'annotated/B-reply-to-empty-vs-zoho.png' },
  { key: 'K1', file: true, title: 'Data Administration | Bulk Actions Log does not list a mass update, while it lists small imports, exports and deletes', priority: 'Low', labels: ['Data Administration'], label_ids: ['25acaa2a-c65c-4f3c-95be-8e014865b748'], relates: [],
    env: 'Staging, NDC-Staging, 10 Nov 2026, account mahmoud.mahamed1515.',
    steps: ['Contacts list → select 2 contacts → Update → Title = "QA FT 1865 K bulk" → Update ("2 records updated").', 'Open Setup → Data Administration → Bulk Actions Log.'],
    expected: 'The log treats bulk operations consistently. Zoho Desk logs bulk actions on more than 50 records ("Actions simultaneously initiated for more than 50 records are called bulk actions"); TAVI states no threshold and already lists an import of 2, an export of 16 and mass deletes of 1–8 records, so a mass update should be listed too (or a stated threshold applied to all).',
    actual: ['The import (15:31) and export (15:54) are listed; the mass update at 15:45 is not.', 'The Audit Log shows the mass update happened (both title changes at 15:45).'],
    notes: ['A mass update on more than 50 records was not tested, so it is not known whether larger mass updates are logged.', 'Zoho\'s trial log is empty, so its threshold comes from the page text.'],
    image: 'annotated/K1-bulk-log-mass-update-vs-zoho.png' },
  { key: 'K2', file: true, title: 'Audit Log | Contacts export is logged as "exported the audit log" and "export named 0 Contacts"', priority: 'Low', labels: ['Audit Log'], label_ids: ['e1338078-cf16-4295-bf7d-62d1dae18df5'], relates: [],
    env: 'Staging, NDC-Staging, 10 Nov 2026, account mahmoud.mahamed1515; Contacts export of 16 records (CSV) at 15:54.',
    steps: ['Setup → Data Administration → Export → Contacts, CSV, all records (16) → Export.', 'Open Setup → Audit Log (filter user = the exporter).'],
    expected: 'One clear entry for the export with the right object and count, e.g. "exported 16 Contacts (CSV)". Zoho\'s Audit Log shows each change as a structured row (record name, Entity, Action).',
    actual: ['"mahmoud.mahamed1515 exported the audit log (16 Contacts (csv))" — shown twice; it was a contacts export, not the audit log.', '"mahmoud.mahamed1515 added a Desk data export named 0 Contacts (csv)" — count 0 instead of 16.', '"updated 16 Contacts (csv)\'s status from blank value to completed" — the export job name reads like a record.'],
    notes: ['Other Audit Log rows show raw ids where names are expected (e.g. "DecidedBy from blank value to 3445ec4a-…", and on other testers\' tickets "User a7a7a7a7 updated … owner … to 876ce871-…"). Could be added here or kept separate.'],
    image: 'annotated/K2-audit-export-wording-vs-zoho.png' },
  { key: 'E', file: false, title: 'CRM ⇄ Desk | Parked count vs Failure Log count — NOT REPRODUCED (229 = 229 now)', priority: 'Low', labels: ['CRM Integration'], label_ids: ['bb19020f-1a53-4f15-a2bb-9c279d24c8f2'], relates: ['NDC-2392'],
    env: 'Staging, NDC-Staging, 10 Nov 2026 ~17:10, read-only.',
    steps: ['Setup → Integrations → CRM ⇄ Desk Integration → Overview (Sync queue).', 'Open Failure Log.'],
    expected: 'The Parked number equals the number of records in the Failure Log.',
    actual: ['Now: Overview Parked 229, Failure Log "Could not sync 229 / 229 records could not sync", API total_count 229.', 'Earlier today (Lane H) the Overview showed 423 while the list returned 226. That does not reproduce now.'],
    notes: ['Recommendation: do not file; recheck if the numbers drift apart again.', 'Failure Log items for deleted records show only a raw record id (e.g. cda72981-…) instead of a name. Several of today\'s 229 come from our own cleanup (Lane K and Lane E contacts); they were left untouched (Discard is a write).'],
    image: 'annotated/E-parked-count-now-matches.png' },
];
fs.writeFileSync('drafts.json', JSON.stringify({ common, drafts }, null, 1));
const card = d => `<div class="card ${d.file ? (d.priority === 'Medium' ? 'med' : 'low') : 'nr'}">
<h3>${d.key}. ${esc(d.title)}</h3>
<div class="fields"><div>Recommendation</div><div>${d.file ? '<strong>File</strong>' : '<strong>Do not file</strong> (not reproduced)'}</div>
<div>Fields</div><div>${d.file ? `Bug · <strong>${d.priority}</strong> · ${common.assignees.join(', ')} · ${d.labels.join(' + ')} · ${common.module} · ${common.cycle} · start ${common.start_date}${d.relates.length ? ' · relates to ' + d.relates.join(', ') : ''}` : '—'}</div>
<div>Environment</div><div>${esc(d.env)}</div></div>
<p><strong>Steps</strong></p><ol>${d.steps.map(s => `<li>${esc(s)}</li>`).join('')}</ol>
<p><strong>Expected</strong>: ${esc(d.expected)}</p>
<p><strong>Actual</strong></p><ul>${d.actual.map(s => `<li>${esc(s)}</li>`).join('')}</ul>
<p><strong>Notes</strong></p><ul>${d.notes.map(s => `<li>${esc(s)}</li>`).join('')}</ul>
<a href="${d.image}" target="_blank"><img loading="lazy" src="${d.image}" alt="${esc(d.key)} evidence"></a><div class="cap">${esc(d.image)}</div></div>`;
const css = `:root{--bg:#f7f7f5;--card:#fff;--ink:#1d1d1f;--mute:#5d5d63;--line:#dcdcd6;--ok:#1a7f37;--no:#b42318;--warn:#a15c07;--blue:#1f5fbf;--chip:#efefea}
@media (prefers-color-scheme:dark){:root:not([data-theme="light"]){--bg:#17181a;--card:#202124;--ink:#ececec;--mute:#a4a4ab;--line:#37383c;--ok:#5cc27a;--no:#f0786d;--warn:#e3a24a;--blue:#7aa7f0;--chip:#2b2c30}}
:root[data-theme="dark"]{--bg:#17181a;--card:#202124;--ink:#ececec;--mute:#a4a4ab;--line:#37383c;--ok:#5cc27a;--no:#f0786d;--warn:#e3a24a;--blue:#7aa7f0;--chip:#2b2c30}
*{box-sizing:border-box}body{margin:0;background:var(--bg);color:var(--ink);font:15px/1.55 "Segoe UI",system-ui,Arial,sans-serif}main{max-width:1080px;margin:0 auto;padding:32px 16px 64px}
h1{font-size:26px;margin:0 0 4px}h2{font-size:20px;margin:36px 0 12px;padding-bottom:6px;border-bottom:1px solid var(--line)}h3{font-size:17px;margin:0 0 6px}
.sub{color:var(--mute)}.card{background:var(--card);border:1px solid var(--line);border-radius:10px;padding:16px 18px;margin:14px 0}
.med{border-left:4px solid var(--no)}.low{border-left:4px solid var(--warn)}.nr{border-left:4px solid var(--ok)}
.fields{display:grid;grid-template-columns:max-content 1fr;gap:4px 14px;font-size:14px;margin:6px 0 10px}.fields div:nth-child(odd){color:var(--mute)}
.wrap{overflow-x:auto}table{border-collapse:collapse;width:100%;font-size:14px}th,td{border-bottom:1px solid var(--line);padding:7px 8px;text-align:left;vertical-align:top}th{color:var(--mute)}
img{max-width:100%;border:1px solid var(--line);border-radius:6px;display:block;margin-top:8px}.cap{color:var(--mute);font-size:12px;margin:2px 0 6px}ol,ul{padding-left:22px}li{margin:3px 0}`;
const html = `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>NDC-1865 bug drafts</title><style>${css}</style></head><body><main>
<h1>NDC-1865 follow-up: bug drafts for review</h1>
<div class="sub">10 Nov 2026 · TAVI NDC-Staging (read-only this pass) + Zoho Desk trial (read-only) · nothing filed in Plane</div>
<h2>Summary</h2><div class="card wrap"><table><tr><th>#</th><th>Draft</th><th>Priority</th><th>Recommendation</th></tr>
${drafts.map(d => `<tr><td>${d.key}</td><td>${esc(d.title)}</td><td>${d.file ? d.priority : '—'}</td><td>${d.file ? 'File' : 'Do not file (not reproduced)'}</td></tr>`).join('')}</table>
<p class="sub">Common fields for filed drafts: Bug state, assignees ${common.assignees.join(', ')}, module ${common.module}, ${common.cycle}, start ${common.start_date}, annotated image attached.</p></div>
<h2>Drafts</h2>${drafts.map(card).join('')}
<h2>What this pass did</h2><div class="card"><ul>
<li>TAVI (mahmoud.mahamed1515, one sign-in): read-only — Audit Log, Bulk Actions Log, CRM ⇄ Desk Overview + Failure Log; opened inbound-email ticket #2568 and its Reply / Reply All composers, closed without typing (no draft saved). Nothing created, edited, sent or deleted.</li>
<li>Zoho Desk trial (read-only): CRM integration settings, Bulk Action Log, Audit Log, ticket #115 Reply All composer opened and closed without typing. Zoho sent only its own background calls ("recent items", the "agent is replying" collision signal); no draft, reply or record change.</li>
<li>Zoho CRM integration Sync History / Failure Log tabs could not be opened by the script ("Unable to process your request"); E's Zoho side uses the help article.</li></ul></div>
</main></body></html>`;
fs.writeFileSync('report.html', html);
console.log('ok');
