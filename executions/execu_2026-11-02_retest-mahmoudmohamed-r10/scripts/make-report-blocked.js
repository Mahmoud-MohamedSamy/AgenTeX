// Round 10 — report on the tickets left BLOCKED (not moved in Plane): why each could not be finished and what is needed to finish it.
// Facts from notes-r10.md. Output: ../report-blocked.html (self-contained).
const fs = require('fs'); const path = require('path');
const RUN = path.join(__dirname, '..'); const META = JSON.parse(fs.readFileSync(path.join(RUN, 'meta.json'), 'utf8'));
const esc = s => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const pic = (dir, f) => { const p = path.join(RUN, 'screenshots', dir, f); return fs.existsSync(p) ? 'data:image/png;base64,' + fs.readFileSync(p).toString('base64') : null; };
const PC = { urgent: '#dc2626', high: '#ea580c', medium: '#ca8a04', low: '#2563eb' };
const T = [
  { n: '2661', state: 'Ready For Test (comment posted 2 Nov: screen not checked)', why: 'The API part passed (agent saves a ticket → 201, and can open it → 200). The screen part — no false "Permission denied." toast after Save — could not be run: on 3 Nov the agent\'s Desk session expired, the new sign-in returned nothing and staging-desk showed a blank page for more than 5 minutes.',
    done: ['Anyware 2 Nov: POST ticket as Desk Agent in own department → 201; GET → 200'],
    need: ['staging-desk loading normally', 'one sign-in of the NDC agent fedelav803 to Desk', 'create a ticket on screen and watch the toast (about 5 minutes)'], img: ['annotated', 'NDC-2661-retest-BLOCKED.png'] },
  { n: '2113', state: 'Ready For Test (comment posted 2 Nov)', why: 'The ticket\'s main point — a card holding a value removed from the pick list is shown with "This value is no longer an option" — needs a pick-list value to be added, used and removed. The API refuses pick-list edits (PATCH 405, PUT 400 for every body tried), and doing it in Modules and Fields changes a tenant-wide field. The 25 Oct failure (first drop on Unaccounted after load lands in Closed_lost) was on the Deals board, which could not be reproduced on Anyware (all deals carry a stage).',
    done: ['Leads Kanban by Lead Status: first drop after load of a card onto Unaccounted is refused, the card stays, no dialog'],
    need: ['OK to add and then remove a QA value on a pick list (e.g. Lead Status) on NDC-Staging through Modules and Fields', 'a Deals record without a stage (Unaccounted) on a QA Kanban view', 'then drag tests on the Deals board'], img: ['annotated', 'NDC-2113-retest-BLOCKED.png'] },
  { n: '2137', state: 'Ready For Test (comment posted 2 Nov)', why: 'A load-time ticket (Kanban headers + first cards within 2 s at p95). On 2 Nov staging pages took 28–90 s to load and the board measured was filtered to 0 cards, so no fair number could be taken. NDC-2136 (list load time) was measured on the same day and moved to Bug with that caveat.',
    done: ['switch list → Kanban 0.65–0.71 s ×3 on an empty (filtered) board'],
    need: ['staging at normal speed', '20 reloads of a Deals Kanban with real data, then the p95'], img: ['annotated', 'NDC-2137-retest-BLOCKED.png'] },
];
const card = t => { const m = META.find(x => x.key === 'NDC-' + t.n); const src = pic(t.img[0], t.img[1]);
  return `<section class="card"><h3>NDC-${t.n} <span class="b" style="background:${PC[m.pri]}">${esc(m.pri)}</span> <span class="b" style="background:#6b7280">blocked</span></h3><p class="t">${esc(m.name)} · ${esc(m.mod === 'None' ? 'CRM' : m.mod)}</p>
  <p><b>Plane:</b> ${esc(t.state)}</p><p><b>Why it is blocked:</b> ${esc(t.why)}</p>
  <p><b>Checked so far:</b></p><ul>${t.done.map(x => `<li>${esc(x)}</li>`).join('')}</ul>
  <p><b>Needed to finish:</b></p><ul>${t.need.map(x => `<li>${esc(x)}</li>`).join('')}</ul>
  ${src ? `<details><summary>Evidence — ${esc(t.img[1])}</summary><img src="${src}" alt=""></details>` : ''}</section>`; };
