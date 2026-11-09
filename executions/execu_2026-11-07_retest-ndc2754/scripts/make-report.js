// NDC-2754 retest (7 Nov 2026): one self-contained report.html (images embedded) from specs/NDC-2754.json + ledger.md.
const fs = require('fs'); const path = require('path'); const RUN = path.join(__dirname, '..');
const spec = JSON.parse(fs.readFileSync(path.join(__dirname, 'specs', 'NDC-2754.json'), 'utf8'));
const esc = s => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;');
const img = (dir, f) => 'data:image/png;base64,' + fs.readFileSync(path.join(RUN, 'screenshots', dir, f)).toString('base64');
const VC = { PASS: '#16a34a', FAIL: '#dc2626', PARTIAL: '#d97706', BLOCKED: '#6b7280', INFO: '#2563eb', DECISION: '#7c3aed' };
const badge = v => `<span class="v" style="background:${VC[v] || '#6b7280'}">${v}</span>`;
const cnt = v => spec.rows.filter(r => r[4] === v).length;
const ledger = fs.readFileSync(path.join(RUN, 'ledger.md'), 'utf8');
const raws = [
  ['b5-admin-dept-search.png', 'Item 6: Share department picker (admin). The own department, QA RT13 2754 Dept A, is not offered'],
  ['a2-agent-alt-form.png', 'Item 2: the agent opens the ticket while owning QA alt; the Share item is refused with a message'],
  ['a6-agent-my-transitions.png', "Item 2: the agent's My Transitions view"],
  ['a4-agent-g1-after.png', 'Item 2: after the ticket left the state, it is no longer available to the agent'],
];
const html = `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>NDC-2754 retest</title><style>
:root{--bg:#f6f7f9;--fg:#111827;--mut:#4b5563;--card:#fff;--bd:#e5e7eb;--hl:#f5f3ff}
@media (prefers-color-scheme:dark){:root{--bg:#0f172a;--fg:#e5e7eb;--mut:#9ca3af;--card:#111827;--bd:#374151;--hl:#2e1065}}
body{margin:0;background:var(--bg);color:var(--fg);font:14px/1.5 "Segoe UI",system-ui,sans-serif}main{max-width:1240px;margin:0 auto;padding:16px}
h1{font-size:22px;margin:8px 0 4px}h2{margin-top:28px;font-size:18px}.meta{color:var(--mut);font-size:13px}
.kpi{display:flex;gap:12px;flex-wrap:wrap;margin:14px 0}.kpi div{background:var(--card);border:1px solid var(--bd);border-radius:8px;padding:10px 16px;min-width:110px}.kpi b{font-size:22px;display:block}
.wrap{overflow-x:auto}table{border-collapse:collapse;width:100%;background:var(--card)}td,th{border:1px solid var(--bd);padding:6px 8px;text-align:left;vertical-align:top;font-size:13px}th{background:var(--bg)}
.v{color:#fff;border-radius:4px;padding:1px 7px;font-size:12px;font-weight:600;white-space:nowrap}
.box{background:var(--card);border:1px solid var(--bd);border-radius:8px;padding:12px 16px;margin:14px 0}.dec{background:var(--hl);border-color:#7c3aed}
img{max-width:100%;border:1px solid var(--bd);border-radius:4px}figure{margin:12px 0}figcaption{color:var(--mut);font-size:13px}
.grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(320px,1fr));gap:12px}pre{white-space:pre-wrap;background:var(--card);border:1px solid var(--bd);padding:10px;font-size:12px;overflow-x:auto}
</style></head><body><main>
<h1>Retest NDC-2754 · Blueprint (with SLA tie-in) gap list ${badge(spec.verdict)}</h1>
<p class="meta">${esc(spec.env)} · ${esc(spec.date)}</p>
<div class="kpi"><div><b>${spec.rows.length}</b>checks</div><div><b style="color:#16a34a">${cnt('PASS')}</b>pass</div><div><b style="color:#7c3aed">${cnt('DECISION')}</b>decision</div><div><b style="color:#2563eb">${cnt('INFO')}</b>info</div><div><b style="color:#dc2626">${cnt('FAIL')}</b>fail</div></div>
<div class="box"><b>What the developer changed (Plane comment, 7 Nov):</b> item 6: a Share to the ticket's own department is refused (desk #233). Item 2: a transition owner (user or team, set in the blueprint or with "Assign owners") can open the ticket while it is in a state where they own a transition, sees it in their list and My Transitions, can run their step including its required reply, attachment, resolution, approval or share, cannot reply or edit outside the step, and loses access when the ticket leaves the state (metadata-engine #212, desk #234). The developer asked for item 6 and for item 2 with Desk Agent fedelav803.</div>
<div class="box dec"><b>Decision (QA lead, 7 Nov): moved to Bug.</b> Owning a step should be enough to complete it, including its required Share. A step owner with the Desk Agent profile cannot run a step that requires a Share: 403 "You are not allowed to add a share to this transition." The profile has no <code>desk:ticket:share</code> permission (a plain share is refused too), and the screen says "your access to this ticket does not include sharing. Ask an admin for access." The developer's note says the owner can run the step including its share.</div>
<h2>Results</h2><div class="wrap"><table><tr><th>Item</th><th>Check</th><th>Expected</th><th>Now (retest)</th><th>Result</th></tr>
${spec.rows.map(r => `<tr><td><b>${esc(r[0])}</b></td><td>${esc(r[1])}</td><td>${esc(r[2])}</td><td>${esc(r[3])}</td><td>${badge(r[4])}</td></tr>`).join('')}</table></div>
<h2>How it was tested</h2><div class="box"><ul>
<li>New test data in two QA departments: "QA RT13 2754 Dept A" (admin + fedelav803) and "QA RT13 2754 Dept B" (share target). The active blueprint "QA RT13 2754 full" uses Strict Mode (all) and dynamic owners. Its steps are QA alt (Share required), QA go (Amount &gt; 0 check), QA hold (approval required), QA rate, end and back.</li>
<li>Item 2 used tickets owned by the admin (G0–G5), so a Desk Agent cannot see them by default. The first pass on unassigned tickets (t0–t10) was discarded for item 2, because a Desk Agent can see unassigned tickets anyway.</li>
<li>The agent's access was checked by API (GET record, list, edit, reply, transition runs) and on screen (ticket page, My Transitions, the "not available" page).</li>
<li>Item 6 was checked by API with the own department alone, with the own department plus Dept B, with no share, and with Dept B only; also through the plain Share endpoint and in the form's department picker.</li></ul></div>
<h2>Annotated evidence</h2><figure><img src="${img('annotated', spec.out)}" alt="NDC-2754 annotated evidence"><figcaption>${esc(spec.out)} (to be attached to the Plane ticket)</figcaption></figure>
<h2>Screens (unannotated)</h2><div class="grid">${raws.map(([f, c]) => `<figure><img src="${img('raw', f)}" alt="${esc(c)}"><figcaption>${esc(c)}</figcaption></figure>`).join('')}</div>
<h2>Observations</h2><ul>
<li>Strict Mode also blocks the admin's own reassignment ("allows this only through a transition"), so a test ticket's owner must be set when it is created.</li>
<li>Transitions with no owners set can be run by any agent who can see the ticket (an agent ran QA go on an unassigned ticket). This looks like the design; noted for the team.</li>
<li>Item 10 (rating trigger) is configured but cannot run: Happiness Rating is off on NDC-Staging (<code>is_enabled false</code>). I did not change it.</li></ul>
<h2>Test data (cleanup after the Plane update)</h2><pre>${esc(ledger)}</pre>
<h2>Security notes</h2><ul><li>Sign-in used the credentials file by column; no passwords or tokens were printed or saved in the report. The saved session files are in the scratchpad and will be deleted at cleanup.</li><li>A reply draft (send=false) to qa.rt13@example.com was attempted as the agent and refused, so nothing was sent.</li></ul>
</main></body></html>`;
fs.writeFileSync(path.join(RUN, 'report.html'), html); console.log('report.html', Math.round(html.length / 1024), 'KB');
