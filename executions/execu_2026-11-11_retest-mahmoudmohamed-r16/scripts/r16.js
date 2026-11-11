// Round 16 Plane draft. node r16.js → plane-draft.html/json. node r16.js --post [NDC-xxxx,...] → comment + state + attach (only tickets still in Ready For Test).
const fs = require('fs'), path = require('path'); const { execFileSync } = require('child_process');
const RUN = path.join(__dirname, '..'); const ANN = path.join(RUN, 'screenshots/annotated');
const DONE = '11f2d31f-9d01-4463-a1de-ce99521b97aa', BUG = '34a7f4b6-7207-4955-b927-0d8d1dd3c666', RFT = 'f5299bf6-0dfc-4d40-9223-da9c1fab09b1';
const ENV = 'Environment: staging-desk.taviportal.com, tenant NDC-Staging, Edge; account: ndc-staging-owner (Tenant Owner)';
const T = [
 { k: 'NDC-2635', id: 'a3451c13-dda3-4367-a220-721ae246741e', v: 'PARTIAL', state: BUG, img: ['NDC-2635-retest-PARTIAL-vs-zoho.png'],
   method: 'Manual browser + API; Zoho Desk checked live (one test task created on a Tech ticket, then deleted and purged)',
   checked: [
    '1. Department on every activity: Department* is required, and the Task Owner list now follows it (QA AS6 Dept B → its 2 agents; Sales → its 4 agents). An agent outside the department gets 403 on its activities (NDC-2830, Done). Fixed.',
    '3. Delete in the bulk bar: More › Delete → "Delete 2 records? … move to the recycle bin"; both tasks deleted. Fixed.'],
   failing: [
    '2. Delete on the task / call / event page: the task page still has only Start timer and Mark as Complete, no Delete. Zoho (seen live): task page ••• › Edit / Delete / Open in New Tab; Delete moves it to the recycle bin.',
    '4. Activity count on the ticket: ticket #2878 with 3 tasks shows "ACTIVITY" without a count (0 CONVERSATION and 0 TIME ENTRY do have counts); GET /desk/tickets/{id} counts = replies, comments, attachments, time_entries. Zoho (seen live): the ticket tab reads "1 ACTIVITY" after adding one task.',
    '5. Ticket-activities API and filters: /desk/tickets/{id}/activities, /desk/activities, /stats, /reports, /count and /desk/tasks/count all return 404. Zoho (API docs): GET /tickets/{id}/activities, dueDate filters, /tasks/count.'] },
 { k: 'NDC-2844', id: '23624b84-1f63-493f-a099-4aeb5ecc4eaf', v: 'PASS', state: DONE, img: ['NDC-2844-retest-PASS.png'], method: 'Manual browser + API',
   checked: [
    'Ticket #2880 created by API (Tech, contact "mahmoud mohamed" with an email): Reply All and Reply → Recipients = the contact; Cc empty.',
    'Sent one reply, reloaded, Reply All again → Recipients still the contact, Cc empty (the contact is no longer moved to Cc).',
    'Ticket #2881 created with the New Ticket form (same contact): Reply All and Reply → Recipients = the contact.',
    'Control: inbound-email ticket #2568 → Recipients = the sender.'] },
 { k: 'NDC-2846', id: '741976bd-e8e0-40b9-885b-9747a2d3c286', v: 'PASS', state: DONE, img: ['NDC-2846-retest-PASS.png'], method: 'Manual browser + API',
   checked: [
    'Setup › Data Administration › Export › Contacts, CSV, all records → 18 records, Completed.',
    'Audit Log: "ndc-staging-owner exported 18 Contacts (CSV)" and "ndc-staging-owner downloaded the export 18 Contacts (CSV)" — right object and count, each once.',
    'No "exported the audit log", no "added a Desk data export named 0 Contacts", no "status from blank value to completed".'] },
 { k: 'NDC-2845', id: '68fb0529-6366-484c-a700-76d8e6196a8d', v: 'PASS', state: DONE, img: ['NDC-2845-retest-PASS.png'], method: 'Manual browser + API',
   checked: [
    'Contacts list › Select all › Update › Title on 2 contacts → both changed; Bulk Actions Log: "Mass update · Contacts · 2 · 2 · 0 · Completed".',
    'Same on 51 contacts → 51 changed (checked by API); log: "Mass update · Contacts · 51 · 51 · 0 · Completed".',
    'Observation (not a fail): the mass update runs from the open browser tab ("0 of 51 done"). A first 51-record run was cut off when the browser closed: 16 contacts changed, and that partial run is not in the Bulk Actions Log.'] },
 { k: 'NDC-2840', id: '47aaacbf-eb10-414a-9b84-d53375ba1638', v: 'PASS', state: DONE, img: ['NDC-2840-retest-PASS.png'], method: 'Manual browser + API',
   checked: [
    'Create Ticket › Ticket Owner picker: agents plus a pinned "Mark as Unassigned — The department\'s assignment rules will route it".',
    'Chose it (QA AS6 Dept B, Status Open) → field shows "Unassigned" → saved as #2889 with no owner (API), still unassigned after 20 s (the tenant has no round-robin rules; routing itself is NDC-2813, Done).'] },
 { k: 'NDC-2805', id: '1c1ed2bc-137f-4b31-91a0-a2ae1b0110cc', v: 'PARTIAL', state: BUG, img: ['NDC-2805-retest-PARTIAL.png'], method: 'API + layout editor (read-only)',
   checked: [
    '2. Old skills tables: not checkable from outside (old endpoints return 404).',
    '3. Upper-case department id on rename/delete: not checkable (needs an imported ticket with an upper-case id).',
    '4. Restored departments: not re-run. A new department has no skill types, and departments deleted before the 4 Nov backfill can\'t be made. The 9 Nov check (a department deleted and restored kept its skill) stands.'],
   failing: [
    '1. Where-used: GET /desk/skills/{id}/usage still lists assignment rules, workflow rules, skills, agents and open tickets only; no approval-process section.',
    '5. Modules & Fields note (Tickets › Skills › Edit Properties › ADVANCED): still only "Desk manages these options. Add, rename and delete skills for each department on the Skills page." It does not say that the API name and the 10-item limit are locked; the 10-item limit is not shown anywhere.'] },
];
const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;');
const html = t => `<p><strong>Retest ${t.v} — 11 Nov 2026</strong></p><p>${esc(ENV)}<br>Method: ${esc(t.method)}</p>` +
  `<p><strong>Checked:</strong></p><ul>${t.checked.map(c => `<li>${esc(c)}</li>`).join('')}</ul>` +
  (t.failing ? `<p><strong>Still failing:</strong></p><ul>${t.failing.map(c => `<li>${esc(c)}</li>`).join('')}</ul>` : '') +
  `<p>Evidence: ${t.img.join(', ')}</p>`;
