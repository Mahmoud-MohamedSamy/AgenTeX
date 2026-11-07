// Round 12 (4–6 Nov 2026) report: one self-contained HTML (images embedded) built from specs-r12/*.json + the order below.
const fs = require('fs'); const path = require('path'); const RUN = path.join(__dirname, '..');
const order = [
  ['NDC-2275', 'Urgent', 'Desk', 'Assignment Rules'],
  ['NDC-1948', 'High', 'CRM', 'Notes & Timeline'], ['NDC-2630', 'High', 'CRM', 'Email'],
  ['NDC-2801', 'High', 'Desk', 'Tickets'], ['NDC-2803', 'High', 'Desk', 'Ticket Templates'], ['NDC-2791', 'High', 'Desk', 'Layouts'], ['NDC-2796', 'High', 'Desk', 'Layouts'],
  ['NDC-2794', 'High', 'Desk', 'Workflow Rules'], ['NDC-2774', 'High', 'Desk', 'Business Hours'], ['NDC-2764', 'High', 'Desk', 'Blueprint'], ['NDC-2754', 'High', 'Desk', 'Blueprint'],
  ['NDC-2773', 'Medium', 'CRM', 'Invitation'], ['NDC-2800', 'Medium', 'Desk', 'Agents'], ['NDC-2799', 'Medium', 'Desk', 'Blueprint'], ['NDC-2752', 'Medium', 'Desk', 'Skills'],
  ['NDC-2136', 'Low', 'CRM', 'Custom Views'], ['NDC-2137', 'Low', 'CRM', 'Kanban'], ['NDC-2643', 'Low', 'Desk', 'Activities'], ['NDC-2776', 'Low', 'Desk', 'Company'], ['NDC-2399', 'Low', 'Desk', 'CRM ⇄ Desk']];
