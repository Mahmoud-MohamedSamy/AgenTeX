// Builds executions/execu_2026-11-01_desk-blueprint/run-report.html (self-contained; images embedded as base64).
// Result tables are read from report.md so the HTML never drifts from the markdown record.
const fs = require('fs'); const path = require('path');
const RUN = path.resolve(__dirname, '..');
const md = fs.readFileSync(path.join(RUN, 'report.md'), 'utf8');
const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const inline = s => esc(s).replace(/\*\*(.+?)\*\*/g, '<b>$1</b>').replace(/`(.+?)`/g, '<code>$1</code>');
const img = f => 'data:image/png;base64,' + fs.readFileSync(path.join(RUN, f)).toString('base64');

// Pull the markdown tables that have an "Area | Spec rows | Result" header, in order (Phase 1, Phase 2).
function tables() {
  const out = []; const lines = md.split(/\r?\n/);
  for (let i = 0; i < lines.length; i++) {
    if (/^\| Area \| Spec rows \| Result \|/.test(lines[i])) {
      const rows = []; i += 2;
      while (i < lines.length && lines[i].startsWith('|')) { rows.push(lines[i].split('|').slice(1, -1).map(c => c.trim())); i++; }
      out.push(rows);
    }
  }
  return out;
}
const cls = r => /inconclusive|not runnable/i.test(r) ? 'inc' : /fail/i.test(r) ? 'fail' : /record|differs/i.test(r) ? 'rec' : 'pass';
const note = r => {
  const t = r.replace(/\*\*/g, '').replace(/^(Pass|Fail|Record|Inconclusive)\b(\s*\/\s*record\b)?\s*[:—\/-]?\s*/i, '').trim();
  return /^record$/i.test(t) ? '' : t.replace(/^\((.*)\)$/, '$1');
};
const label = { pass: 'Pass', fail: 'Fail', inc: 'Inconclusive', rec: 'Record' };
const table = rows => `<div class="tw"><table><thead><tr><th>Area</th><th>Spec rows</th><th>Result</th></tr></thead><tbody>${rows.map(([a, s, r]) => {
  const c = cls(r); return `<tr class="${c}"><td>${inline(a)}</td><td class="ids">${inline(s)}</td><td><span class="pill ${c}">${label[c]}</span> ${inline(note(r))}</td></tr>`;
}).join('')}</tbody></table></div>`;
const [p1, p2, p3, p4] = tables();
const cnt = rows => rows.reduce((m, r) => (m[cls(r[2])]++, m), { pass: 0, fail: 0, inc: 0, rec: 0 });
const c3 = cnt(p3);