const draft = T.map(t => ({ ticket: t.k, id: t.id, verdict: t.v, state: t.state === DONE ? 'Done' : 'Bug', attach: t.img, comment_html: html(t) }));
fs.writeFileSync(path.join(RUN, 'plane-draft.json'), JSON.stringify(draft, null, 1));
const img = f => 'data:image/png;base64,' + fs.readFileSync(path.join(ANN, f)).toString('base64');
fs.writeFileSync(path.join(RUN, 'plane-draft.html'), `<!doctype html><html><head><meta charset="utf-8"><title>Plane draft r16</title><style>body{font:14px/1.5 "Segoe UI",sans-serif;max-width:1100px;margin:24px auto;color:#111}section{border:1px solid #d1d5db;border-radius:8px;padding:16px;margin:16px 0}h2{margin:0 0 6px}.s{font-weight:700;padding:2px 8px;border-radius:8px;color:#fff}.Done{background:#16a34a}.Bug{background:#dc2626}.c{background:#f9fafb;border:1px solid #e5e7eb;padding:8px 14px;border-radius:6px}img{max-width:100%;border:1px solid #e5e7eb;margin-top:8px}</style></head><body>
<h1>Plane draft — retest round 16 (MahmoudMohamed, 11 Nov 2026)</h1><p>6 tickets: 4 → Done, 2 → Bug. Each gets the comment below and its image. Nothing is posted until approved.</p>
${draft.map(d => `<section><h2>${d.ticket} <span class="s ${d.state}">→ ${d.state}</span> (${d.verdict})</h2><div class="c">${d.comment_html}</div>${d.attach.map(f => `<img src="${img(f)}">`).join('')}</section>`).join('')}
<section><h2>Cleanup after posting</h2><p>Desk (from ledger.md): tickets QA RT16 2635/2844 API/2844 form/2840; task A; contacts QA RT16 2845 small 01–02 + big 01–51; department QA RT16 2805 dept; then purge QA RT16 items from the Desk recycle bin (other items untouched). Zoho: already cleaned. Delete the saved TAVI session file.</p></section></body></html>`);
console.log('draft written', draft.length);
if (process.argv[2] !== '--post') return;
const only = (process.argv[3] || '').split(',').filter(Boolean);
(async () => {
  const rows = fs.readFileSync('C:/Users/Dell/Downloads/secret-key-1793537440144.csv', 'utf8').trim().split(/\r?\n/).map(l => l.split(',').map(x => x.replace(/"/g, '').trim()));
  const H = { 'X-API-Key': rows[1][rows[0].indexOf('Secret key')], 'Content-Type': 'application/json' };
  const API = 'https://api.plane.so/api/v1/workspaces/ahmed-hegazy/projects/efce4d84-5876-4015-b472-2efca7ad73f3/work-items/';
  for (const t of T) { if (only.length && !only.includes(t.k)) continue; const d = draft.find(x => x.ticket === t.k);
    const w = await (await fetch(API + t.id + '/', { headers: H })).json(); if (w.state !== RFT) { console.log(t.k, 'SKIPPED — not in Ready For Test'); continue; }
    const c = await fetch(API + t.id + '/comments/', { method: 'POST', headers: H, body: JSON.stringify({ comment_html: d.comment_html }) });
    const s = await fetch(API + t.id + '/', { method: 'PATCH', headers: H, body: JSON.stringify({ state: t.state }) });
    console.log(t.k, 'comment', c.status, 'state→' + d.state, s.status);
    for (const f of t.img) console.log(execFileSync('node', [path.join(__dirname, 'plane-attach.js'), t.id, path.join(ANN, f)]).toString().trim());
  }
})().catch(e => { console.error('ERR', e.message); process.exit(1); });