const carried = new Set(['NDC-1948', 'NDC-2764', 'NDC-2773', 'NDC-2136']);
const action = v => ({ PASS: '→ Done + comment', FAIL: '→ Bug + comment', PARTIAL: '→ Bug + comment', BLOCKED: 'comment only' }[v] || '?');
const VC = { PASS: '#16a34a', FAIL: '#dc2626', PARTIAL: '#d97706', BLOCKED: '#6b7280', INFO: '#2563eb' };
const esc = s => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;');
const notes = fs.readFileSync(path.join(RUN, 'notes-r12.md'), 'utf8'); const ledger = fs.readFileSync(path.join(RUN, 'ledger.md'), 'utf8');
const rows = [], cards = [];
for (const [id, pri, mod, feat] of order) {
  const spec = JSON.parse(fs.readFileSync(path.join(__dirname, 'specs-r12', id + '.json'), 'utf8'));
  const img = path.join(RUN, 'screenshots', 'annotated', spec.out); const b64 = fs.existsSync(img) ? fs.readFileSync(img).toString('base64') : '';
  const note = (notes.split('\n').find(l => l.startsWith('| ' + id + ' |')) || '').split('|').slice(3).join('|').trim();
  rows.push(`<tr><td>${pri}</td><td>${mod}</td><td>${esc(feat)}</td><td><b>${id}</b>${carried.has(id) ? ' <span class="c">4 Nov</span>' : ''}</td><td>${esc(spec.title)}</td><td><span class="v" style="background:${VC[spec.verdict]}">${spec.verdict}</span></td><td>${action(spec.verdict)}</td></tr>`);
  cards.push(`<section id="${id}"><h3>${id} · ${esc(spec.title)} <span class="v" style="background:${VC[spec.verdict]}">${spec.verdict}</span></h3><p class="meta">${esc(spec.env)} · ${esc(spec.date)}</p>
  <table class="t"><tr><th>Check</th><th>Expected</th><th>Now</th><th>Result</th></tr>${spec.rows.map(r => `<tr><td>${esc(r[1])}</td><td>${esc(r[2])}</td><td>${esc(r[3])}</td><td><span class="v" style="background:${VC[r[4]] || '#6b7280'}">${r[4]}</span></td></tr>`).join('')}</table>
  <details><summary>Run notes</summary><p class="n">${esc(note)}</p></details>${b64 ? `<img src="data:image/png;base64,${b64}" alt="${id} evidence">` : ''}</section>`);
}
const cnt = v => order.filter(([id]) => JSON.parse(fs.readFileSync(path.join(__dirname, 'specs-r12', id + '.json'))).verdict === v).length;
const html = `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Retest round 12</title><style>
:root{--bg:#f6f7f9;--fg:#111827;--mut:#4b5563;--card:#fff;--bd:#e5e7eb}@media (prefers-color-scheme:dark){:root{--bg:#0f172a;--fg:#e5e7eb;--mut:#9ca3af;--card:#111827;--bd:#374151}}
body{margin:0;background:var(--bg);color:var(--fg);font:14px/1.5 "Segoe UI",system-ui,sans-serif}main{max-width:1240px;margin:0 auto;padding:16px}
h1{font-size:22px;margin:8px 0}h2{margin-top:28px}.kpi{display:flex;gap:12px;flex-wrap:wrap}.kpi div{background:var(--card);border:1px solid var(--bd);border-radius:8px;padding:10px 16px}
.kpi b{font-size:22px;display:block}table{border-collapse:collapse;width:100%;background:var(--card)}td,th{border:1px solid var(--bd);padding:6px 8px;text-align:left;vertical-align:top}
.v{color:#fff;border-radius:4px;padding:1px 7px;font-size:12px;font-weight:600;white-space:nowrap}.c{font-size:11px;color:var(--mut)}section{background:var(--card);border:1px solid var(--bd);border-radius:8px;padding:12px 16px;margin:16px 0}
section img{max-width:100%;border:1px solid var(--bd);margin-top:8px}.meta,.n{color:var(--mut);font-size:13px}.t td{font-size:13px}pre{white-space:pre-wrap;background:var(--card);border:1px solid var(--bd);padding:10px;font-size:12px}
.wrap{overflow-x:auto}</style></head><body><main>
<h1>Retest round 12 — MahmoudMohamed · NDC · 4–6 Nov 2026</h1>
<p class="meta">staging-crm / staging-desk.taviportal.com · tenant NDC-Staging · Edge (headless) + API · owner account, plus Desk Agent fedelav803 where a second user was needed. Tickets marked "4 Nov" were tested on 4 Nov with no developer change since (carried over at Gate 1).</p>
<div class="kpi"><div><b>${order.length}</b>tickets</div><div><b style="color:#16a34a">${cnt('PASS')}</b>pass → Done</div><div><b style="color:#dc2626">${cnt('FAIL')}</b>fail → Bug</div><div><b style="color:#d97706">${cnt('PARTIAL')}</b>partial → Bug</div><div><b style="color:#6b7280">${cnt('BLOCKED')}</b>blocked → comment</div></div>
<h2>Results</h2><div class="wrap"><table><tr><th>Priority</th><th>Module</th><th>Feature</th><th>Ticket</th><th>Title</th><th>Verdict</th><th>Proposed Plane action</th></tr>${rows.join('')}</table></div>
<h2>Observations</h2><ul>
<li><b>New, CRM (found in NDC-2137):</b> any records list call with <code>skip_total=true</code> returns 500 INTERNAL_ERROR (Leads, Deals, Contacts, Tasks). The Kanban board sends it on every column, so cards never load. Candidate for its own bug.</li>
<li><b>NDC-2275:</b> round robin never runs on Ticket Create — tickets created by an agent (form with owner cleared, or API) get the creator as owner. Assignment works on update.</li>
<li><b>NDC-2754:</b> a required Share item accepts a share to the ticket's own department (adds nothing) and the transition runs.</li>
<li><b>NDC-2803 (API only):</b> a ticket template can be saved with a layout of another department, or with a field its layout doesn't have.</li>
<li><b>NDC-2791:</b> every layout save also PATCHes the labels of the system "email" field; old per-layout "required" flags from 3–4 Nov are stored but not applied.</li>
<li><b>Environment:</b> the shared owner sessions were revoked several times by other sign-ins; one sign-in per app was repeated when that happened.</li></ul>
<h2>Per ticket</h2>${cards.join('')}
<h2>Test data and changes (to clean up after Gate 2)</h2><pre>${esc(ledger)}</pre>
<h2>Security notes</h2><ul><li>No passwords or tokens were printed; sign-in used the credentials file by column. The NDC-2754 rating-link step would have saved a link to the scratchpad only when present (it was disabled, nothing saved).</li><li>A test reply on a control ticket was saved as a draft (send=false) to qa.rt12@example.com.</li></ul>
</main></body></html>`;
fs.writeFileSync(path.join(RUN, 'report.html'), html); console.log('report.html', Math.round(html.length / 1024), 'KB');
