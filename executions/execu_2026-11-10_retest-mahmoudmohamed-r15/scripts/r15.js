// Round 15 (10 Nov 2026): report.html + plane-draft.html/json + attach-map.json from specs/*.json, notes, ledgers.
// Usage: node r15.js                 → build report + draft only (no Plane call)
//        node r15.js <token.csv> --post → comment + state for approved tickets (skips tickets no longer in Ready For Test)
// Token read by column "Secret key", never printed.
const fs = require('fs'); const path = require('path'); const RUN = path.join(__dirname, '..');
const [csv, flag] = process.argv.slice(2); const POST = flag === '--post';
const PID = 'efce4d84-5876-4015-b472-2efca7ad73f3'; const API = `https://api.plane.so/api/v1/workspaces/ahmed-hegazy/projects/${PID}`;
const DONE = '11f2d31f-9d01-4463-a1de-ce99521b97aa', BUG = '34a7f4b6-7207-4955-b927-0d8d1dd3c666', RFT = 'f5299bf6-0dfc-4d40-9223-da9c1fab09b1';
const esc = s => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;');
const VC = { PASS: '#16a34a', FAIL: '#dc2626', PARTIAL: '#d97706', BLOCKED: '#6b7280', INFO: '#2563eb', DECISION: '#7c3aed' };
const badge = v => `<span class="v" style="background:${VC[v] || '#6b7280'}">${esc(v)}</span>`;
const META = JSON.parse(fs.readFileSync(path.join(RUN, 'out', 'rft.json'), 'utf8'));
const PR = { Urgent: 0, High: 1, Medium: 2, Low: 3 };
const order = META.slice().sort((a, b) => (a.m === b.m ? 0 : a.m === 'CRM' ? -1 : 1) || PR[a.p] - PR[b.p] || a.f.localeCompare(b.f) || a.seq - b.seq);
const SUM = {
  2729: 'The CRM side is fixed: on blueprint AEX-01 the Create task, Meeting and Call actions have no module picker, the owner is set only by Assign to, and the pick lists start on their first option. The Desk blueprint still shows the problems from the 5 Nov retest: a new Field update still shows "Value" as its value (Status, Skills), and a new Create task has Department and Team as plain text boxes instead of pick lists. Nothing was saved.',
  2806: 'Global Sets now cover create, convert, clone, values (add, rename, colour, replace, move to unused, restore), association with mapping, safeguards and permissions. Two scope items are not met: replacing a value used in a custom view filter is refused (409 "Change or remove it in those views first") instead of being carried over to the view, and the Used In dialog says reports are not listed yet.',
  2205: 'On Edit and Field Changed rules no longer run when a ticket is created. Three new tickets (API with and without a department, and the New Ticket form) got only the On Create tag. Later edits ran On Edit, and a subject change ran Field Changed too. The automation test failed on a changed form locator (not the bug), so I retested by API and on screen.',
  2204: 'Owner Assignment › Roles now lists the Desk roles (CEO, Manager), not CRM profiles. A role round-robin rule rotated 3 tickets to 3 different users. Observation: the Desk Agents page shows different roles for these users than the role data the rule uses, so it is not clear which users are in the "CEO" pool.',
  2830: 'An agent outside a department can no longer see or open that department\'s tasks and calls. The HR task, call and ticket return 403 for the agent and are left out of the activity lists and search. Opening the HR task link shows "Permission denied." The Customer Support control task is still visible.',
  2828: 'The user list now pages and filters: page, pageSize/page_size, limit/offset, search and status all work, with total_count and next_cursor in the meta. Walking all 201 users by page and by cursor returns 201 unique users, with no 200-row cap.',
  2825: 'Updating a ticket now restarts an SLA set to run on Ticket Update. After a priority change, the response and resolution due times moved to update time + 30 min / 2 h, and History shows "SLA reapplied". Automation: SlaRuntimeTest.resetOnTrigger and the new resetOnPriorityUpdate test (tag NDC-2825) pass.',
  2815: 'The Standard ticket layout can be saved. Saving keeps the Detail view (3 sections, including resolution, CRM deal and contract), and a label rename is saved with it.',
  2816: 'The editor now saves the layout first and the label only after the layout is saved. When the layout save is refused (simulated in the browser, because NDC-2815 is fixed), it shows "Layout not saved", sends no label change and keeps the old label.',
  2810: 'Deleting a synced contact in Desk now unlinks it without a failure, and records in the Desk recycle bin are counted as Ignored. Still failing: deleting the contact in CRM puts it in the Failure Log as "Needs attention · The CRM record was deleted.", and Sync all customers reports 1 failure for "B04", a record that is in neither app.',
  2809: 'The Desk Audit Log now shows only Desk and IAM entries; today\'s CRM actions are not listed or found by search. Security observation: the same audit API called with the Desk app key but without the app_key filter still returns CRM entries, so the filter is applied by the screen only.',
  2808: 'Switching templates now clears the previous template\'s values: Channel, Language, Classification and Category go back to Select, and "No template" clears everything the template set. Values the agent entered by hand (subject, priority, channel) are kept.',
  2802: 'The "Use template…" dropdown now shows the chosen template, still shows it after the message has gone, follows a switch, and can be cleared with "No template".',
  2796: 'A department\'s default layout is now picked when the department is chosen, with its own fields. Change Layout lists only that department\'s layouts plus the shared ones (4 instead of all 11).',
  2794: 'Same as 4–6 Nov: a rule that assigns to a team and an agent of that team gives the ticket to the agent, then History shows "Team was updated: QA RT15 2794 team → blank", and the ticket has no team.',
  2827: 'Tickets now have a Skills panel. Associating "billing" saved it, and it is still listed after a reload. A department without active skills shows a clear message.',
  2826: 'SLA target conditions now offer number and date operators. "Amount greater than 1000" and "due date after 2027-01-01" apply the SLA only to matching tickets.',
  2823: 'The ticket list has a "Select all" checkbox. One click selects the loaded rows ("50 of 433 selected — scroll to load the rest of this view") and shows the bulk actions. After scrolling, clicking again selects 100 of 433. Accepted by QA (10 Nov) as matching Zoho, whose checkbox selects the tickets shown on the page.',
  2831: 'The reply composer now accepts addresses on reserved and test domains (example.com, example.org, .test, .example) and real ones. It still refuses malformed addresses such as "qa.rt2636@".',
  2807: 'Mass delete (450 records) and deleting a selection in the Recycle Bin both finish after you leave the page. Mass update does not: leaving the page 1 s after starting changed only 6 of 200 records, with no job and no resume. Empty Bin, the ticket\'s main path, was not run because the bin also holds other people\'s items.',
  2630: 'A failed send is now recorded honestly: the API returns 422 MAIL_SEND_FAILED, the Emails tab shows "Not sent… Failed" with Retry, and the timeline has no Email sent entry. Still open: Compose Email opens with no "can\'t send" notice and Send enabled, although the sendability check already says the sender can\'t send. The message dialog also shows a "Sent" chip next to "Failed".',
  1948: 'A user denied Timeline Visibility can add a note: no "Posting…", toast "Note added", and the note is still listed after a reload. The policy was set back to Allow after the test.',
  2136: 'No improvement against the 1.5 s target for the first page: Leads p50 4.3 s / p95 13.5 s; Transactions p95 9.2 s and 19.9 s on two runs.',
  2137: 'Kanban cards never load: every column shows "Could not load these records" because all 134 column requests return 500. Any records request with skip_total=true returns 500 (Transactions, Leads, Tasks). Column headers alone take p95 19.1 s.',
};
const spec = s => { const f = path.join(__dirname, 'specs', 'NDC-' + s + '.json'); return fs.existsSync(f) ? JSON.parse(fs.readFileSync(f, 'utf8')) : null; };
const target = v => v === 'PASS' || v === 'NOT A BUG' ? 'Done' : v === 'BLOCKED' ? null : 'Bug';
const commentHtml = (m, sp) => {
  const v = sp.verdict; const still = sp.rows.filter(r => r[4] === 'FAIL' || r[4] === 'PARTIAL');
  const env = m.m === 'CRM' && m.seq !== 2729 ? 'staging-crm.taviportal.com' : m.seq === 2729 ? 'staging-crm + staging-desk.taviportal.com' : 'staging-desk.taviportal.com';
  return `<p><strong>Retest ${v} — 10 Nov 2026</strong><br>Environment: ${env}, tenant NDC-Staging, Edge; account: admin (ndc-staging-owner)${/agent|Agent/.test(sp.env) ? ' + Desk agent' : ''}<br>Method: ${esc(sp.method || 'Screen and API')}</p>`
    + `<p>${esc(SUM[m.seq])}</p><p>Checked:</p><ul>${sp.rows.map(r => `<li>${esc(r[1])} → ${esc(r[3])} <strong>[${esc(r[4])}]</strong></li>`).join('')}</ul>`
    + (still.length ? `<p>Still failing:</p><ul>${still.map(r => `<li>${esc(r[1])}: expected ${esc(r[2])}, actual ${esc(r[3])}</li>`).join('')}</ul>` : '')
    + `<p>Evidence: ${esc(sp.out)} (attached)</p>`;
};
(async () => {
  const missing = order.filter(m => !spec(m.seq)); if (missing.length) console.log('MISSING specs:', missing.map(m => m.seq).join(' '));
  const items = order.filter(m => spec(m.seq)).map(m => ({ m, sp: spec(m.seq) }));
  // ---- report.html
  const cnt = v => items.filter(i => i.sp.verdict === v).length;
  const rows = items.map(({ m, sp }) => `<tr><td>${m.p}</td><td>${m.m}</td><td>${esc(m.f)}</td><td><a href="#t${m.seq}"><b>NDC-${m.seq}</b></a></td><td>${esc(sp.title)}</td><td>${badge(sp.verdict)}</td><td>${target(sp.verdict) ? '→ ' + target(sp.verdict) + ' + comment + image' : 'comment + image'}</td></tr>`).join('');
  const cards = items.map(({ m, sp }) => { const img = path.join(RUN, 'screenshots', 'annotated', sp.out); const b64 = fs.existsSync(img) ? fs.readFileSync(img).toString('base64') : '';
    return `<section id="t${m.seq}"><h3>NDC-${m.seq} · ${esc(sp.title)} ${badge(sp.verdict)}</h3><p class="meta">${esc(sp.env)}</p><p>${esc(SUM[m.seq])}</p>
    <div class="wrap"><table class="t"><tr><th>#</th><th>Check</th><th>Expected</th><th>Now</th><th>Result</th></tr>${sp.rows.map(r => `<tr><td>${esc(r[0])}</td><td>${esc(r[1])}</td><td>${esc(r[2])}</td><td>${esc(r[3])}</td><td>${badge(r[4])}</td></tr>`).join('')}</table></div>
    ${b64 ? `<img src="data:image/png;base64,${b64}" alt="NDC-${m.seq} evidence">` : '<p class="n">image missing</p>'}<p class="n">${esc(sp.out)}</p></section>`; }).join('');
  const ledger = fs.readFileSync(path.join(RUN, 'ledger.md'), 'utf8') + '\n\n' + fs.readFileSync(path.join(RUN, 'ledger-crm.md'), 'utf8');
  const css = `:root{--bg:#f6f7f9;--fg:#111827;--mut:#4b5563;--card:#fff;--bd:#e5e7eb}:root[data-theme="dark"]{--bg:#0f172a;--fg:#e5e7eb;--mut:#9ca3af;--card:#111827;--bd:#374151}@media (prefers-color-scheme:dark){:root:not([data-theme="light"]){--bg:#0f172a;--fg:#e5e7eb;--mut:#9ca3af;--card:#111827;--bd:#374151}}
body{margin:0;background:var(--bg);color:var(--fg);font:14px/1.5 "Segoe UI",system-ui,sans-serif}main{max-width:1240px;margin:0 auto;padding:16px}h1{font-size:22px}h2{margin-top:28px;font-size:18px}
.kpi{display:flex;gap:12px;flex-wrap:wrap}.kpi div{background:var(--card);border:1px solid var(--bd);border-radius:8px;padding:10px 16px;min-width:110px}.kpi b{font-size:22px;display:block}
table{border-collapse:collapse;width:100%;background:var(--card)}td,th{border:1px solid var(--bd);padding:6px 8px;text-align:left;vertical-align:top}th{background:var(--bg)}
.v{color:#fff;border-radius:4px;padding:1px 7px;font-size:12px;font-weight:600;white-space:nowrap}section{background:var(--card);border:1px solid var(--bd);border-radius:8px;padding:12px 16px;margin:16px 0}
section img{max-width:100%;border:1px solid var(--bd);margin-top:8px}.meta,.n{color:var(--mut);font-size:13px}.t td{font-size:13px}pre{white-space:pre-wrap;background:var(--card);border:1px solid var(--bd);padding:10px;font-size:12px}.wrap{overflow-x:auto}a{color:inherit}`;
  fs.writeFileSync(path.join(RUN, 'report.html'), `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Retest round 15</title><style>${css}</style></head><body><main>
<h1>Retest round 15 — MahmoudMohamed · NDC · 10 Nov 2026</h1><p class="meta">NDC-Staging (staging-desk / staging-crm), Edge headless + API, admin ndc-staging-owner; Desk agent Customer Experience Specialists 2; CRM user Mahmoud Samy (NDC-1948).</p>
<div class="kpi"><div><b>${items.length}</b>tickets</div><div><b style="color:#16a34a">${cnt('PASS')}</b>pass → Done</div><div><b style="color:#d97706">${cnt('PARTIAL')}</b>partial → Bug</div><div><b style="color:#dc2626">${cnt('FAIL')}</b>fail → Bug</div></div>
<h2>Results</h2><div class="wrap"><table><tr><th>Priority</th><th>Module</th><th>Feature</th><th>Ticket</th><th>Title</th><th>Verdict</th><th>Proposed Plane action</th></tr>${rows}</table></div>
<h2>Observations</h2><ul>
<li><b>NDC-2809 (security):</b> the audit API without app_key, called with the Desk app key, returns CRM entries. The Desk screen filters them, but the API doesn't.</li>
<li><b>NDC-2204:</b> the Desk Agents page roles and the role data used by role round-robin disagree for several users.</li>
<li><b>NDC-2205:</b> the workflow rules API accepted AddTags rules whose tag ids were not ids (201, active). I deleted them at once.</li>
<li><b>NDC-2815:</b> a save from an editor that was opened before another save is accepted (no version check, the last save wins).</li>
<li><b>NDC-2136:</b> when the last-used Leads view is a private view, the list opens on "Choose a view" with 0 records.</li>
<li><b>NDC-2823:</b> decided by QA on 10 Nov: Select all covering the loaded rows (with scroll) is accepted.</li></ul>
<h2>Per ticket</h2>${cards}<h2>Test data and changes (cleanup after Plane updates)</h2><pre>${esc(ledger)}</pre>
<h2>Security notes</h2><ul><li>No passwords or tokens printed; credential files were read by column, one sign-in per account (CRM owner re-signed once after expiry).</li><li>Evidence is attached through Plane's own API with the user's key, never a public host.</li><li>Saved sign-in sessions live in the scratchpad and are deleted at cleanup.</li></ul>
</main></body></html>`);
  // ---- plane draft
  const draft = items.map(({ m, sp }) => ({ ticket: 'NDC-' + m.seq, id: m.id, verdict: sp.verdict, state: target(sp.verdict), attach: sp.out, comment_html: commentHtml(m, sp) }));
  fs.writeFileSync(path.join(RUN, 'plane-draft.json'), JSON.stringify(draft, null, 1));
  fs.writeFileSync(path.join(RUN, 'attach-map.json'), JSON.stringify({ dir: path.join(RUN, 'screenshots', 'annotated').split(path.sep).join('/'), files: Object.fromEntries(draft.map(d => [d.attach, d.id])) }, null, 1));
  fs.writeFileSync(path.join(RUN, 'plane-draft.html'), `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Plane draft r15</title><style>${css}.c{border-left:4px solid var(--bd);padding:4px 12px;margin:8px 0}</style></head><body><main>
<h1>Plane draft — round 15 (10 Nov 2026)</h1><p>Exactly what will be posted. ${draft.filter(d => d.state === 'Done').length} → Done, ${draft.filter(d => d.state === 'Bug').length} → Bug. Each ticket gets the comment below plus its annotated image (attached through the Plane API). Assignees, priority and labels are not changed. Tickets that are no longer in Ready For Test at posting time are skipped.</p>
<p><b>Cleanup after posting:</b> delete or restore everything in the ledger (QA RT15 tickets, contacts, tasks, calls, rules, SLA policies, team, global sets and fields, leads, view, drafts, QA recycle-bin batch); leave non-QA recycle-bin items alone; delete the saved sign-in sessions.</p>
${draft.map(d => `<section><h3>${d.ticket} ${badge(d.verdict)} → ${d.state || 'no state change'}</h3><p class="n">Attach: ${esc(d.attach)}</p><div class="c">${d.comment_html}</div></section>`).join('')}</main></body></html>`);
  console.log('report.html + plane-draft.html/json + attach-map.json built,', items.length, 'tickets');
  if (!POST) return;
  const rows0 = fs.readFileSync(csv, 'utf8').split(/\r?\n/).filter(Boolean).map(l => l.split(',').map(v => v.replace(/^"|"$/g, '')));
  const H = { 'X-API-Key': rows0[1][rows0[0].indexOf('Secret key')], 'Content-Type': 'application/json' };
  const call = async (mt, p, body) => { for (let i = 0; i < 6; i++) { let r; try { r = await fetch(API + p, { method: mt, headers: H, body: body && JSON.stringify(body) }); } catch (e) { await new Promise(s => setTimeout(s, 8000)); continue; } if (r.status === 429) { console.log('429 — stopping'); process.exit(2); } if (r.status >= 500) { await new Promise(s => setTimeout(s, 10000)); continue; } return { s: r.status, j: await r.json().catch(() => null) }; } return { s: 'ERR' }; };
  const only = process.argv[4] ? process.argv[4].split(',') : null;
  for (const d of draft) {
    if (only && !only.includes(d.ticket)) continue;
    const w = await call('GET', `/work-items/${d.id}/`); if (w.j?.state !== RFT) { console.log(d.ticket, 'SKIPPED — not in Ready For Test'); continue; }
    const c = await call('POST', `/work-items/${d.id}/comments/`, { comment_html: d.comment_html });
    const s = d.state ? await call('PATCH', `/work-items/${d.id}/`, { state: d.state === 'Done' ? DONE : BUG }) : { s: '-' };
    console.log(d.ticket, 'comment', c.s, 'state→' + d.state, s.s);
  }
})().catch(e => console.log('ERR', String(e.message).replace(/plane_api_\w+/g, '<t>')));
