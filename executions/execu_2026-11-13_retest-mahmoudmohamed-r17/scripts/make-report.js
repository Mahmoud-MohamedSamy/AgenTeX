// Round 17 (13 Nov 2026): self-contained report.html from specs/*.json + notes.md + ledger.md
const fs = require('fs'); const path = require('path'); const RUN = path.join(__dirname, '..');
const order = [
  ['NDC-2806', 'Urgent', 'CRM', 'Global Sets'], ['NDC-2729', 'Urgent', 'CRM', 'Blueprint'],
  ['NDC-2865', 'High', 'CRM', 'Global Sets'], ['NDC-2866', 'High', 'CRM', 'Global Sets'], ['NDC-2917', 'High', 'CRM', 'Global Sets'], ['NDC-2918', 'High', 'CRM', 'Global Sets'],
  ['NDC-2807', 'High', 'CRM', 'Bulk Operations'], ['NDC-2630', 'High', 'CRM', 'Email'],
  ['NDC-2867', 'Medium', 'CRM', 'Global Sets'], ['NDC-2860', 'Medium', 'CRM/Desk', 'Record Form'],
  ['NDC-2868', 'Low', 'CRM', 'Global Sets'], ['NDC-2869', 'Low', 'CRM', 'Global Sets'], ['NDC-2916', 'Low', 'CRM', 'Global Sets'], ['NDC-2919', 'Low', 'CRM', 'Global Sets'],
  ['NDC-2136', 'Low', 'CRM', 'Custom Views'], ['NDC-2137', 'Low', 'CRM', 'Custom Views (Kanban)'],
  ['NDC-2174', 'Urgent', 'Desk', 'Modules & Fields'], ['NDC-2810', 'High', 'Desk', 'CRM Integration'], ['NDC-2794', 'High', 'Desk', 'Workflow Rules'],
  ['NDC-2823', 'Medium', 'Desk', 'Tickets'], ['NDC-2635', 'Medium', 'Desk', 'Activities']];
