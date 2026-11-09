// Round 10 — report for the 15 tickets left after the 2 Nov Plane update, plus the screen checks finished since (2230, 2231, 2660, 2661).
// Facts from ev-r10-data.js / notes-r10.md. Output: ../report-remaining.html (self-contained, images embedded).
const fs = require('fs'); const path = require('path');
const RUN = path.join(__dirname, '..'); const E = require('./ev-r10-data.js');
const META = JSON.parse(fs.readFileSync(path.join(RUN, 'meta.json'), 'utf8'));
const esc = s => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const img = f => { const p = path.join(RUN, 'screenshots', 'annotated', f); return fs.existsSync(p) ? 'data:image/png;base64,' + fs.readFileSync(p).toString('base64') : null; };
const FIFTEEN = ['2174', '2235', '2251', '2262', '2399', '2637', '2639', '2643', '2644', '2248', '1630', '1637', '1643', '1659', '1660'];
const UPDATES = ['2230', '2231', '2660', '2661'];
const NOT_RUN = {
  2174: 'Gap list (13 items, mostly screen work in Desk Modules and Fields). Not started: Desk saves were timing out. Seen in passing: Modules and Fields now has a "Ticket Status" tab and the module page has Layout Rules and Validation Rules tabs (items 11 and NDC-1879 1–2) — not tested.',
  2399: 'Needs the CRM ⇄ Desk integration to run an initial sync (disconnect / connect) and the admin notice to be checked. Not started: saves were timing out.',
  2644: 'Needs an agent to Save draft in the reply composer and the draft to reach the server (GET drafts/mine). Not started: saves were timing out.',
  2248: 'Needs a Desk item in the Recycle Bin to be deleted forever. Not started: saves were timing out.',
};
const ACTION = { PASS: 'Done + comment + image', FAIL: 'Bug + comment + image', PARTIAL: 'Bug + comment + image', BLOCKED: 'comment only (stays in Ready For Test)', 'NOT RUN': 'no change' };
const VC = { PASS: '#16a34a', FAIL: '#dc2626', PARTIAL: '#d97706', BLOCKED: '#6b7280', 'NOT RUN': '#94a3b8' };
const PC = { urgent: '#dc2626', high: '#ea580c', medium: '#ca8a04', low: '#2563eb' };
const row = n => { const m = META.find(x => x.key === 'NDC-' + n); const e = E[n]; const v = e ? e.verdict : 'NOT RUN'; return { n, m, e, v }; };
const all = FIFTEEN.map(row); const upd = UPDATES.map(row);
const count = a => a.reduce((o, r) => (o[r.v] = (o[r.v] || 0) + 1, o), {});
const c15 = count(all);
const badge = (t, c) => `<span class="b" style="background:${c}">${esc(t)}</span>`;
const tr = r => `<tr><td><a href="#t${r.n}">NDC-${r.n}</a></td><td>${badge(r.m.pri, PC[r.m.pri])}</td><td>${esc(r.m.mod === 'None' ? 'CRM (no module)' : r.m.mod)}</td><td>${esc(r.m.name)}</td><td>${badge(r.v, VC[r.v])}</td><td>${esc(r.e ? r.e.sum : NOT_RUN[r.n])}</td><td>${esc(ACTION[r.v])}</td></tr>`;
const card = r => { if (!r.e) return `<section class="card" id="t${r.n}"><h3>NDC-${r.n} ${badge(r.m.pri, PC[r.m.pri])} ${badge('NOT RUN', VC['NOT RUN'])}</h3><p class="t">${esc(r.m.name)}</p><p>${esc(NOT_RUN[r.n])}</p></section>`;
  const f = `NDC-${r.n}-retest-${r.e.verdict}.png`; const src = img(f);
  return `<section class="card" id="t${r.n}"><h3>NDC-${r.n} ${badge(r.m.pri, PC[r.m.pri])} ${badge(r.v, VC[r.v])}</h3><p class="t">${esc(r.m.name)}</p><p>${esc(r.e.sum)}</p>
  <table class="chk"><tr><th>Check</th><th>Step</th><th>Expected (ticket)</th><th>Now</th><th></th></tr>${r.e.rows.map(x => `<tr><td>${esc(x[0])}</td><td>${esc(x[1])}</td><td>${esc(x[4])}</td><td>${esc(x[2])}</td><td>${x[3] === 'ok' ? badge('PASS', VC.PASS) : x[3] === 'bad' ? badge('FAIL', VC.FAIL) : badge('INFO', '#2563eb')}</td></tr>`).join('')}</table>
  ${src ? `<details><summary>Annotated evidence — ${esc(f)}</summary><img src="${src}" alt="${esc(f)}"></details>` : ''}</section>`; };