const bugs = [
  ['NDC-2758', 'Entry criteria in an unknown shape is saved and catches every ticket', 'Still fails', 'fail', 'Filed 1 Nov (Medium). Annotated evidence vs Zoho attached.'],
  ['NDC-2757', '"Close ticket" offered on a ticket inside a blueprint', 'Still fails', 'fail', 'Narrowed: server refuses at the last step; no data harm.'],
  ['NDC-2756', 'Time-limit example uses Mon–Fri 9–5 while business hours are 24×7', 'Still fails', 'fail', ''],
  ['NDC-2755', 'Automatic close is hidden in the state panel and can\'t be changed there', 'Still fails', 'fail', 'Narrowed: kept after save and publish, not lost.'],
  ['NDC-2753', 'Attachment in a transition', 'Still fails', 'fail', 'Upload shows a green tick, Run answers 422 "File … does not belong to you." Re-check comment posted 2 Nov.'],
];
const finds = [
  ['NDC-2761', 'G3', 'The API saves a state warning that is not before the time limit', 'slaMinutes 120 + warning 120 → 201; warning 120 with limit 60 → 201; a warning with no limit → 201. The designer blocks this ("The warning must come before the time limit.").', 'Medium'],
  ['NDC-2762', 'G4', 'The API saves a negative time limit', 'slaMinutes −1 → 201 (0 is also saved; 1.5 and text are refused).', 'Medium'],
  ['NDC-2763', 'G5', 'The API saves an automatic move pointing at a transition from another state', 'State Open with autoTransitionId = a transition that starts at Escalated → 201. The same mistake in customer triggers is refused (G9).', 'Medium'],
  ['NDC-2764', 'L3', 'A workflow rule can change Status on a ticket the blueprint controls', 'QA workflow On Edit, Field Update Status = Closed: after a transition the rule ran, Status became Closed and the ticket left the blueprint. A direct API status change on the same ticket is refused (TICKET_IN_BLUEPRINT). Same family as NDC-2730 (CRM). Happens through normal admin setup.', 'High'],
];
const newFinds = [
  ['NDC-2774', 'G6, K8', 'With business hours set to Mon–Fri, blueprint state and SLA due times still count Saturday', 'Ticket entered Mon 2 Nov 11:57: blueprint state (5 days, business clock) due Sat 11:57; department SLA resolution (120 business hours) due 07/11/2026 11:57 while showing "4 days 11 hours of business time left". Holidays are skipped correctly.', 'High'],
  ['NDC-2775', 'C20', 'A status a live blueprint uses can be removed when no ticket is in it, and tickets then move into the removed status', 'Removal accepted (200); a transition then moves ticket #1109 into "QA BP Verify", no longer a status. With a ticket already in the state the removal is refused (FIELD_OPTION_IN_BLUEPRINT).', 'Medium'],
];
const figs = [
  ['evidence/annotated/BP-C3-name-rules-vs-zoho.png', 'C3 — blueprint name rules differ from Zoho (special characters, 60-character limit)', ''],
  ['evidence/annotated/NDC-2758-vs-zoho.png', 'NDC-2758 — TAVI (left) vs Zoho (right)', 'Ticket #966 does not match the criteria but entered the blueprint; Zoho makes "All Records" an explicit choice.'],
  ['evidence/BP-G11_NDC-2755.png', 'NDC-2755 — state panel shows "No limit" while an automatic close is set', ''],
  ['evidence/BP-G7_NDC-2756.png', 'NDC-2756 — Mon–Fri 9–5 example on a 24×7 tenant', ''],
  ['evidence/BP-J6_NDC-2757.png', 'NDC-2757 — Close ticket refused only after confirming', ''],
  ['evidence/annotated/BP-P2-1-vs-zoho.png', 'NDC-2761 — warning not before the limit', ''],
  ['evidence/annotated/BP-P2-2-vs-zoho.png', 'NDC-2762 — negative time limit', ''],
  ['evidence/annotated/BP-P2-3-vs-zoho.png', "NDC-2763 — automatic move to another state's transition", ''],
  ['evidence/annotated/BP-P2-4-vs-zoho.png', 'NDC-2764 — workflow rule closes a ticket in a blueprint', ''],
  ['evidence/annotated/BP-BH-weekend-vs-zoho.png', 'NDC-2774 — business hours Mon–Fri, due times still count Saturday', ''],
  ['evidence/annotated/BP-C20-removed-status-vs-zoho.png', 'NDC-2775 — removed status still used by a live blueprint', ''],
  ['evidence/raw/K16-ticket-sla.png', 'K16 pass — department SLA and state limit both overdue, shown separately', ''],
];
const notRun = [
  ['Zoho writes (user OK pending)', 'C4 duplicate name on save, K15/K17 state timer and reapply, L7 department move — live in Zoho'],
  ['Desk email trace / readable mailbox', 'F6 (transition runs; no email record)'],
  ['Agent account changes / 10+ departments', 'D5 owner removed, D8 share limit'],
  ['Customer mailbox', 'K3–K5 reply / rating triggers'],
  ['Webhook receiver / safe custom action', 'F5, K12, F7, K13'],
  ['IM channel', 'N10'],
  ['Staging responsive enough to open the designer', 'C20 designer warning, N8 designer load time (re-measure)'],
];

