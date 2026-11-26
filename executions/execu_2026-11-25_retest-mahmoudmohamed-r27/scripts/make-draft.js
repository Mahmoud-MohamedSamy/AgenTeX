// Builds plane-draft.json, plane-draft.html and report.html for retest round r27 (25 Nov 2026).
const fs = require('fs'), path = require('path'); const R = path.join(__dirname, '..');
const ENV = 'Environment: staging-desk.taviportal.com, tenant NDC-Staging, Microsoft Edge (Chromium) + API; account: ndc-staging-owner (owner)';
const li = a => a.map(x => `<li>${x}</li>`).join('');
const items = [
 { ticket: 'NDC-2863', id: 'ba84b2e5-c590-40d0-8bdd-325b077f5d35', priority: 'High', title: 'Data Backup: a backup made today cannot be restored', verdict: 'PASS', to: 'Done', imgs: ['NDC-2863-retest-PASS.png'],
   method: 'Manual browser + API',
   checked: ['Setup › Data Backup, custom backup 24–26 Nov without attachments (made 25 Nov 09:48 UTC) → completed in 20 s, 271 records, <strong>restorable = true</strong>, no "made before restore was available" reason; expires 2 Dec.',
             'Restore into a new sandbox ("QA RT27 restore 2863") → accepted (202). Steps: provisioning → copying_identity (177 s) → copying_metadata (200 s) → finishing (232 s) → <strong>Ready after 242 s</strong>, no error. On 15 Nov it stopped at copying_metadata for over 32 minutes.',
             'Setup › Sandboxes lists it as "Restored from backup: custom backup of 2026-11-25 09:48 UTC", status Ready.'],
   notChecked: 'Signing in to the sandbox itself (it is entered by picking it at login; an API sign-in to it is refused with 403).' },
 { ticket: 'NDC-3207', id: '05ebfbb9-8ea8-4f72-9df4-7ffae5cc46a1', priority: 'Medium', title: 'Workflow Rules: list takes about a minute to load with ~200 rules', verdict: 'PASS', to: 'Done', imgs: ['NDC-3207-retest-PASS.png'],
   method: 'Manual browser (fresh Edge session) + API timing',
   checked: ['222 Tickets rules (56 existing + 166 temporary inactive QA RT27 rules).',
             'First visit after sign-in (09:57 UTC): first row after <strong>4.3 s</strong>; reloads 2.2 s and 2.3 s. Ticket measured 49 s (227 rules) and 74 s (217).',
             'Only 50 rows are drawn (paged, see NDC-3231). The rules API (take 200) answered in 0.7 s.'] },
 { ticket: 'NDC-3230', id: '5ad5157c-946f-43ce-96a1-9890be79783d', priority: 'Medium', title: 'Workflow Rules: an update that leaves out the conditions clears them', verdict: 'PASS', to: 'Done', imgs: ['NDC-3230-retest-PASS.png', 'NDC-3230-editor-remove-condition.png'],
   method: 'API + manual browser (rule editor)',
   checked: ['Active On Create rule in QA PA Dept 1, condition Subject starts with "QA RT27 3230".',
             'PATCH with only the actions → 200, <strong>condition kept</strong>, action changed. PATCH with only the name → 200, condition kept.',
             'Ticket "Other subject …" → rule not fired; ticket "QA RT27 3230 match" → fired once (control).',
             'PATCH with "criteria": null → condition cleared (explicit null still clears).',
             'Editor: change only the action and Save → condition kept. Remove the last condition and Save → editor sends criteria: null and the rule reopens with "No conditions — actions run on every event of this trigger" (the part the developer did not check live).'],
   observation: 'Side note, not part of this ticket: with no conditions the diagram still reads "CONDITION 1".' },
 { ticket: 'NDC-3231', id: '5e4324ab-2a7e-47a1-80a3-a40912bf0345', priority: 'Medium', title: 'Workflow Rules: the rules list has no pagination', verdict: 'PASS', to: 'Done', imgs: ['NDC-3231-retest-PASS.png'],
   method: 'Manual browser, 222 rules',
   checked: ['Pager "1–50 of 222", Page 1 of 5; Next → 51–100; last page 201–222 (22 rows); Previous disabled on page 1, Next disabled on page 5.',
             'Rows per page 25 / 50 / 100 → 25 rows (1 of 9), 50 (1 of 5), 100 (1 of 3); kept in the address.',
             'Walking every page: 222 rules, 222 unique (no gaps, no duplicates).',
             'Open a rule from page 2 and go back → page 2; opening ?page=3 directly → 101–150.',
             'Tabs go back to page 1 with their own totals: Inactive 1–50 of 220, Active 1–2 of 2, All 1–50 of 222.',
             'Search "QA RT27 list rule 1" from page 2 → page 1, 1–50 of 67, page 2 51–67 (67 matches the data). Department QA PA Dept 1 → 1–50 of 177 (166 + 11 all-department rules, matches the API).'] },
 { ticket: 'NDC-3136', id: '76736d0c-8398-4462-9426-313a0338b2a3', priority: 'Medium', title: 'Ticket Statuses: changing a status type does not update the SLA', verdict: 'BLOCKED', to: null, imgs: ['NDC-3136-retest-BLOCKED.png'],
   method: 'API',
   checked: ['SLA policy "QA RT27 SLA" in QA PA Dept 1 (active, on create + update, Subject contains "QA RT27 sla", response 1 h, resolution 4 h) and ticket "QA RT27 sla A".',
             'GET /desk/tickets/{id}/sla every 8 s for 64 s → state none; Reapply SLA → 200, still none.',
             'Still blocked by NDC-3202 (no SLA starts on new tickets, in Bug). The status type change was not run; no status was changed.'] },
 { ticket: 'NDC-3232', id: '7b3f49ca-2aed-4c5f-b367-a1a304367fc5', priority: 'Low', title: 'Workflow Rules: no Execution History button on the list page', verdict: 'PASS', to: 'Done', imgs: ['NDC-3232-retest-PASS.png'],
   method: 'Manual browser',
   checked: ['"Execution history" button in the list header, next to New Rule.',
             'Click → Execution History (/settings/workflow-executions) with the runs of every rule (19 different rules in the first 50 rows); Back returns to the list with its filter.'],
   observation: 'The list\'s module/department filter is not carried into Execution History (the ticket said "ideally"; the developer lists it as a follow-up).' },
 { ticket: 'NDC-3051', id: '4cc288d6-9126-4bbb-9ef9-9e143964a755', priority: 'Low', title: 'Data Backup: an expired backup gives "not finished" as the reason', verdict: 'BLOCKED', to: null, imgs: ['NDC-3051-retest-BLOCKED.png'],
   method: 'API',
   checked: ['GET /desk/data/backups: 01a1f83b expires 27 Nov 09:14 UTC (not expired), 01a2121b (made today) expires 2 Dec. No expired backup exists.',
             'Pass bar unchanged: an expired backup shows status expired, restorable false, reason BACKUP_EXPIRED. Retest after 27 Nov 09:14 UTC.'] }
];
const comment = it => `<p><strong>Retest ${it.verdict} — 25 Nov 2026</strong>${it.to ? ' → moved to ' + it.to : ' (state not changed)'}<br>${ENV}<br>Method: ${it.method}</p><p>Checked:</p><ul>${li(it.checked)}</ul>` +
  (it.notChecked ? `<p>Not checked: ${it.notChecked}</p>` : '') + (it.observation ? `<p>Note: ${it.observation}</p>` : '') + `<p>Evidence: ${it.imgs.join(', ')} (attached)</p>`;