const html = `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Retest Round 10 — Remaining Tickets</title>
<style>:root{--bg:#f8fafc;--fg:#0f172a;--mut:#475569;--card:#fff;--bd:#e2e8f0}body{margin:0;font:14px/1.5 system-ui,Segoe UI,sans-serif;background:var(--bg);color:var(--fg)}main{max-width:1200px;margin:0 auto;padding:24px 16px}
h1{margin:0 0 4px}h2{margin:28px 0 10px}.mut{color:var(--mut)}.b{display:inline-block;color:#fff;border-radius:10px;padding:1px 9px;font-size:12px;font-weight:600;text-transform:uppercase;white-space:nowrap}
.sum{display:flex;gap:10px;flex-wrap:wrap;margin:14px 0}.sum div{background:var(--card);border:1px solid var(--bd);border-radius:8px;padding:10px 16px;min-width:110px}.sum b{font-size:22px;display:block}
table{border-collapse:collapse;width:100%;background:var(--card)}th,td{border:1px solid var(--bd);padding:6px 8px;text-align:left;vertical-align:top}th{background:#f1f5f9}
.card{background:var(--card);border:1px solid var(--bd);border-radius:10px;padding:14px 16px;margin:14px 0}.card h3{margin:0 0 4px}.t{color:var(--mut);margin:0 0 8px}.chk{margin:8px 0;font-size:13px}
details summary{cursor:pointer;color:#2563eb;margin:6px 0}details img{max-width:100%;border:1px solid var(--bd);border-radius:6px;margin-top:6px}ul{margin:6px 0 6px 20px}.wrap{overflow-x:auto}</style></head><body><main>
<h1>Retest round 10 — the 15 remaining tickets</h1>
<p class="mut">Mahmoud Mohamed · NDC · tenant <b>Anyware</b> (staging-crm / staging-desk) · retested 2 Nov 2026 (afternoon, after staging came back) · report ${new Date().toISOString().slice(0, 10)}. Accounts: owner (anyware-staging-owner), test user 3 as Desk Agent. Method: API + Edge (headless) screens; no new automation scripts (user's instruction).</p>
<p class="mut">These are the 15 tickets that were still untested when the first 41 were posted to Plane on 2 Nov (30 Done, 5 Bug, 6 comment only). <b>Nothing in this report has been posted to Plane yet.</b></p>
<div class="sum"><div><b>${all.length}</b>tickets</div><div><b style="color:${VC.PASS}">${c15.PASS || 0}</b>pass</div><div><b style="color:${VC.PARTIAL}">${c15.PARTIAL || 0}</b>partial</div><div><b style="color:${VC.BLOCKED}">${c15.BLOCKED || 0}</b>blocked</div><div><b style="color:${VC['NOT RUN']}">${c15['NOT RUN'] || 0}</b>not run yet</div></div>
<h2>Results — 15 tickets</h2><div class="wrap"><table><tr><th>Ticket</th><th>Priority</th><th>Module</th><th>Title</th><th>Verdict</th><th>Result</th><th>Proposed Plane action</th></tr>${all.map(tr).join('')}</table></div>
<h2>Screen checks finished for already-posted tickets</h2><p class="mut">These four were posted on 2 Nov as comment-only ("screen not checked"). Their screen check is now done:</p>
<div class="wrap"><table><tr><th>Ticket</th><th>Priority</th><th>Module</th><th>Title</th><th>Verdict now</th><th>Result</th><th>Proposed Plane action</th></tr>${upd.map(r => tr(r).replace(esc(ACTION[r.v]), esc(r.v === 'PASS' ? 'Done + new comment + image' : 'no change (screen still pending)'))).join('')}</table></div>
<h2>Staging conditions on 2 Nov</h2><ul>
<li>Pages took 60–90 s to show anything; Leads list first rows 28–47 s.</li>
<li>~10:40 UTC: Kanban "The metadata-engine service is temporarily unavailable"; ~13:00–13:40 UTC staging-desk module pages stayed blank; owner sign-in failed once.</li>
<li>~14:30 UTC: every audit / permission call 503 "Permission service is temporarily unavailable", sessions signed out.</li>
<li>From ~15:30 UTC: reads work, but every save times out (504 after ~180–194 s) — this blocked NDC-2637, NDC-2262 and the four tickets not run.</li></ul>
<h2>Observations (not filed)</h2><ul>
<li>Desk ticket History shows a raw row: "BlueprintStateChanged · Detail Test Tickets From Mail &amp; Webform|entered|Open".</li>
<li>Desk Recycle Bin Module filter offers Parent Skill, Skill and Skill Category (Users &amp; Security) — configuration entities (see NDC-1659).</li>
<li>Desk visibility rule (NDC-2231): while the field is shown, the record API doesn't enforce its Required flag (ctrl = x without the field → 201).</li>
<li>In Desk Modules and Fields, clicking a row's status switch flips it on screen; after a reload it was back on and the server was unchanged (Tickets still active, last modified 25 Oct).</li></ul>
<h2>Ticket details</h2>${all.map(card).join('')}
<h2>Already-posted tickets — screen check details</h2>${upd.map(card).join('')}
<h2>Test data and cleanup</h2><p>All QA data of round 10 is listed in <code>ledger.md</code> (records, views, rules, blueprint, portal, scoring rule, web form, Desk QA modules, Desk rules / tickets / activities). Still to undo: test user 3 is a Desk Agent and a member of "QA WF Dept R". Cleanup runs once at the end of the round.</p>
</main></body></html>`;
fs.writeFileSync(path.join(RUN, 'report-remaining.html'), html);
console.log('report-remaining.html', Math.round(html.length / 1024), 'KB', JSON.stringify(c15));