const html = `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Desk Blueprint Run</title>
<style>
:root{--bg:#f6f7f9;--card:#fff;--ink:#1d2330;--mute:#5d6676;--line:#e3e6eb;--fail:#d9332b;--inc:#c77700;--ok:#1e8e4e;--rec:#5b6bd1;--acc:#2a5bd7;--chip:#eef2fb}
@media (prefers-color-scheme:dark){:root:not([data-theme=light]){--bg:#12151b;--card:#1b1f27;--ink:#e6e9ef;--mute:#9aa3b2;--line:#2c323d;--chip:#232a38;--acc:#7ea2ff;--rec:#9aa6ff}}
:root[data-theme=dark]{--bg:#12151b;--card:#1b1f27;--ink:#e6e9ef;--mute:#9aa3b2;--line:#2c323d;--chip:#232a38;--acc:#7ea2ff;--rec:#9aa6ff}
*{box-sizing:border-box}body{margin:0;background:var(--bg);color:var(--ink);font:15px/1.55 "Segoe UI",system-ui,sans-serif}
main{max-width:1180px;margin:0 auto;padding:28px 16px 60px}h1{font-size:26px;margin:0 0 4px}h2{font-size:19px;margin:36px 0 12px;padding-bottom:6px;border-bottom:1px solid var(--line)}
.sub{color:var(--mute);margin:0 0 18px}code{font:13px Consolas,monospace;background:var(--chip);padding:1px 5px;border-radius:4px;overflow-wrap:anywhere}
.meta{display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:10px;margin:16px 0}.meta div{background:var(--card);border:1px solid var(--line);border-radius:8px;padding:10px 12px}.meta b{display:block;font-size:12px;color:var(--mute);font-weight:600;text-transform:uppercase;letter-spacing:.04em}
.phases{display:grid;grid-template-columns:1fr 1fr;gap:14px}@media (max-width:760px){.phases{grid-template-columns:1fr}}
.ph{background:var(--card);border:1px solid var(--line);border-radius:8px;padding:14px 16px}.ph h3{margin:0 0 8px;font-size:15px}
.stats{display:flex;gap:10px;flex-wrap:wrap}.stat{background:var(--chip);border-radius:8px;padding:8px 14px;min-width:96px}.stat strong{font-size:24px;display:block;font-variant-numeric:tabular-nums}
.stat.o strong{color:var(--ok)}.stat.f strong{color:var(--fail)}.stat.i strong{color:var(--inc)}
.bar{display:flex;height:8px;border-radius:4px;overflow:hidden;margin-top:12px;gap:2px}.bar i{display:block}
.card{background:var(--card);border:1px solid var(--line);border-left:4px solid var(--fail);border-radius:8px;padding:12px 16px;margin:10px 0}
.card h3{margin:0 0 4px;font-size:15px}.card p{margin:4px 0;color:var(--mute)}.card .id{font-weight:700;margin-right:8px}
.tag{display:inline-block;font-size:11px;font-weight:700;padding:1px 7px;border-radius:4px;background:var(--chip);color:var(--mute);margin-left:6px}
.pill{display:inline-block;font-size:11px;font-weight:700;padding:1px 8px;border-radius:10px;color:#fff;margin-right:4px}.pill.pass{background:var(--ok)}.pill.fail{background:var(--fail)}.pill.inc{background:var(--inc)}.pill.rec{background:var(--rec)}
.tw{overflow-x:auto;background:var(--card);border:1px solid var(--line);border-radius:8px}
table{border-collapse:collapse;width:100%;font-size:14px}th,td{text-align:left;padding:8px 12px;border-bottom:1px solid var(--line);vertical-align:top}th{font-size:12px;text-transform:uppercase;letter-spacing:.04em;color:var(--mute)}
tr:last-child td{border-bottom:0}td.ids{white-space:nowrap;color:var(--mute);font-size:13px}tr.fail td:first-child{box-shadow:inset 3px 0 var(--fail)}tr.inc td:first-child{box-shadow:inset 3px 0 var(--inc)}
@media (max-width:640px){td.ids{white-space:normal}}
.fig{background:var(--card);border:1px solid var(--line);border-radius:8px;padding:12px;margin:14px 0}.fig h3{margin:0 0 8px;font-size:15px}.fig img{width:100%;height:auto;border:1px solid var(--line);border-radius:4px;cursor:zoom-in}.fig p{margin:6px 0 0;font-size:13px;color:var(--mute)}
ul.list{background:var(--card);border:1px solid var(--line);border-radius:8px;padding:12px 16px 12px 34px;margin:10px 0}ul.list li{margin:4px 0}
.warn{background:var(--card);border:1px solid var(--line);border-left:4px solid var(--inc);border-radius:8px;padding:12px 16px}
#lb{position:fixed;inset:0;background:rgba(0,0,0,.85);display:none;align-items:center;justify-content:center;z-index:9;padding:16px;cursor:zoom-out}#lb.on{display:flex}#lb img{max-width:96vw;max-height:94vh}
@media print{.fig,.card{break-inside:avoid}}
</style></head><body><main>
<h1>Desk Blueprint + SLA tie-in — functional run</h1>
<p class="sub">TAVI Desk staging · Phases 1–3 (owner account; Phase 3 with approved tenant changes) · 1–2 November 2026</p>
<div class="meta">
<div><b>App</b>staging-desk.taviportal.com, org Anyware, owner account</div>
<div><b>Spec</b>docs/desk-blueprint/spec-desk-blueprint.md</div>
<div><b>Scope</b>QA WF Dept R; every record named "QA BP …"</div>
<div><b>Cleanup</b>All QA blueprints, tickets, rules, SLA policies and tasks deleted; final check found none</div></div>

<div class="phases">
<div class="ph"><h3>Phase 1 — 30 automated tests (1 Nov)</h3><div class="stats"><div class="stat o"><strong>26</strong>passed</div><div class="stat f"><strong>4</strong>failed</div></div>
<div class="bar"><i style="flex:26;background:var(--ok)"></i><i style="flex:4;background:var(--fail)"></i></div></div>
<div class="ph"><h3>Phase 2 — 20 API tests + screen checks (1–2 Nov)</h3><div class="stats"><div class="stat o"><strong>15</strong>passed</div><div class="stat f"><strong>4</strong>failed</div><div class="stat i"><strong>1</strong>inconclusive</div></div>
<div class="bar"><i style="flex:15;background:var(--ok)"></i><i style="flex:4;background:var(--fail)"></i><i style="flex:1;background:var(--inc)"></i></div></div>
<div class="ph"><h3>Phase 3 — approved tenant changes (2 Nov), by row</h3><div class="stats"><div class="stat o"><strong>${c3.pass}</strong>passed</div><div class="stat f"><strong>${c3.fail}</strong>failed</div></div>
<div class="bar"><i style="flex:${c3.pass};background:var(--ok)"></i><i style="flex:${c3.fail};background:var(--fail)"></i></div></div></div>

<h2>Phase 3 findings — filed 2 Nov (Bug, Sprint 14)</h2>
${newFinds.map(([id, row, t, d, p]) => `<div class="card"><h3><span class="id">${id}</span>${esc(t)}<span class="tag">${row}</span><span class="tag">${esc(p)}</span></h3><p>${esc(d)}</p></div>`).join('')}

<h2>Phase 2 findings — filed 2 Nov (Bug, Sprint 14)</h2>
${finds.map(([id, row, t, d, p]) => `<div class="card"><h3><span class="id">${id}</span>${esc(t)}<span class="tag">${row}</span><span class="tag">${esc(p)}</span></h3><p>${esc(d)}</p></div>`).join('')}
<p class="sub">NDC-2761 to 2763 happen only through the API (the designer prevents them), like NDC-2758, but a blueprint saved that way can go live and its timers silently fail. NDC-2764 happens through normal admin setup.</p>

<h2>Filed bugs — re-check</h2>
<div class="tw"><table><thead><tr><th>Ticket</th><th>Problem</th><th>Result</th><th>Note</th></tr></thead><tbody>
${bugs.map(([id, t, r, c, n]) => `<tr class="${c}"><td><b>${id}</b></td><td>${esc(t)}</td><td><span class="pill ${c}">${r}</span></td><td>${esc(n)}</td></tr>`).join('')}
</tbody></table></div>

<h2>Evidence</h2>
${figs.map(([f, t, c]) => `<div class="fig"><h3>${esc(t)}</h3><img src="${img(f)}" alt="${esc(t)}">${c ? `<p>${esc(c)}</p>` : ''}</div>`).join('')}

<h2>Phase 4 results by area — live Zoho comparison and NDC-Staging agents (2 Nov)</h2>
${table(p4 || [])}
<h2>Phase 3 results by area</h2>
${table(p3)}
<h2>Phase 2 results by area</h2>
${table(p2)}
<h2>Phase 1 results by area</h2>
${table(p1)}

<h2>Other notes</h2>
<ul class="list">
<li>A blueprint created by API and made active shows "Draft" in the designer header while it governs tickets.</li>
<li>A required multi-select field accepts an empty list.</li>
<li>No length limit on blueprint names (309 characters saved); duplicate names in one department are allowed.</li>
<li>In Arabic (right to left), a name ending in "&gt;" shows the bracket at the start.</li>
<li>Moving a ticket to another department takes it out of the blueprint; Zoho refuses the move.</li>
<li>The state's own timer keeps running while the ticket's status is On Hold (the department SLA pauses).</li></ul>

<h2>Incident during the run</h2>
<div class="warn">At about 23:49 on 1 Nov a test script opened two browser sessions from one saved sign-in. Both refreshed the same token and the server signed the owner account out everywhere. Anyone using that account then was logged out. The scripts now use one session per sign-in.</div>

<h2>Not run yet — what is needed</h2>
<div class="tw"><table><thead><tr><th>Needed</th><th>Spec rows</th></tr></thead><tbody>
${notRun.map(([n, r]) => `<tr><td>${esc(n)}</td><td>${esc(r)}</td></tr>`).join('')}</tbody></table></div>
<p class="sub">Full record: report.md in this folder · automation: automation/…/deskblueprint/ (BlueprintPhase2ApiTest and Phase 1 classes)</p>
</main><div id="lb"><img alt=""></div>
<script>const lb=document.getElementById('lb'),li=lb.querySelector('img');document.querySelectorAll('.fig img').forEach(i=>i.onclick=()=>{li.src=i.src;lb.classList.add('on')});lb.onclick=()=>lb.classList.remove('on');</script>
</body></html>`;
fs.writeFileSync(path.join(RUN, 'run-report.html'), html);
console.log('ok', p1.length, p2.length, (html.length / 1024 | 0) + ' KB');