const cleanup = ['166 temporary inactive rules "QA RT27 list rule 001–166" → delete', 'Rule "QA RT27 3230 rule" → already deleted (204) right after the editor check, because it had no conditions',
  'Tickets "Other subject RT27 3230 nomatch", "QA RT27 3230 match", "QA RT27 sla A" → delete', 'SLA policy "QA RT27 SLA" → delete', 'Sandbox "QA RT27 restore 2863" → delete', 'Backup 01a2121b (custom 24–26 Nov, made for NDC-2863) → delete',
  'Recycle Bin: purge QA RT27 items', 'Not touched: backup 01a1f83b (needed for NDC-3051 on 27 Nov)'];
fs.writeFileSync(R + '/plane-draft.json', JSON.stringify({ round: 'r27', date: '2026-11-25', items: items.map(it => ({ ticket: it.ticket, workitem_id: it.id, verdict: it.verdict, state_to: it.to, comment_html: comment(it), attach: it.imgs })), cleanup }, null, 1));
const img = f => 'data:image/png;base64,' + fs.readFileSync(R + '/screenshots/annotated/' + f).toString('base64');
const color = v => v === 'PASS' ? '#1f7a4d' : v === 'BLOCKED' ? '#6b7280' : '#b42323';
const css = `body{font:15px/1.5 "Segoe UI",sans-serif;max-width:1180px;margin:24px auto;padding:0 16px;color:#111827}h1{font-size:24px}table{border-collapse:collapse;width:100%}td,th{border-top:1px solid #e5e7eb;padding:6px 8px;text-align:left;vertical-align:top}.card{border:1px solid #e5e7eb;border-radius:8px;padding:16px;margin:18px 0}.pill{color:#fff;border-radius:4px;padding:2px 8px;font-size:13px;font-weight:600}.cm{background:#f9fafb;border:1px solid #e5e7eb;border-radius:6px;padding:10px 14px}img{max-width:100%;border:1px solid #e5e7eb;margin-top:8px}`;
const rows = items.map((it, i) => `<tr><td>${i + 1}</td><td>${it.ticket}</td><td>${it.priority}</td><td>${it.title}</td><td><span class="pill" style="background:${color(it.verdict)}">${it.verdict}</span></td><td>${it.to ? '→ ' + it.to + ' + comment + image' : 'comment + image only'}</td></tr>`).join('');
const cards = items.map(it => `<div class="card"><h2>${it.ticket} <span class="pill" style="background:${color(it.verdict)}">${it.verdict}</span></h2><p><b>State:</b> Ready For Test → <b>${it.to || 'no change'}</b> &nbsp; <b>Attach:</b> ${it.imgs.map(x => '<code>' + x + '</code>').join(', ')}</p><p><b>Comment as it will be posted:</b></p><div class="cm">${comment(it)}</div>${it.imgs.map(x => `<img src="${img(x)}">`).join('')}</div>`).join('');
const summary = `<table><tr><th>#</th><th>Ticket</th><th>Priority</th><th>Title</th><th>Verdict</th><th>Plane action</th></tr>${rows}</table>`;
fs.writeFileSync(R + '/plane-draft.html', `<!doctype html><html><head><meta charset="utf-8"><title>Plane draft r27</title><style>${css}</style></head><body><h1>Plane draft — retest r27 (25 Nov 2026), Mahmoud Mohamed, Desk</h1><p>Nothing below is posted until you approve.</p>${summary}${cards}<div class="card"><h2>Cleanup after posting</h2><ul>${li(cleanup)}</ul></div></body></html>`);
fs.writeFileSync(R + '/report.html', `<!doctype html><html><head><meta charset="utf-8"><title>Retest r27 report</title><style>${css}</style></head><body><h1>Retest r27 — 25 Nov 2026 — Mahmoud Mohamed (Desk, NDC-Staging)</h1><p>7 tickets: 5 PASS, 2 BLOCKED. Owner account, Edge + API.</p>${summary}${cards}<div class="card"><h2>Observations</h2><ul><li>Workflow rule editor: with no conditions the diagram still reads "CONDITION 1".</li><li>Execution History does not take over the list's module/department filter (follow-up per developer).</li><li>NDC-3202 (no SLA starts on new tickets) still blocks NDC-3136.</li></ul></div><div class="card"><h2>Cleanup plan</h2><ul>${li(cleanup)}</ul></div></body></html>`);
console.log('ok');