const html = `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Retest Round 10 — Blocked Tickets</title>
<style>:root{--bg:#f8fafc;--fg:#0f172a;--mut:#475569;--card:#fff;--bd:#e2e8f0}body{margin:0;font:14px/1.55 system-ui,Segoe UI,sans-serif;background:var(--bg);color:var(--fg)}main{max-width:1100px;margin:0 auto;padding:24px 16px}
h1{margin:0 0 4px}h2{margin:26px 0 10px}.mut{color:var(--mut)}.b{display:inline-block;color:#fff;border-radius:10px;padding:1px 9px;font-size:12px;font-weight:600;text-transform:uppercase}
table{border-collapse:collapse;width:100%;background:var(--card)}th,td{border:1px solid var(--bd);padding:6px 8px;text-align:left;vertical-align:top}th{background:#f1f5f9}.wrap{overflow-x:auto}
.card{background:var(--card);border:1px solid var(--bd);border-radius:10px;padding:14px 16px;margin:14px 0}.card h3{margin:0 0 4px}.t{color:var(--mut);margin:0 0 8px}ul{margin:4px 0 8px 20px}details summary{cursor:pointer;color:#2563eb}details img{max-width:100%;border:1px solid var(--bd);border-radius:6px;margin-top:6px}</style></head><body><main>
<h1>Retest round 10 — blocked tickets</h1>
<p class="mut">Mahmoud Mohamed · NDC · 2–3 Nov 2026 · report ${new Date().toISOString().slice(0, 10)}. These tickets were not moved in Plane (your instruction: leave blocked for now). Everything else in round 10 is posted: 2 Nov — 30 Done, 5 Bug; 3 Nov — 15 Done, 3 Bug (incl. NDC-2399 after the user disconnected the integration).</p>
<h2>Summary</h2><div class="wrap"><table><tr><th>Ticket</th><th>Priority</th><th>Blocked by</th><th>What unblocks it</th></tr>
<tr><td>NDC-2661</td><td>high</td><td>staging-desk not loading (3 Nov)</td><td>Desk loading normally; 5-minute screen check as the agent</td></tr>
<tr><td>NDC-2113</td><td>medium</td><td>needs a removed pick-list value; API refuses pick-list edits</td><td>OK to add / remove a QA pick-list value on NDC-Staging; a Deals record without a stage</td></tr>
<tr><td>NDC-2137</td><td>low</td><td>staging too slow to measure load times</td><td>a normal-speed staging day</td></tr>
</table></div>
<h2>Common causes</h2><ul>
<li><b>Staging availability (2–3 Nov):</b> pages 60–90 s to render, a metadata-engine outage, a permission-service outage (503) that signed sessions out, saves timing out (504 after ~180 s), local DNS for staging-desk dropping for ~2 min, staging-desk rendering blank pages.</li>
<li><b>Sessions:</b> one session per user — signing the same user into CRM and Desk signs the other out; the shared accounts are also signed out by other people.</li>
<li><b>Two-factor:</b> the Anyware owner now stops at a "Verify" step; NDC-Staging users must set up two-factor (owner by 09/11/2026, others by 10/11/2026) — after that the scripted sign-in will stop working unless a code is provided.</li>
<li><b>Anyware:</b> dropped on 3 Nov (your instruction); remaining work runs on NDC-Staging.</li></ul>
<h2>Ticket details</h2>${T.map(card).join('')}
</main></body></html>`;
fs.writeFileSync(path.join(RUN, 'report-blocked.html'), html); console.log('report-blocked.html', Math.round(html.length / 1024), 'KB');
