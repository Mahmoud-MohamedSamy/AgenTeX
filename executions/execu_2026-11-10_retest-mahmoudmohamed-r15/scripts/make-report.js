// Round 14 (8 Nov 2026) report: one self-contained report.html (images embedded) from specs/*.json, notes.md, ledger.md, out/devnotes.json.
const fs = require('fs'); const path = require('path'); const RUN = path.join(__dirname, '..');
const order = [
  ['NDC-2754', 'High', 'Desk', 'Blueprint'],
  ['NDC-2811', 'High', 'Desk', 'Assignment Rules'],
  ['NDC-2812', 'Medium', 'Desk', 'Assignment Rules'], ['NDC-2813', 'Medium', 'Desk', 'Assignment Rules'], ['NDC-2814', 'Medium', 'Desk', 'Assignment Rules']];
const VC = { PASS: '#16a34a', FAIL: '#dc2626', PARTIAL: '#d97706', BLOCKED: '#6b7280', INFO: '#2563eb' };
const action = v => ({ PASS: '→ Done + comment + image', FAIL: '→ Bug + comment + image', PARTIAL: '→ Bug + comment + image', BLOCKED: 'comment only' }[v] || '?');
const esc = s => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;');
const badge = v => `<span class="v" style="background:${VC[v] || '#6b7280'}">${esc(v)}</span>`;
const notes = fs.readFileSync(path.join(RUN, 'notes.md'), 'utf8'); const ledger = fs.readFileSync(path.join(RUN, 'ledger.md'), 'utf8');
const dev = JSON.parse(fs.readFileSync(path.join(RUN, 'out', 'devnotes.json'), 'utf8'));
const specs = Object.fromEntries(order.map(([id]) => [id, JSON.parse(fs.readFileSync(path.join(__dirname, 'specs', id + '.json'), 'utf8'))]));
const rows = [], cards = [];
for (const [id, pri, mod, feat] of order) {
  const spec = specs[id]; const img = path.join(RUN, 'screenshots', 'annotated', spec.out); const b64 = fs.existsSync(img) ? fs.readFileSync(img).toString('base64') : '';
  const note = (notes.split('\n').find(l => l.startsWith('| ' + id + ' |')) || '').split('|').slice(3).join('|').trim();
  rows.push(`<tr><td>${pri}</td><td>${mod}</td><td>${esc(feat)}</td><td><a href="#${id}"><b>${id}</b></a></td><td>${esc(spec.title)}</td><td>${badge(spec.verdict)}</td><td>${action(spec.verdict)}</td></tr>`);
  cards.push(`<section id="${id}"><h3>${id} · ${esc(spec.title)} ${badge(spec.verdict)}</h3><p class="meta">${esc(spec.env)} · ${esc(spec.date)}</p>
  <div class="dev"><b>Developer's note (${esc((dev[id]?.at || '').slice(0, 16).replace('T', ' '))}):</b> ${esc(dev[id]?.text || '')}</div>
  <div class="wrap"><table class="t"><tr><th>#</th><th>Check</th><th>Expected</th><th>Now</th><th>Result</th></tr>${spec.rows.map(r => `<tr><td>${esc(r[0])}</td><td>${esc(r[1])}</td><td>${esc(r[2])}</td><td>${esc(r[3])}</td><td>${badge(r[4])}</td></tr>`).join('')}</table></div>
  <details><summary>Run notes</summary><p class="n">${esc(note)}</p></details>${b64 ? `<img src="data:image/png;base64,${b64}" alt="${id} evidence">` : ''}<p class="n">Evidence file: ${esc(spec.out)}</p></section>`);
}
const cnt = v => order.filter(([id]) => specs[id].verdict === v).length;
const html = `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Retest round 14</title><style>
:root{--bg:#f6f7f9;--fg:#111827;--mut:#4b5563;--card:#fff;--bd:#e5e7eb;--hl:#eff6ff}@media (prefers-color-scheme:dark){:root{--bg:#0f172a;--fg:#e5e7eb;--mut:#9ca3af;--card:#111827;--bd:#374151;--hl:#172554}}
body{margin:0;background:var(--bg);color:var(--fg);font:14px/1.5 "Segoe UI",system-ui,sans-serif}main{max-width:1240px;margin:0 auto;padding:16px}
h1{font-size:22px;margin:8px 0}h2{margin-top:28px;font-size:18px}.kpi{display:flex;gap:12px;flex-wrap:wrap;margin:14px 0}.kpi div{background:var(--card);border:1px solid var(--bd);border-radius:8px;padding:10px 16px;min-width:110px}
.kpi b{font-size:22px;display:block}table{border-collapse:collapse;width:100%;background:var(--card)}td,th{border:1px solid var(--bd);padding:6px 8px;text-align:left;vertical-align:top}th{background:var(--bg)}
.v{color:#fff;border-radius:4px;padding:1px 7px;font-size:12px;font-weight:600;white-space:nowrap}section{background:var(--card);border:1px solid var(--bd);border-radius:8px;padding:12px 16px;margin:16px 0}
section img{max-width:100%;border:1px solid var(--bd);margin-top:8px}.meta,.n{color:var(--mut);font-size:13px}.t td{font-size:13px}.dev{background:var(--hl);border-radius:6px;padding:8px 12px;margin:8px 0;font-size:13px}
pre{white-space:pre-wrap;background:var(--card);border:1px solid var(--bd);padding:10px;font-size:12px;overflow-x:auto}.wrap{overflow-x:auto}a{color:inherit}</style></head><body><main>
<h1>Retest round 14 — MahmoudMohamed · NDC · 8 Nov 2026</h1>
<p class="meta">staging-desk.taviportal.com · tenant NDC-Staging · Edge (headless) + API · admin ndc-staging-owner, Desk Agent fedelav803, QA AS6 agents Test User 1 (A1), Mahmoud Samy (A2), Dev Team 2 (A3). All 5 tickets were in Ready For Test with a developer note from 7–8 Nov. Plane was read through the API key (the Plane connector's sign-in had expired).</p>
<div class="kpi"><div><b>${order.length}</b>tickets</div><div><b style="color:#16a34a">${cnt('PASS')}</b>pass → Done</div><div><b style="color:#dc2626">${cnt('FAIL')}</b>fail → Bug</div><div><b style="color:#d97706">${cnt('PARTIAL')}</b>partial → Bug</div><div><b style="color:#6b7280">${cnt('BLOCKED')}</b>blocked</div></div>
<h2>Results</h2><div class="wrap"><table><tr><th>Priority</th><th>Module</th><th>Feature</th><th>Ticket</th><th>Title</th><th>Verdict</th><th>Proposed Plane action</th></tr>${rows.join('')}</table></div>
<h2>Observations</h2><ul>
<li><b>NDC-2812:</b> the developer's later note (8 Nov 14:07) says the agent-reassign and team-delete dialogs still list teams when Team Assignment is off, so the admin sees the refusal only after choosing a team. The server refuses correctly (checked); the dialogs were not opened in this round.</li>
<li><b>NDC-2813:</b> a plain API create (no <code>source</code>, no owner) still gives the ticket to its creator; with <code>source: "api"</code> or <code>"web_form"</code> it stays unassigned and the rules route it. This matches the developer's note.</li>
<li><b>NDC-2814:</b> an assignment rule accepts at most 5 targets (<code>targets too_many</code>), so the six holiday cases used two rules.</li>
<li><b>NDC-2754:</b> the first screen run once showed "The ticket could not be loaded. The desk service is temporarily unavailable." and sent no request; the repeat run worked. Staging was slow all afternoon (30–90 s API calls, the owner session was revoked twice by other sign-ins).</li>
<li><b>Data:</b> NDC-2811..2814 reuse the QA AS6 departments, team, rules and agents from the 6–7 Nov assignment run; new objects start with "QA RT14" and are listed in the ledger below.</li></ul>
<h2>Per ticket</h2>${cards.join('')}
<h2>Test data and changes (clean up after Gate 2)</h2><pre>${esc(ledger)}</pre>
<h2>Security notes</h2><ul><li>No passwords or tokens were printed; sign-ins used the credentials files by column (one sign-in per account; the shared owner session had to be renewed twice because other people signed in). Saved sessions are in the scratchpad and will be deleted at cleanup.</li>
<li>Test tickets use qa.rt14@example.com / qa.as6@example.com; no reply was sent.</li>
<li>The 6–7 Nov assignment run folder keeps saved agent sessions in <code>out/*.json</code>, which git does not ignore; they should be deleted before that folder is committed.</li></ul>
</main></body></html>`;
fs.writeFileSync(path.join(RUN, 'report.html'), html); console.log('report.html', Math.round(html.length / 1024), 'KB');