const VC = { PASS: '#16a34a', FAIL: '#dc2626', PARTIAL: '#d97706', BLOCKED: '#6b7280', INFO: '#2563eb', DECISION: '#7c3aed' };
const decision = { 'NDC-2630': 'Decision: "Sent" chip', 'NDC-2823': 'Decision: bulk Close here or new bug', 'NDC-2917': 'Decision: rename here or new bug' };
const action = (id, v) => decision[id] || ({ PASS: '→ Done + comment + image', FAIL: '→ Bug + comment + image', PARTIAL: '→ Bug + comment + image', BLOCKED: 'comment only' }[v]);
const esc = s => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;');
const badge = v => `<span class="v" style="background:${VC[v] || '#6b7280'}">${esc(v)}</span>`;
const notes = fs.readFileSync(path.join(RUN, 'notes.md'), 'utf8'); const ledger = fs.readFileSync(path.join(RUN, 'ledger.md'), 'utf8');
const specs = Object.fromEntries(order.map(([id]) => [id, JSON.parse(fs.readFileSync(path.join(__dirname, 'specs', id + '.json'), 'utf8'))]));
const rows = [], cards = [];
for (const [id, pri, mod, feat] of order) {
  const s = specs[id]; const img = path.join(RUN, 'screenshots', 'annotated', s.out); const b64 = fs.existsSync(img) ? fs.readFileSync(img).toString('base64') : '';
  const note = (notes.split('\n').find(l => l.startsWith('| ' + id + ' |')) || '').split('|').slice(3).join('|').trim();
  rows.push(`<tr><td>${pri}</td><td>${mod}</td><td>${esc(feat)}</td><td><a href="#${id}"><b>${id}</b></a></td><td>${esc(s.title)}</td><td>${badge(s.verdict)}</td><td>${esc(action(id, s.verdict))}</td></tr>`);
  cards.push(`<section id="${id}"><h3>${id} · ${esc(s.title)} ${badge(s.verdict)}</h3><p class="meta">${esc(s.env)} · ${esc(s.date)}</p>
  <div class="dev"><b>Developer's note:</b> none on the ticket since the last QA retest.</div>
  <div class="wrap"><table class="t"><tr><th>#</th><th>Check</th><th>Expected</th><th>Now</th><th>Result</th></tr>${s.rows.map(r => `<tr><td>${esc(r[0])}</td><td>${esc(r[1])}</td><td>${esc(r[2])}</td><td>${esc(r[3])}</td><td>${badge(r[4])}</td></tr>`).join('')}</table></div>
  <details><summary>Run notes</summary><p class="n">${esc(note)}</p></details>${b64 ? `<img src="data:image/png;base64,${b64}" alt="${id} evidence">` : ''}<p class="n">Evidence file: ${esc(s.out)}</p></section>`);
}
const cnt = v => order.filter(([id]) => specs[id].verdict === v).length;
const html = `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Retest round 17</title><style>
:root{--bg:#f6f7f9;--fg:#111827;--mut:#4b5563;--card:#fff;--bd:#e5e7eb;--hl:#eff6ff}@media (prefers-color-scheme:dark){:root{--bg:#0f172a;--fg:#e5e7eb;--mut:#9ca3af;--card:#111827;--bd:#374151;--hl:#172554}}
body{margin:0;background:var(--bg);color:var(--fg);font:14px/1.5 "Segoe UI",system-ui,sans-serif}main{max-width:1240px;margin:0 auto;padding:16px}
h1{font-size:22px;margin:8px 0}h2{margin-top:28px;font-size:18px}.kpi{display:flex;gap:12px;flex-wrap:wrap;margin:14px 0}.kpi div{background:var(--card);border:1px solid var(--bd);border-radius:8px;padding:10px 16px;min-width:110px}
.kpi b{font-size:22px;display:block}table{border-collapse:collapse;width:100%;background:var(--card)}td,th{border:1px solid var(--bd);padding:6px 8px;text-align:left;vertical-align:top}th{background:var(--bg)}
.v{color:#fff;border-radius:4px;padding:1px 7px;font-size:12px;font-weight:600;white-space:nowrap}section{background:var(--card);border:1px solid var(--bd);border-radius:8px;padding:12px 16px;margin:16px 0}
section img{max-width:100%;border:1px solid var(--bd);margin-top:8px}.meta,.n{color:var(--mut);font-size:13px}.t td{font-size:13px}.dev{background:var(--hl);border-radius:6px;padding:8px 12px;margin:8px 0;font-size:13px}
pre{white-space:pre-wrap;background:var(--card);border:1px solid var(--bd);padding:10px;font-size:12px;overflow-x:auto}.wrap{overflow-x:auto}a{color:inherit}</style></head><body><main>
<h1>Retest round 17 — MahmoudMohamed · NDC · 13 Nov 2026</h1>
<p class="meta">staging-crm / staging-desk.taviportal.com · tenant NDC-Staging · Edge (headless) + API · owner ndc-staging-owner, one browser sign-in for the whole round. 21 tickets from Ready For Test (NDC-1483 and NDC-1988 left out by the user). Nothing posted to Plane yet.</p>
<div class="kpi"><div><b>${order.length}</b>tickets</div><div><b style="color:#16a34a">${cnt('PASS')}</b>pass</div><div><b style="color:#d97706">${cnt('PARTIAL')}</b>partial</div><div><b style="color:#dc2626">${cnt('FAIL')}</b>fail</div><div><b>3</b>need a decision</div></div>
<h2>Results</h2><div class="wrap"><table><tr><th>Priority</th><th>Module</th><th>Feature</th><th>Ticket</th><th>Title</th><th>Verdict</th><th>Proposed Plane action</th></tr>${rows.join('')}</table></div>
<h2>Observations</h2><ul>
<li><b>Desk bulk Close on a whole view</b> (found in NDC-2823): many <code>POST /desk/tickets/{id}/close</code> return 500 INTERNAL; the toast says "0 updated, 60 failed" although some tickets closed. One-by-one and 10-parallel API closes all succeed.</li>
<li><b>Global Sets new behaviour:</b> at most 15 set-linked pick lists per module (GLOBAL_SET_LIMIT_MODULE_FIELDS); deleted sets now go to the Recycle Bin; the Replace result lists what it changed (records, views, blueprints, dependency maps, rules).</li>
<li><b>CRM Kanban</b> on Leads and Transactions shows "Could not load these records" in every column (NDC-2137); Leads list for the owner was in Kanban mode before the round.</li>
<li><b>Automation</b> for NDC-2630 and NDC-2136 was not run: the tests sign the owner in again, which would end the round's session; the same checks were done by API / browser.</li>
<li><b>NDC-2866:</b> the rule's runtime after Replace could not be observed (no execution recorded within 40 s).</li></ul>
<h2>Tickets</h2>${cards.join('')}
<h2>Test data and cleanup ledger</h2><p class="meta">Cleanup runs once, after the Plane updates.</p><pre>${esc(ledger)}</pre>
<h2>Security notes</h2><ul><li>No password or token was printed; API calls borrowed the browser session's token (redacted in logs).</li><li>Evidence shows staff mailbox addresses that appear in the product screens (sender of the test emails).</li></ul>
</main></body></html>`;
fs.writeFileSync(path.join(RUN, 'report.html'), html); console.log('report.html', Math.round(html.length / 1024) + ' KB');
